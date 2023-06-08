<script setup lang="ts">
import Dropdown from "primevue/dropdown";
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
  let list: I_OptionL1[] = [];
  Object.keys(ItemType).forEach((item) => {
    list.push({
      name: item.toString(),
      value: item.toString(),
    });
  });
  return list;
});

const active_option_l1 = ref({ name: "SFTs", value: "sft" });

const active_option_l2_sa = ref({ name: "Ship", value: "Ship" });
</script>

<template>
  <div class="flex flex-col space-y-1">
    <div class="space-y-1">
      <Dropdown
        v-model="active_option_l1"
        :options="options_l1"
        optionLabel="name"
        placeholder="Select a Type"
        class="w-full"
      />
      <Dropdown
        v-if="active_option_l1.value === 'staratlas'"
        v-model="active_option_l2_sa"
        :options="options_l2_sa"
        optionLabel="name"
        placeholder="Select a Type"
        class="w-full"
      />
    </div>

    <PortfolioAssetsTable
      v-if="active_option_l1.value === 'staratlas'"
      :option_l1="active_option_l1.value"
      :option_sa="active_option_l2_sa.value"
    />
    <PortfolioAssetsTable v-else :option_l1="active_option_l1.value" />
  </div>
</template>
