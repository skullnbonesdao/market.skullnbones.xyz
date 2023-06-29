<script lang="ts" setup>
import { useGlobalStore } from "../../stores/GlobalStore";
import { CURRENCIES, E_CURRENCIES } from "../../static/currencies";
import CurrencyIcon from "../icon-helper/CurrencyIcon.vue";
import { Api } from "../../static/swagger/skullnbones_api/skullnbones_api";
import { computed, ref, watchEffect } from "vue";
import G_CurrentMarketPrice from "./G_CurrentMarketPrice.vue";

const props = defineProps({
  symbol: {
    type: String,
    default: "FOOD",
    required: true,
  },
  decimals: {
    type: Number,
  },
  timeframe_days: {
    type: Number,
    default: 1,
    required: true,
  },
});

const udfAPI = new Api({
  baseUrl: import.meta.env.VITE_SNB_UDF_URL,
});

const price_candle_atlas = ref();
const price_candle_usdc = ref();

watchEffect(async () => {
  await udfAPI.udf
    .getHistory({
      symbol: props.symbol + "ATLAS",
      from: parseInt(
        (
          new Date().getTime() / 1000 -
          (60 * 60 * 24 * props.timeframe_days + 1)
        ).toFixed()
      ),
      to: parseInt((new Date().getTime() / 1000).toFixed()),
      countback: 3,
      resolution: props.timeframe_days + "D",
    })
    .then((data) => (price_candle_atlas.value = data.data))
    .catch((err) => console.log(err));

  await udfAPI.udf
    .getHistory({
      symbol: props.symbol + "USDC",
      from: parseInt(
        (
          new Date().getTime() / 1000 -
          (60 * 60 * 24 * props.timeframe_days + 1)
        ).toFixed()
      ),
      to: parseInt((new Date().getTime() / 1000).toFixed()),
      countback: 3,
      resolution: props.timeframe_days + "D",
    })
    .then((data) => (price_candle_usdc.value = data.data))
    .catch((err) => console.log(err));
});

const price_percentage_atlas = computed(() => {
  return (
    (((price_candle_atlas.value?.c[price_candle_atlas.value?.c.length - 1] ??
      0) -
      (price_candle_atlas.value?.o[price_candle_atlas.value?.c.length - 1] ??
        0)) /
      (price_candle_atlas.value?.o[price_candle_atlas.value?.c.length - 1] ??
        0)) *
    100
  );
});

const price_percentage_usdc = computed(() => {
  return (
    (((price_candle_usdc.value?.c[price_candle_usdc.value?.c.length - 1] ?? 0) -
      (price_candle_usdc.value?.o[price_candle_usdc.value?.c.length - 1] ??
        0)) /
      (price_candle_usdc.value?.o[price_candle_usdc.value?.c.length - 1] ??
        0)) *
    100
  );
});
</script>

<template>
  <div
    :class="useGlobalStore().is_dark ? 'border-gray-900' : ''"
    class="flex flex-row items-center gap-2 p-inputtext"
  >
    <div class="flex flex-col space-y-1 items-center">
      <CurrencyIcon
        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
        style="width: 20px"
      />
      <CurrencyIcon
        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
        style="width: 20px"
      />
    </div>
    <div class="flex flex-col gap-2">
      <div class="border h-1rem"></div>
      <div class="border h-1rem"></div>
    </div>
    <div
      :class="decimals === 2 ? 'w-24' : 'w-48'"
      class="flex flex-col w-24 text-right"
    >
      <!--USDC-->
      <p
        v-if="
          price_candle_usdc?.c[price_candle_usdc.value?.c.length - 1] &&
          decimals
        "
      >
        {{
          price_candle_usdc.c[price_candle_usdc.value?.c.length - 1]?.toFixed(
            decimals
          ) ?? 0.0
        }}
      </p>
      <p
        v-else-if="price_candle_usdc?.c[price_candle_usdc.value?.c.length - 1]"
      >
        {{ price_candle_usdc.c[price_candle_usdc.value?.c.length - 1] ?? 0.0 }}
      </p>
      <p v-else>
        <G_CurrentMarketPrice :decimals="decimals" :symbol="symbol + 'USDC'" />
      </p>

      <!--ATLAS-->
      <p
        v-if="
          price_candle_atlas?.c[price_candle_atlas.value?.c.length - 1] &&
          decimals
        "
      >
        {{
          price_candle_atlas.c[price_candle_atlas.value?.c.length - 1]?.toFixed(
            decimals
          ) ?? 0.0
        }}
      </p>
      <p
        v-else-if="
          price_candle_atlas?.c[price_candle_atlas.value?.c.length - 1]
        "
      >
        {{
          price_candle_atlas.c[price_candle_atlas.value?.c.length - 1] ?? 0.0
        }}
      </p>
      <p v-else>
        <G_CurrentMarketPrice :decimals="decimals" :symbol="symbol + 'ATLAS'" />
      </p>
      <!--            <G_CurrentMarketPrice :decimals="decimals" :symbol="symbol + 'USDC'" />-->
      <!--            <G_CurrentMarketPrice :decimals="decimals" :symbol="symbol + 'ATLAS'" />-->
    </div>
    <div class="flex flex-col w-24 text-right">
      <div
        :class="
          price_percentage_usdc > 0
            ? 'text-green-500'
            : price_percentage_usdc < 0
            ? 'text-red-500'
            : 'text-yellow-500'
        "
        class="flex flex-row items-center"
      >
        <p v-if="!isNaN(price_percentage_usdc)" class="w-full">
          {{ price_percentage_usdc.toFixed(2) }}
        </p>
        <p v-else class="w-full">0.00</p>
        <p class="text-xs">%</p>
      </div>
      <div
        :class="
          price_percentage_atlas > 0
            ? 'text-green-500'
            : price_percentage_atlas < 0
            ? 'text-red-500'
            : 'text-yellow-500'
        "
        class="flex flex-row items-center"
      >
        <p v-if="!isNaN(price_percentage_atlas)" class="w-full">
          {{ price_percentage_atlas.toFixed(2) }}
        </p>
        <p v-else class="w-full">0.00</p>
        <p class="text-xs">%</p>
      </div>
      <!--      <G_Market24hChange :symbol="symbol + 'USDC'" />-->
      <!--      <G_Market24hChange :symbol="symbol + 'ATLAS'" />-->
    </div>
  </div>
</template>

<style scoped></style>