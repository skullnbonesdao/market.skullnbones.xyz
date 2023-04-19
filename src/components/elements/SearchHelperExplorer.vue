<template>
  <div class="p-card p-fluid flex flex-row items-center">
    <AutoComplete
      class="flex w-full"
      v-model="search_user_selected"
      :suggestions="filtered_search"
      @complete="search"
      optionLabel="label"
      optionGroupLabel="label"
      optionGroupChildren="items"
      placeholder="Hint: type 'dickhead'"
    >
      <template #optiongroup="slotProps">
        <div class="flex align-items-center country-item">
          <!--          <img-->
          <!--            :alt="slotProps.item.label"-->
          <!--            :src="'/public/webp/' + slotProps.item.mint + '.webp'"-->
          <!--            :class="`flag flag-${slotProps.item.code.toLowerCase()} mr-2`"-->
          <!--            style="width: 18px"-->
          <!--          />-->
          <div>{{ slotProps.item.label }}</div>
        </div>
      </template>
    </AutoComplete>
    <Button
      icon="pi pi-search"
      @click="$emit('toSearch', search_user_selected.api_search)"
    />
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from "../../stores/GlobalStore";
import AutoComplete from "primevue/autocomplete";
import { getTransitionRawChildren, ref } from "vue";
import { FilterMatchMode, FilterService } from "primevue/api";
import { ItemType, StarAtlasAPIItem } from "../../static/StarAtlasAPIItem";
import { SEARCH_TYPE } from "../../static/search_types_api";

defineEmits(["toSearch"]);

const search_user_selected = ref();
const filtered_search = ref();

const groupedSearch = ref([
  {
    label: "Address",
    code: "Address",
    items: [
      {
        label: search_user_selected.value,
        value: search_user_selected.value,
      },
    ],
  },
]);

groupedSearch.value = [];

for (let item_type in ItemType) {
  groupedSearch.value.push({
    label: item_type,
    code: item_type,
    items: useGlobalStore()
      .sa_api_data.filter(
        (asset) =>
          asset.attributes.itemType.toLowerCase() === item_type.toLowerCase()
      )
      .flatMap((asset) => {
        return [
          {
            label: asset.symbol + "ATLAS" + " - " + asset.name,
            value: asset.symbol + "ATLAS" + " - " + asset.name,
            api_search: {
              type: SEARCH_TYPE.SYMBOL,
              value: asset.symbol + "ATLAS",
            },
          },
          {
            label: asset.symbol + "USDC" + " - " + asset.name,
            value: asset.symbol + "USDC" + " - " + asset.name,
            api_search: {
              type: SEARCH_TYPE.SYMBOL,
              value: asset.symbol + "USDC",
            },
          },
        ];
      }),
  });
}

const search = (event: any) => {
  let query = event.query;
  let newFilteredCities = [];

  for (let country of groupedSearch.value) {
    let filteredItems = FilterService.filter(
      country.items,
      ["label"],
      query,
      FilterMatchMode.CONTAINS
    );
    if (filteredItems && filteredItems.length) {
      newFilteredCities.push({ ...country, ...{ items: filteredItems } });
    }
  }

  newFilteredCities.push({
    label: "Address",
    code: "Address",
    items: [
      {
        label: search_user_selected.value,
        value: search_user_selected.value,
        api_search: {
          type: SEARCH_TYPE.ADDRESS,
          value: search_user_selected.value,
        },
      },
    ],
  });

  newFilteredCities.push({
    label: "Signature",
    code: "Signature",
    items: [
      {
        label: search_user_selected.value,
        value: search_user_selected.value,
        api_search: {
          type: SEARCH_TYPE.SIGNATURE,
          value: search_user_selected.value,
        },
      },
    ],
  });

  newFilteredCities.push({
    label: "Mint",
    code: "Mint",
    items: [
      {
        label: search_user_selected.value,
        value: search_user_selected.value,
        api_search: {
          type: SEARCH_TYPE.MINT,
          value: search_user_selected.value,
        },
      },
    ],
  });

  filtered_search.value = newFilteredCities;
};
</script>

<style scoped></style>
