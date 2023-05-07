<template>
  <div
    v-if="percentage && isFinite(percentage) && percentage !> -99"
    class="flex flex-row items-center p-2 rounded-lg border-2 p-card"
  >
    <i
      class="pi"
      :class="
        percentage > 0
          ? useGlobalStore().is_dark
            ? 'pi-arrow-up-right text-green-500'
            : 'pi-arrow-up-right text-green-500'
          : useGlobalStore().is_dark
          ? 'pi-arrow-down-right text-red-500'
          : 'pi-arrow-down-right text-red-500'
      "
    ></i>
    <p
      class="pl-1 text-sm"
      :class="
        percentage > 0
          ? useGlobalStore().is_dark
            ? 'text-green-500'
            : 'text-green-500'
          : useGlobalStore().is_dark
          ? 'text-red-500'
          : 'text-red-500'
      "
    >
      {{ percentage.toFixed(1) }}
    </p>
    <p
      class="text-xs"
      :class="
        percentage > 0
          ? useGlobalStore().is_dark
            ? 'text-green-500'
            : 'text-green-500'
          : useGlobalStore().is_dark
          ? 'text-red-500'
          : 'text-red-500'
      "
    >
      %
    </p>
  </div>
  <div v-else>-</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useGlobalStore } from "../../../stores/GlobalStore";

const props = defineProps({
  vwap: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
});

const percentage = computed(() => {
  const p = (props.price / props.vwap) * 100;

  if (p < 100) {
    return -(100 - p);
  } else return p - 100;
});
</script>

<style scoped></style>
