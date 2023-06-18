<template>
  <div
    class="flex sm:flex-row flex-col space-x-5 items-center sm:space-y-0 space-y-3"
  >
    <div class="flex flex-row w-full">
      <div class="flex flex-col w-full sm:pr-3 sm:flex-row">
        <div
          class="flex w-full flex-row items-center space-x-3 overflow-hidden"
        >
          <div class="flex">
            <PairImage
              class=""
              :asset_image_url="
                '/webp/' +
                useGlobalStore().symbol.mint_asset.toString() +
                '.webp'
              "
              :currency="
                CURRENCIES.find(
                  (c) => c.mint === useGlobalStore().symbol.mint_pair.toString()
                )
              "
            />
          </div>
          <div class="flex w-full flex-col sm:flex-row items-baseline">
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
            <div class="flex flex-row items-center space-x-2 sm:justify-end">
              <div>
                <div class="flex flex-row items-center space-x1">
                  <G_CurrentMarketPrice
                    :symbol="useGlobalStore().symbol.name"
                  />

                  <CurrencyIcon
                    class="w-6"
                    :currency="
                      CURRENCIES.find(
                        (c) =>
                          useGlobalStore().symbol.mint_pair.toString() ===
                          c.mint
                      )
                    "
                  />
                </div>
                <div class="flex items-center sm:float-right">
                  <div
                    class="text-sm"
                    :class="
                      price_24_change === 1
                        ? 'i-carbon-arrow-right text-gray'
                        : price_24_change >= 1
                        ? 'i-carbon-arrow-down-right text-red'
                        : 'i-carbon-arrow-up-right text-green'
                    "
                  ></div>

                  <div
                    class="text-right text-sm"
                    :class="
                      price_24_change === 1
                        ? 'text-gray'
                        : price_24_change > 1
                        ? 'text-red'
                        : 'text-green'
                    "
                  >
                    <G_Market24hChange :symbol="useGlobalStore().symbol.name" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col items-end">
            <AssetRarityBadge
              :asset_class="
                useGlobalStore().sa_api_data.find(
                  (a) =>
                    a.mint === useGlobalStore().symbol.mint_asset.toString()
                )?.attributes?.rarity
              "
            />
            <AssetItemTypeBadge
              :asset_class="
                useGlobalStore().sa_api_data.find(
                  (a) =>
                    a.mint === useGlobalStore().symbol.mint_asset.toString()
                )?.attributes?.itemType
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
        </div>
      </div>
      <div
        class="flex items-center px-3 border-l"
        @click="$emit('search_clicked')"
      >
        <i class="pi pi-search" style="font-size: 1.5rem"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
