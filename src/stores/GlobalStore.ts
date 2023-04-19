import { defineStore } from "pinia";
import { Connection, PublicKey } from "@solana/web3.js";
import { useToast } from "primevue/usetoast";
import { PropType } from "vue";
import { StarAtlasAPIItem } from "../static/StarAtlasAPIItem";
import { useLocalStorage } from "@vueuse/core";
import { CURRENCIES } from "../static/currencies";

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
}

export const useGlobalStore = defineStore("globalStore", {
  state: () => ({
    selected_publicKey: "",
    rpc: useLocalStorage("rpc_local_store", endpoints_list[0]),
    connection: {} as Connection,
    wallet: {
      address: "none",
      is_web_wallet_connected: false,
      tokens: [] as Array<TokenInfo>,
      history: [],
    },
    sa_api_data: [] as StarAtlasAPIItem[],
  }),
  getters: {},
  actions: {
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
          (await useGlobalStore().connection.getBalance(
            new PublicKey(this.wallet.address)
          )) * Math.pow(10, -9),
        address: "So11111111111111111111111111111111111111112",
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
          });
        }
      });
    },
  },
});
