<template>
  <div class="p-fluid flex flex-row space-x-2">
    <AutoComplete
      v-model="search_user_selected"
      :suggestions="filtered_search"
      class="flex w-full"
      optionGroupChildren="items"
      optionGroupLabel="label"
      optionLabel="label"
      placeholder="Hint: type 'symbol-name'"
      scrollHeight="500px"
      @complete="search"
      @itemSelect="$emit('toSearch', search_user_selected)"
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
      @click="$emit('toSearch', search_user_selected)"
    />
  </div>
</template>

<script lang="ts" setup>
import { useGlobalStore } from "../../stores/GlobalStore";
import AutoComplete from "primevue/autocomplete";
import { ref, watch } from "vue";
import { FilterMatchMode, FilterService } from "primevue/api";
import { ItemType } from "../../static/StarAtlasAPIItem";
import { SEARCH_TYPE } from "../../static/search_types_api";
import { CURRENCIES, E_CURRENCIES } from "../../static/currencies";

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
init();

watch(
  () => useGlobalStore().sa_api_data,
  () => {
    init();
  }
);

function init() {
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
                mint_asset: asset.mint,
                mint_currency: CURRENCIES.find(
                  (c) => c.type === E_CURRENCIES.ATLAS
                )?.mint,
              },
            },
            {
              label: asset.symbol + "USDC" + " - " + asset.name,
              value: asset.symbol + "USDC" + " - " + asset.name,
              api_search: {
                type: SEARCH_TYPE.SYMBOL,
                value: asset.symbol + "USDC",
                mint_asset: asset.mint,
                mint_currency: CURRENCIES.find(
                  (c) => c.type === E_CURRENCIES.USDC
                )?.mint,
              },
            },
          ];
        }),
    });
  }
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

  // newFilteredCities.push({
  //   label: "Address",
  //   code: "Address",
  //   items: [
  //     {
  //       label: search_user_selected.value,
  //       value: search_user_selected.value,
  //       api_search: {
  //         type: SEARCH_TYPE.ADDRESS,
  //         value: search_user_selected.value,
  //       },
  //     },
  //   ],
  // });

  // newFilteredCities.push({
  //   label: "Signature",
  //   code: "Signature",
  //   items: [
  //     {
  //       label: search_user_selected.value,
  //       value: search_user_selected.value,
  //       api_search: {
  //         type: SEARCH_TYPE.SIGNATURE,
  //         value: search_user_selected.value,
  //       },
  //     },
  //   ],
  // });

  // newFilteredCities.push({
  //   label: "Mint",
  //   code: "Mint",
  //   items: [
  //     {
  //       label: search_user_selected.value,
  //       value: search_user_selected.value,
  //       api_search: {
  //         type: SEARCH_TYPE.MINT,
  //         value: search_user_selected.value,
  //       },
  //     },
  //   ],
  // });

  filtered_search.value = newFilteredCities;
};
</script>

<style scoped></style>