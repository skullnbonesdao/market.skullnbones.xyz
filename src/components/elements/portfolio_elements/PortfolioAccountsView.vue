<template>
  <div class="w-full">
    <TabView class="w-full">
      <TabPanel
        v-for="(option, idx) in options_l1"
        :key="idx"
        :header="option.name"
      >
        <TabView v-if="option.value === 'staratlas'">
          <TabPanel
            v-for="(option2, idx) in options_l2_sa"
            :key="idx"
            :header="option2"
          >
            <PortfolioAssetsTable
              :option_l1="option.value"
              :option_sa="option2"
            />
          </TabPanel>
        </TabView>

        <PortfolioAssetsTable v-else :option_l1="option.value" />
      </TabPanel>
    </TabView>
  </div>
</template>
<script setup lang="ts">
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { computed } from "vue";
import { ItemType } from "../../../static/StarAtlasAPIItem";
import PortfolioAssetsTable from "./PortfolioAssetsTable.vue";

export interface I_OptionL1 {
  name: string;
  value: string;
}

const options_l1: I_OptionL1[] = [
  {
    name: "StarAtlas",
    value: "staratlas",
  },
  {
    name: "SFTs",
    value: "sft",
  },
  {
    name: "NFTs",
    value: "nft",
  },
];

const options_l2_sa = computed(() => {
  let list: string[] = [];
  Object.keys(ItemType).forEach((item) => {
    list.push(item.toString());
  });
  return list;
});
</script>
