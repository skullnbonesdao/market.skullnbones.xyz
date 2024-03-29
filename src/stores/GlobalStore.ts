import { defineStore } from "pinia";
import { Connection, PublicKey } from "@solana/web3.js";
import { StarAtlasAPIItem } from "../static/StarAtlasAPIItem";
import { useLocalStorage } from "@vueuse/core";
import { CURRENCIES } from "../static/currencies";
import { get_multi_price } from "../static/swagger/birdseye_api/birdseye_api";
import { Nft } from "@metaplex-foundation/js";
import { BirdsEyePricesResponse } from "../static/swagger/birdseye_api/birdsyste_pirces_response";

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
  { name: "alchemy_1", url: import.meta.env.VITE_SNB_RPC_ALCHEMY_1 },
  { name: "alchemy_2", url: import.meta.env.VITE_SNB_RPC_ALCHEMY_2 },
  { name: "alchemy_3", url: import.meta.env.VITE_SNB_RPC_ALCHEMY_3 },
  //  { name: "extrnode", url: "https://solana-mainnet.rpc.extrnode.com" },
  //  { name: "ankr", url: "https://rpc.ankr.com/solana" },
  //  { name: "solana-main", url: "https://api.mainnet-beta.solana.com/" },
  //  { name: "solana-serum", url: "https://solana-api.projectserum.com/" },
];

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
    pollInterval: 10000,
    toggleables: useLocalStorage("toggables", {
      load_tokens: true,
      load_nfts: true,
      load_history: true,
      load_score: true,
    }) as unknown as Toggables,
    is_dark: useLocalStorage("is_dark", false),
    rpc: useLocalStorage("rpc_local_store", endpoints_list[0]),
    connection: new Connection(endpoints_list[0].url),
    currencyPrice: {} as BirdsEyePricesResponse,
    symbol: {
      name: "FOODATLAS",
      mint_asset: new PublicKey("foodQJAztMzX1DKpLaiounNe2BDMds5RNuPC6jsNrDG"),
      mint_pair: new PublicKey("ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx"),
    },
    sa_api_data: [] as StarAtlasAPIItem[],
  }),
  getters: {},
  actions: {
    async toggleDark() {
      this.is_dark = !this.is_dark;
    },
    async init() {
      this.connection = new Connection(useGlobalStore().rpc.url);
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

    update_symbol(symbol: string, mint_asset?: string, mint_pair?: string) {
      try {
        console.log("1");
        this.symbol.mint_asset = mint_asset
          ? new PublicKey(mint_asset)
          : new PublicKey(
              this.sa_api_data.find((api) => symbol.includes(api.symbol))
                ?.mint ?? ""
            );
        console.log("2");
        this.symbol.mint_pair = mint_pair
          ? new PublicKey(mint_pair)
          : new PublicKey(
              CURRENCIES.find((c) => symbol.includes(c.name))?.mint ?? ""
            );
        console.log("3");
        this.symbol.name = symbol;
      } catch (e) {
        console.error("Unbale to change symbol: [" + symbol + "]");
        console.error(e);
      }
      ////Deprecated
      // useStaratlasGmStore().getOpenOrdersForAsset(
      //   this.symbol.mint_asset.toString()
      // );
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
