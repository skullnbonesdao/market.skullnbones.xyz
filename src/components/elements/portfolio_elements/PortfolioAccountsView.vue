<template>
  <div class="flex flex-col">
    <TabView
      :active-index="active_option_l1"
      @update:active-index="(value:any) => (active_option_l1 = value)"
      class="w-full"
    >
      <TabPanel
        v-for="(option, idx) in options_l1"
        :key="idx"
        :header="option.name"
      >
      </TabPanel>
    </TabView>
    <TabView
      v-if="options_l1[active_option_l1].name === 'StarAtlas'"
      :active-index="active_option_l2_sa"
      @update:active-index="(value:any) => (active_option_l2_sa = value)"
    >
      <TabPanel
        v-for="(option2, idx) in options_l2_sa"
        :key="idx"
        :header="option2"
      >
      </TabPanel>
    </TabView>
    <PortfolioAssetsTable
      v-if="options_l1[active_option_l1].name === 'StarAtlas'"
      :option_l1="options_l1[active_option_l1].value"
      :option_sa="options_l2_sa[active_option_l2_sa]"
    />
    <PortfolioAssetsTable
      v-else
      :option_l1="options_l1[active_option_l1].value"
    />
  </div>
</template>
<script setup lang="ts">
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { computed, ref } from "vue";
import { ItemType } from "../../../static/StarAtlasAPIItem";
import PortfolioAssetsTable from "./PortfolioAssetsTable.vue";

export interface I_OptionL1 {
  name: string;
  value: string;
}

const options_l1: I_OptionL1[] = [
  {
    name: "SFTs",
    value: "sft",
  },
  {
    name: "NFTs",
    value: "nft",
  },
  {
    name: "StarAtlas",
    value: "staratlas",
  },
];

const options_l2_sa = computed(() => {
  let list: string[] = [];
  Object.keys(ItemType).forEach((item) => {
    list.push(item.toString());
  });
  return list;
});

const active_option_l1 = ref(0);

const active_option_l2_sa = ref(0);
</script>
