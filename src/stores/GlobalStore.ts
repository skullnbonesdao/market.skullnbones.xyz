import { defineStore } from "pinia";
import { PublicKey } from "@solana/web3.js";
import { useToast } from "primevue/usetoast";
import { PropType } from "vue";
import { StarAtlasAPIItem } from "../static/StarAtlasAPIItem";
import { useLocalStorage } from "@vueuse/core";

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

export const useGlobalStore = defineStore("globalStore", {
  state: () => ({
    selected_publicKey: "",
    rpc: useLocalStorage("rpc_local_store", endpoints_list[0]),

    sa_api_data: [] as StarAtlasAPIItem[],
  }),
  getters: {},
  actions: {
    async load_sa_api_data() {
      await fetch("https://galaxy.staratlas.com/nfts")
        .then((resp) => resp.json())
        .then((data) => (this.sa_api_data = data));
    },
    load_wallet_tokens() {
      console.log("NOT implemented");
    },
  },
});
