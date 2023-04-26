import { defineStore } from "pinia";
import {
  AccountInfo,
  Connection,
  ParsedAccountData,
  PublicKey,
} from "@solana/web3.js";
import { ItemType, StarAtlasAPIItem } from "../static/StarAtlasAPIItem";
import { useLocalStorage } from "@vueuse/core";
import { CURRENCIES, E_CURRENCIES } from "../static/currencies";
import { Api, Trade } from "../static/swagger/skullnbones_api/skullnbones_api";
import { get_multi_price } from "../static/swagger/birdseye_api/birdseye_api";

import { Metaplex, Nft, SftWithToken } from "@metaplex-foundation/js";
import { useWallet } from "solana-wallets-vue";
import { BirdsEyePricesResponse } from "../static/swagger/birdseye_api/birdsyste_pirces_response";
import { useStaratlasGmStore } from "./StaratlasGmStore";

export interface Status {
  is_initalized: boolean;
  is_loading: boolean;
  message: string;
  step?: number;
  step_total?: number;
}

export interface RPCEndpoint {
  name: string;
  url: string;
}

export const endpoints_list: RPCEndpoint[] = [
  { name: "extrnode", url: "https://solana-mainnet.rpc.extrnode.com" },
  { name: "ankr", url: "https://rpc.ankr.com/solana" },
  { name: "solana-main", url: "https://api.mainnet-beta.solana.com/" },
  { name: "solana-serum", url: "https://solana-api.projectserum.com/" },
];

export interface TokenInfo {
  address: String;
  amount: number;
  price: number;
  usd_value: number;
  meta?: SftWithToken;
  image_url?: string;
}

export interface TableGroupedHistory {
  key: string;
  data: TableGroupedElement;
  children: Array<TableGroupedHistoryChilds>;
}

export interface TableGroupedHistoryChilds {
  key: string;
  data: TableGroupedElement;
}

export interface TableGroupedElement {
  name: string;
  symbol: string;
  type: string;
  size: string;
  total_cost: string;
  currency_mint: string;
  currency_string: string;
  time_string: string;
  price: string;
}

export interface NftsData {
  is_loading: boolean;
  data: Array<{ key: string; metadata: Nft; json: Object }>;
}

export interface Toggables {
  load_tokens: boolean;
  load_nfts: boolean;
  load_score: boolean;
  load_history: boolean;
}

export const useGlobalStore = defineStore("globalStore", {
  state: () => ({
    status: {} as Status,
    toggleables: useLocalStorage("toggables", {
      load_tokens: true,
      load_nfts: true,
      load_history: true,
      load_score: true,
    }) as unknown as Toggables,
    is_dark: useLocalStorage("is_dark", false),
    rpc: useLocalStorage("rpc_local_store", endpoints_list[0]),
    currencyPrice: {} as BirdsEyePricesResponse,
    connection: {} as Connection,
    symbol: {
      name: "FOODATLAS",
      mint_asset: new PublicKey("foodQJAztMzX1DKpLaiounNe2BDMds5RNuPC6jsNrDG"),
      mint_pair: new PublicKey("ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx"),
    },
    wallet: {
      address: "",
      sol_balance: 0,
      is_web_wallet_connected: false,
      tokenRaw: [] as Array<{
        pubkey: PublicKey;
        account: AccountInfo<ParsedAccountData>;
      }>,
      tokenInfo: [] as Array<TokenInfo>,
      historySorted: [] as Array<TableGroupedHistory>,
      historyRaw: [] as Array<Trade>,
      nfts: {} as NftsData,
    },
    sa_api_data: [] as StarAtlasAPIItem[],
  }),
  getters: {
    get_wallet_volume_usdc(): number {
      return this.wallet.historyRaw
        .filter(
          (h) =>
            h.currency_mint ===
            CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)?.mint
        )
        .flatMap((h) => h.price * h.asset_change)
        .reduce((sum, current) => sum + current, 0);
    },
    get_wallet_volume_atlas(): number {
      return this.wallet.historyRaw
        .filter(
          (h) =>
            h.currency_mint ===
            CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)?.mint
        )
        .flatMap((h) => h.price * h.asset_change)
        .reduce((sum, current) => sum + current, 0);
    },
  },
  actions: {
    async toggleDark() {
      this.is_dark = !this.is_dark;
    },
    async init() {
      this.connection = new Connection(this.rpc.url, { httpHeaders: {} });
      await this.sa_api_update();
      await this._currency_update();
    },

    update_toggables(
      load_tokens: boolean,
      load_nfts: boolean,
      load_score: boolean,
      load_history: boolean
    ) {
      this.toggleables.load_tokens = load_tokens;
      this.toggleables.load_nfts = load_nfts;
      this.toggleables.load_score = load_score;
      this.toggleables.load_history = load_history;
    },

    update_symbol(symbol: string, mint_asset: string, mint_currency: string) {
      this.symbol.name = symbol;
      this.symbol.mint_asset = new PublicKey(
        this.sa_api_data.find((asset) => symbol.includes(asset.symbol))?.mint ??
          ""
      );
      this.symbol.mint_pair = new PublicKey(
        CURRENCIES.find((c) => symbol.includes(c.name))?.mint ?? ""
      );
    },

    async update_connection(rpc_name: string) {
      this.rpc =
        endpoints_list.find((e) => e.name === rpc_name) ?? endpoints_list[0];
      this.connection = new Connection(this.rpc.url, { httpHeaders: {} });
    },

    async _currency_update() {
      this.status = _update_status(true, "Loading Currency Prices", 0, 1);
      await this._load_currency_prices();
      this.status = _update_status(false, "Updated Currency Prices", 1, 1);
    },

    async sa_api_update() {
      this.status = _update_status(true, "Loading SA API Data", 0, 1);
      await this._load_sa_api();
      this.status = _update_status(false, "Updated SA API Data", 0, 1);
    },

    async update_wallet(wallet: string) {
      this.wallet.address = wallet;
      PublicKey.isOnCurve(new PublicKey(wallet));

      if (this.toggleables.load_tokens) {
        this.status = _update_status(true, "Loading wallet tokens...", 0, 3);
        await this._load_wallet_tokens();
      }

      if (this.toggleables.load_history) {
        this.status = _update_status(true, "Loading wallet trades...", 1, 3);
        await this._load_wallet_history();
      }

      if (this.toggleables.load_nfts) {
        this.status = _update_status(true, "Loading wallet NFTs...", 2, 3);
        await this._load_wallet_nfts().catch((err) =>
          console.log("error fetching nfts")
        );
      }

      if (this.toggleables.load_score) {
        await useStaratlasGmStore().update_score_data();
      }

      this.status = _update_status(false, "Updated Wallet", 3, 3);
    },

    async _load_currency_prices() {
      const mapped_currency_mints = CURRENCIES.flatMap((c) => c.mint);
      const price_response = await get_multi_price(mapped_currency_mints);
      if (price_response) {
        this.currencyPrice = price_response;
      }
    },

    async _load_sa_api() {
      await fetch("https://galaxy.staratlas.com/nfts")
        .then((resp) => resp.json())
        .then((data) => (this.sa_api_data = data));
    },

    async _load_wallet_tokens() {
      this.wallet.tokenInfo = [];
      //Fetch_sol_token
      this.wallet.sol_balance =
        (await this.connection.getBalance(new PublicKey(this.wallet.address))) *
        Math.pow(10, -9);

      //Fetch other_tokens
      let response_tokenAccounts =
        await this.connection.getParsedTokenAccountsByOwner(
          new PublicKey(this.wallet.address),
          {
            programId: new PublicKey(
              "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            ),
          }
        );

      //filter for tokens and remove nfts
      this.wallet.tokenRaw = response_tokenAccounts.value.filter(
        (resp) => resp.account.data.parsed.info.tokenAmount.decimals > 0
      );

      const metaplex_connection = Metaplex.make(new Connection(this.rpc.url));

      for (let [idx, token_account] of this.wallet.tokenRaw.entries()) {
        this.status = _update_status(
          true,
          "Loading metadata...",
          idx,
          response_tokenAccounts.value.length
        );

        let token_meta = undefined;
        // let token_meta = await metaplex_connection
        //   .nfts()
        //   .findAllByOwner({
        //     owner: new PublicKey(token_account.account.data.parsed.info.mint),
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });

        const parsedAccountInfo = token_account.account.data;

        console.log(token_meta);

        const amount =
          parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
        if (amount > 0) {
          this.wallet.tokenInfo.push({
            amount: amount,
            address: parsedAccountInfo["parsed"]["info"]["mint"],
            price: -1.0,
            usd_value: -1.0,
            meta: token_meta
              ? (token_meta as unknown as SftWithToken)
              : undefined,
            image_url: "",
          });
        }
      }

      //Fetch Prices
      let addresses = this.wallet.tokenInfo.flatMap((t) =>
        t.address.toString()
      );
      let prices_response = await get_multi_price(addresses);
      console.log(prices_response);
      if (prices_response) {
        this.wallet.tokenInfo.forEach((token, idx) => {
          this.wallet.tokenInfo[idx].price =
            prices_response?.data[token.address.toString()]?.value ?? 0;

          this.wallet.tokenInfo[idx].usd_value =
            this.wallet.tokenInfo[idx].price *
            this.wallet.tokenInfo[idx].amount;
        });
      }
    },

    async _load_wallet_history() {
      const api = new Api({ baseUrl: "https://api2.skullnbones.xyz" });

      this.wallet.historySorted = [];
      api.trades
        .getAddress({ address: this.wallet.address, limit: 1000 })
        .then((resp) => resp.data)
        .then((api_data) => {
          this.wallet.historyRaw = api_data;
          let key_idx = 0;
          for (let type in ItemType) {
            let filtered_sa_api = this.sa_api_data.filter(
              (sa) =>
                sa.attributes.itemType.toUpperCase() === type.toUpperCase()
            );

            let filtered_trades = api_data.filter((api) =>
              filtered_sa_api.some((f) => f.mint === api.asset_mint)
            );

            if (filtered_trades.length) {
              this.wallet.historySorted.push({
                key: key_idx.toString(),
                data: {
                  name: type,
                  symbol: "",
                  type: "",
                  size: "",
                  price: "",
                  currency_mint: "",
                  currency_string: "",
                  time_string: "",
                  total_cost: "",
                },
                children: filtered_trades.flatMap((filtered, idx) => {
                  {
                    return {
                      key: key_idx.toString() + "-" + idx.toString(),
                      data: {
                        name:
                          this.sa_api_data.find(
                            (api) => api.mint === filtered.asset_mint
                          )?.name ?? "none",
                        symbol: filtered.symbol,
                        type: type,
                        currency_mint: filtered.currency_mint,
                        size: filtered.asset_change.toString(),
                        price: filtered.price.toString(),
                        total_cost: (
                          filtered.asset_change * filtered.price
                        ).toString(),
                        currency_string:
                          CURRENCIES.find(
                            (c) => c.mint === filtered.currency_mint
                          )?.name ?? "",
                        time_string: new Date(
                          filtered.timestamp * 1000
                        ).toISOString(),
                      },
                    };
                  }
                }),
              });
            }
            key_idx++;
          }
        });
    },

    async _load_wallet_nfts() {
      this.wallet.nfts.is_loading = true;
      const connection = new Connection(
        "https://api.metaplex.solana.com",
        "confirmed"
      );
      const metaplex = new Metaplex(connection);
      const data = await metaplex.nfts().findAllByOwner(
        {
          owner: new PublicKey(useWallet().publicKey.value?.toString() ?? ""),
        },
        {}
      );

      console.log(data);

      this.wallet.nfts.data = [];

      for (const d of data) {
        let json_data = "";
        await fetch(d.uri)
          .then((resp) => resp.json())
          .then((json) => (json_data = json))
          .catch((err) => console.log(err));

        this.wallet.nfts.data.push({
          key: "0",
          metadata: d as Nft,
          json: json_data,
        });
      }

      this.wallet.nfts.is_loading = false;
      console.log(this.wallet.nfts);
    },
  },
});

export function _update_status(
  is_loading: boolean,
  message: string,
  step?: number,
  step_total?: number
): Status {
  return {
    is_initalized: true,
    is_loading: is_loading,
    message: message,
    step: step,
    step_total: step_total,
  };
}
