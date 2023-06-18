import { defineStore } from "pinia";
import { StarAtlasAPIItem } from "../static/StarAtlasAPIItem";

export const useInsightsStore = defineStore("tpsStore", {
  state: () => ({
    selected: {} as StarAtlasAPIItem | undefined,
  }),
  actions: {},
});
