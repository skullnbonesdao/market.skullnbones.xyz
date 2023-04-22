<template>
  <div
    v-if="percentage && isFinite(percentage) && percentage !> -99"
    class="flex flex-row items-center p-2 rounded-lg border-2 p-card"
  >
    <i
      v-if="percentage > 0"
      class="pi pi-arrow-up-right"
      :class="percentage > 0 ? 'text-green-500' : 'text-red-800'"
    ></i>
    <i
      v-else
      class="pi pi-arrow-down-right"
      :class="percentage > 0 ? 'text-green-500' : 'text-red-800'"
    ></i>
    <p
      class="pl-1 text-sm"
      :class="percentage > 0 ? 'text-green-500' : 'text-red-800'"
    >
      {{ percentage.toFixed(1) }}
    </p>
    <p
      class="text-xs"
      :class="percentage > 0 ? 'text-green-500' : 'text-red-800'"
    >
      %
    </p>
  </div>
  <div v-else>-</div>
</template>

<script setup lang="ts">
import { computed } from "vue";

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
