import { defineStore } from "pinia";
import { PublicKey } from "@solana/web3.js";
import { useToast } from "primevue/usetoast";
import { PropType } from "vue";
import { StarAtlasAPIItem } from "../static/StarAtlasAPIItem";

export const useGlobalStore = defineStore("globalStore", {
  state: () => ({
    selected_publicKey: "",
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
