import { defineStore } from "pinia";
import {
  AccountInfo,
  Connection,
  ParsedAccountData,
  PublicKey,
} from "@solana/web3.js";
import { StarAtlasAPIItem } from "../static/StarAtlasAPIItem";
import { useLocalStorage } from "@vueuse/core";
import { CURRENCIES } from "../static/currencies";
import { get_multi_price } from "../static/swagger/birdseye_api/birdseye_api";

import {
  Metaplex,
  Nft,
  NftWithToken,
  Sft,
  SftWithToken,
} from "@metaplex-foundation/js";
import { useWallet } from "solana-wallets-vue";
import { BirdsEyePricesResponse } from "../static/swagger/birdseye_api/birdsyste_pirces_response";
import { useStaratlasGmStore } from "./StaratlasGmStore";
import { I_SAG_Player } from "../static/apis/SA_Galaxy/I_SAG_Player";
import { get_player_profile } from "../static/apis/SA_Galaxy/SA_Galaxy";
import { I_SagePrize } from "../static/apis/SA_Galaxy/I_Sage_Prizes";
import * as tokenlist from "../static/apis/TokenList/I_TokenList";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { TOKEN_LIST } from "../static/apis/TokenList/TokenList";

export interface Status {
  is_initialized: boolean;
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

export interface I_TokenData {
  token_account: String;
  token_mint: String;
  account_info: any;
  sa_api_data: StarAtlasAPIItem | undefined;
  token_list_info: tokenlist.Token | undefined;
  account_metadata: Sft | SftWithToken | Nft | NftWithToken | undefined;
  json_metadata: any;
}

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
    symbol: {
      name: "FOODATLAS",
      mint_asset: new PublicKey("foodQJAztMzX1DKpLaiounNe2BDMds5RNuPC6jsNrDG"),
      mint_pair: new PublicKey("ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx"),
    },
    wallet: {
      address: "",
      profile: {} as I_SAG_Player,
      sol_balance: 0,
      is_web_wallet_connected: false,
      tokens: [] as Array<I_TokenData>,
      tokenRaw: [] as Array<{
        pubkey: PublicKey;
        account: AccountInfo<ParsedAccountData>;
      }>,
      tokenInfo: [] as Array<TokenInfo>,
      nfts: {} as NftsData,
      prizes: {} as Array<I_SagePrize>,
    },
    sa_api_data: [] as StarAtlasAPIItem[],
  }),
  getters: {},
  actions: {
    async toggleDark() {
      this.is_dark = !this.is_dark;
    },
    async init() {
      await this.sa_api_update();
      await this._currency_update();
      this.status.is_initialized = true;
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

    // async update_prizes(wallet: string) {
    //   this.status.is_loading = true;
    //   await get_player_prizes(wallet).then((resp) => {
    //     if (resp) this.wallet.prizes = resp;
    //   });
    //   this.status.is_loading = false;
    // },

    update_symbol(symbol: string, mint_asset?: string, mint_pair?: string) {
      this.symbol.name = symbol;

      this.symbol.mint_asset = mint_asset
        ? new PublicKey(mint_asset)
        : new PublicKey(
            this.sa_api_data.find((api) => symbol.includes(symbol))?.mint ?? ""
          );

      this.symbol.mint_pair = mint_pair
        ? new PublicKey(mint_pair)
        : new PublicKey(
            CURRENCIES.find((c) => symbol.includes(symbol))?.mint ?? ""
          );

      ////Deprecated
      useStaratlasGmStore().getOpenOrdersForAsset(
        this.symbol.mint_asset.toString()
      );
    },

    async update_connection(rpc_name: string) {
      this.rpc =
        endpoints_list.find((e) => e.name === rpc_name) ?? endpoints_list[0];
    },

    async _currency_update() {
      this.status = _update_status(
        this.status,
        true,
        "Loading Currency Prices",
        0,
        1
      );
      await this._load_currency_prices();
      this.status = _update_status(
        this.status,
        false,
        "Updated Currency Prices",
        1,
        1
      );
    },

    async sa_api_update() {
      this.status = _update_status(
        this.status,
        true,
        "Loading SA API Data",
        0,
        1
      );
      await this._load_sa_api();
      this.status = _update_status(
        this.status,
        false,
        "Updated SA API Data",
        0,
        1
      );
    },

    async _load_wallet_tokens2() {
      this.wallet.tokens = [];

      const connection = new Connection(useGlobalStore().rpc.url);
      const meta = Metaplex.make(connection);

      const parsed_token_accounts =
        await connection.getParsedTokenAccountsByOwner(
          new PublicKey(this.wallet.address),
          {
            programId: new PublicKey(TOKEN_PROGRAM_ID),
          }
        );

      for (const token_account of parsed_token_accounts.value) {
        let account_metadata: any = {};
        await meta
          .nfts()
          .findByMint({
            mintAddress: new PublicKey(
              token_account.account.data.parsed?.info.mint
            ),
          })
          .then((data) => {
            account_metadata = data;
          })
          .catch((err) => {
            console.log("Error fetching metaplex-data:" + err);
          });

        let metadata = {};

        if (account_metadata && account_metadata.uri) {
          await fetch(account_metadata.uri)
            .then((resp) => resp.json())
            .then((json) => (metadata = json))
            .catch((err) => console.log("Error fetching metadata-link" + err));

          this.wallet.tokens.push({
            token_account: token_account.pubkey.toString(),
            token_mint: token_account.account.data.parsed.info.mint.toString(),
            account_info: token_account.account,
            account_metadata: account_metadata,
            token_list_info: TOKEN_LIST.tokens.find(
              (t) => t.address === token_account.account.data.parsed?.info.mint
            ),
            sa_api_data: useGlobalStore().sa_api_data.find(
              (api) =>
                api.mint ===
                token_account.account.data.parsed.info.mint.toString()
            ),
            json_metadata: metadata,
          });
        } else {
          this.wallet.tokens.push({
            token_account: token_account.pubkey.toString(),
            token_mint: token_account.account.data.parsed.info.mint.toString(),
            account_info: token_account.account,
            account_metadata: account_metadata,
            token_list_info: TOKEN_LIST.tokens.find(
              (t) => t.address === token_account.account.data?.parsed?.info.mint
            ),
            sa_api_data: useGlobalStore().sa_api_data.find(
              (api) =>
                api.mint ===
                token_account.account.data.parsed.info.mint.toString()
            ),
            json_metadata: metadata,
          });
        }
      }
    },

    async update_wallet(wallet: string) {
      this.wallet.address = wallet;
      PublicKey.isOnCurve(new PublicKey(wallet));

      this.wallet.profile = {} as never;

      get_player_profile(this.wallet.address).then((res) => {
        if (res) {
          this.wallet.profile = res;
        }
      });

      if (this.toggleables.load_tokens) {
        this.status = _update_status(
          this.status,
          true,
          "Loading wallet tokens...",
          0,
          3
        );
        await this._load_wallet_tokens2();
      }

      // if (this.toggleables.load_nfts) {
      //   this.status = _update_status(
      //     this.status,
      //     true,
      //     "Loading wallet NFTs...",
      //     2,
      //     3
      //   );
      //   await this._load_wallet_nfts().catch((err) =>
      //     console.log("error fetching nfts")
      //   );
      // }

      if (this.toggleables.load_score) {
        await useStaratlasGmStore().update_score_data();
      }

      this.status = _update_status(this.status, false, "Updated Wallet", 3, 3);
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

    //TODO: RM
    async _load_wallet_tokens() {
      this.wallet.tokenInfo = [];
      let connection = new Connection(this.rpc.url);
      //Fetch_sol_token
      this.wallet.sol_balance =
        (await connection.getBalance(new PublicKey(this.wallet.address))) *
        Math.pow(10, -9);

      //Fetch other_tokens
      let response_tokenAccounts =
        await connection.getParsedTokenAccountsByOwner(
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
          this.status,
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

    //TODO: needed?
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
  status: Status,
  is_loading: boolean,
  message: string,

  step?: number,
  step_total?: number
): Status {
  return {
    is_initialized: status.is_initialized,
    is_loading: is_loading,
    message: message,
    step: step,
    step_total: step_total,
  };
}
