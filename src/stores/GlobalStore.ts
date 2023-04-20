import { defineStore } from "pinia";
import {
  AccountInfo,
  Connection,
  ParsedAccountData,
  PublicKey,
  RpcResponseAndContext,
} from "@solana/web3.js";
import { ItemType, StarAtlasAPIItem } from "../static/StarAtlasAPIItem";
import { useLocalStorage } from "@vueuse/core";
import { CURRENCIES, E_CURRENCIES } from "../static/currencies";
import { Api, Trade } from "../static/swagger/skullnbones_api/skullnbones_api";
import { get_multi_price } from "../static/swagger/birdseye_api/birdseye_api";

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

export const useGlobalStore = defineStore("globalStore", {
  state: () => ({
    is_dark: useLocalStorage("is_dark", false),
    rpc: useLocalStorage("rpc_local_store", endpoints_list[0]),
    connection: {} as Connection,
    symbol: {
      name: "FOODATLAS",
      mint_asset: new PublicKey("foodQJAztMzX1DKpLaiounNe2BDMds5RNuPC6jsNrDG"),
      mint_pair: new PublicKey("ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx"),
    },
    wallet: {
      address: "none",
      is_web_wallet_connected: false,
      tokenRaw: [] as Array<{
        pubkey: PublicKey;
        account: AccountInfo<ParsedAccountData>;
      }>,
      tokenInfo: [] as Array<TokenInfo>,
      historySorted: [] as Array<TableGroupedHistory>,
      historyRaw: [] as Array<Trade>,
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
    },

    update_symbol(symbol: string, mint_asset: string, mint_currency: string) {
      this.symbol.name = symbol;
      this.symbol.mint_asset = new PublicKey(mint_asset);
      this.symbol.mint_pair = new PublicKey(mint_currency);
    },

    async update_connection(rpc_name: string) {
      this.rpc =
        endpoints_list.find((e) => e.name === rpc_name) ?? endpoints_list[0];
      this.connection = new Connection(this.rpc.url, { httpHeaders: {} });
    },

    async load_sa_api() {
      await fetch("https://galaxy.staratlas.com/nfts")
        .then((resp) => resp.json())
        .then((data) => (this.sa_api_data = data));
    },

    async load_wallet_tokens() {
      this.wallet.tokenInfo = [];
      //Fetch_sol_token
      this.wallet.tokenInfo.push({
        amount:
          (await this.connection.getBalance(
            new PublicKey(this.wallet.address)
          )) * Math.pow(10, -9),
        address: "So11111111111111111111111111111111111111112",
        price: -1.0,
        usd_value: -1.0,
      });

      //Fetch other_tokens
      //let token_mints = CURRENCIES.flatMap((c) => new PublicKey(c.mint));

      let response_tokenAccounts =
        await this.connection.getParsedTokenAccountsByOwner(
          new PublicKey(this.wallet.address),
          {
            programId: new PublicKey(
              "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            ),
          }
        );

      this.wallet.tokenRaw = response_tokenAccounts.value;

      response_tokenAccounts.value.forEach((token_account) => {
        const parsedAccountInfo = token_account.account.data;
        const amount =
          parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
        if (amount > 0) {
          this.wallet.tokenInfo.push({
            amount: amount,
            address: parsedAccountInfo["parsed"]["info"]["mint"],
            price: -1.0,
            usd_value: -1.0,
          });
        }
      });

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

    async load_wallet_trades() {
      const api = new Api({ baseUrl: "https://api2.skullnbones.xyz" });

      this.wallet.historySorted = [];
      api.trades
        .getAddress({ address: this.wallet.address })
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
  },
});
