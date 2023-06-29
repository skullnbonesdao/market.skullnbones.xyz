<template>
  <div class="flex flex-row w-full">
    <div class="flex flex-col w-full sm:pr-3 sm:flex-row">
      <div class="flex flex-col md:flex-row items-center gap-5 w-full">
        <div class="flex">
          <PairImage
            :asset_image_url="
              '/webp/' + useGlobalStore().symbol.mint_asset.toString() + '.webp'
            "
            :currency="
              CURRENCIES.find(
                (c) => c.mint === useGlobalStore().symbol.mint_pair.toString()
              )
            "
            class=""
          />
          <div class="w-full">
            <h3>
              {{
                useGlobalStore().sa_api_data.find(
                  (asset) =>
                    asset.mint.toString() ===
                    useGlobalStore().symbol.mint_asset.toString()
                )?.name
              }}
            </h3>
            <p>
              {{ useGlobalStore().symbol.name }}
            </p>
          </div>
        </div>
        <div class="w-full"></div>
        <div class="grid md:grid-cols-2 md:gap-4">
          <div class="grid">
            <AssetItemTypeBadge
              :asset_class="
                useGlobalStore().sa_api_data.find(
                  (a) =>
                    a.mint === useGlobalStore().symbol.mint_asset.toString()
                )?.attributes?.itemType
              "
            />
            <AssetRarityBadge
              :asset_class="
                useGlobalStore().sa_api_data.find(
                  (a) =>
                    a.mint === useGlobalStore().symbol.mint_asset.toString()
                )?.attributes?.rarity
              "
            />
            <AssetTextBadge
              :text="
                useGlobalStore().sa_api_data.find(
                  (a) =>
                    a.mint === useGlobalStore().symbol.mint_asset.toString()
                )?.attributes?.spec
              "
            />
          </div>
          <div class="flex flex-col items-baseline">
            <div class="flex flex-row gap-1 pr-5">
              <G_CurrentMarketPrice :symbol="useGlobalStore().symbol.name" />
              <CurrencyIcon
                :currency="
                  CURRENCIES.find(
                    (c) =>
                      useGlobalStore().symbol.mint_pair.toString() === c.mint
                  )
                "
                style="width: 20px"
              />
            </div>
            <div class="flex items-center sm:float-right">
              <G_Market24hChange :symbol="useGlobalStore().symbol.name" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center ml-2" @click="$emit('search_clicked')">
      <Button>
        <template #icon>
          <i class="pi pi-search p-2" style="font-size: 1.5rem"></i>
        </template>
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useGlobalStore } from "../../stores/GlobalStore";

import CurrencyIcon from "../icon-helper/CurrencyIcon.vue";
import { CURRENCIES } from "../../static/currencies";
import AssetRarityBadge from "./badges/AssetRarityBadge.vue";
import AssetTextBadge from "./badges/AssetTextBadge.vue";
import AssetItemTypeBadge from "./badges/AssetItemTypeBadge.vue";
import PairImage from "./PairImage.vue";
import G_CurrentMarketPrice from "../graphql/G_CurrentMarketPrice.vue";
import G_Market24hChange from "../graphql/G_Market24hChange.vue";

defineEmits(["search_clicked"]);
</script>

<style scoped></style>