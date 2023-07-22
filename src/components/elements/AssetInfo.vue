<template>
  <div class="flex flex-row w-full">
    <div class="flex flex-col w-full sm:pr-3 sm:flex-row">
      <div class="flex flex-col md:flex-row items-center gap-5 w-full">
        <div class="flex items-center">
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
            <h3 class="w-24">
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
        <div class="h-full border-r-2"></div>

        <div class="flex flex-row w-full">
          <AssetItemTypeBadge
            :asset_class="
              useGlobalStore().sa_api_data.find(
                (a) => a.mint === useGlobalStore().symbol.mint_asset.toString()
              )?.attributes?.itemType
            "
          />
          <AssetTextBadge
            :text="
              useGlobalStore().sa_api_data.find(
                (a) => a.mint === useGlobalStore().symbol.mint_asset.toString()
              )?.attributes?.spec
            "
          />
          <AssetRarityBadge
            :asset_class="
              useGlobalStore().sa_api_data.find(
                (a) => a.mint === useGlobalStore().symbol.mint_asset.toString()
              )?.attributes?.rarity
            "
          />
        </div>

        <div class="h-full border-r-2"></div>
        <div class="flex flex-row gap-2 items-baseline">
          <div class="flex flex-row gap-2 p-inputtext">
            <G_CurrentMarketPrice :symbol="useGlobalStore().symbol.name" />
            <div class="border-1"></div>
            <CurrencyIcon
              :currency="
                CURRENCIES.find(
                  (c) => useGlobalStore().symbol.mint_pair.toString() === c.mint
                )
              "
              style="width: 24px"
            />
          </div>
          <div class="flex flex-row gap-2 p-inputtext">
            <G_Market24hChange
              :symbol="useGlobalStore().symbol.name"
              class="text-xs"
            />
            <div class="border-1"></div>
            <p class="text-xs">24h</p>
          </div>
        </div>
        <div class="h-full border-r-2"></div>
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
import PairImage from "./PairImage.vue";
import G_CurrentMarketPrice from "../graphql/G_CurrentMarketPrice.vue";
import G_Market24hChange from "../graphql/G_Market24hChange.vue";
import AssetRarityBadge from "./badges/AssetRarityBadge.vue";
import AssetItemTypeBadge from "./badges/AssetItemTypeBadge.vue";
import AssetTextBadge from "./badges/AssetTextBadge.vue";

defineEmits(["search_clicked"]);
</script>

<style scoped></style>