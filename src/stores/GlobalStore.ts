import { defineStore } from "pinia";
import { Connection, PublicKey } from "@solana/web3.js";
import { ItemType, StarAtlasAPIItem } from "../static/StarAtlasAPIItem";
import { useLocalStorage } from "@vueuse/core";
import { CURRENCIES, E_CURRENCIES } from "../static/currencies";
import { Api } from "../static/swagger/skullnbones_api/skullnbones_api";

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
    wallet: {
      address: "none",
      is_web_wallet_connected: false,
      tokens: [] as Array<TokenInfo>,
      historySorted: [] as Array<TableGroupedHistory>,
    },
    sa_api_data: [] as StarAtlasAPIItem[],
  }),
  getters: {},
  actions: {
    async toggleDark() {
      this.is_dark = !this.is_dark;
    },
    async init() {
      this.connection = new Connection(this.rpc.url, { httpHeaders: {} });
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
      this.wallet.tokens = [];
      //Fetch_sol_token
      this.wallet.tokens.push({
        amount:
          (await this.connection.getBalance(
            new PublicKey(this.wallet.address)
          )) * Math.pow(10, -9),
        address: "So11111111111111111111111111111111111111112",
        usd_value: -1.0,
      });

      //Fetch other_tokens
      let token_mints = CURRENCIES.flatMap((c) => new PublicKey(c.mint));

      let response_tokenAccounts =
        await this.connection.getParsedTokenAccountsByOwner(
          new PublicKey(this.wallet.address),
          {
            programId: new PublicKey(
              "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            ),
          }
        );

      response_tokenAccounts.value.forEach((token_account) => {
        const parsedAccountInfo = token_account.account.data;
        const amount =
          parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
        if (amount > 0) {
          this.wallet.tokens.push({
            amount: amount,
            address: parsedAccountInfo["parsed"]["info"]["mint"],
            usd_value: -1.0,
          });
        }
      });
    },

    async load_wallet_trades() {
      const api = new Api({ baseUrl: "https://api2.skullnbones.xyz" });

      this.wallet.historySorted = [];
      api.trades
        .getAddress({ address: this.wallet.address })
        .then((resp) => resp.data)
        .then((api_data) => {
          let key_idx = 0;
          for (let type in ItemType) {
            let filtered_sa_api = this.sa_api_data.filter(
              (sa) =>
                sa.attributes.itemType.toUpperCase() === type.toUpperCase()
            );

            let filtered_trades = api_data.filter((api) =>
              filtered_sa_api.some((f) => f.mint === api.asset_mint)
            );

            console.log(filtered_trades);

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
