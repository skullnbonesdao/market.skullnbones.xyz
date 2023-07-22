<template>
  <div class="app">
    <t-v-chart-container :symbol="props.symbol ?? 'AMMOATLAS'" />
  </div>
</template>

<script lang="ts" setup>
import TVChartContainer from "./TVChartContainer.vue";

const props = defineProps({
  symbol: {
    type: String,
    default: "AMMOATLAS",
    required: true,
  },
});

//const version:  version{}
</script>

<style lang="scss" scoped>
.app {
  text-align: center;

  &__header {
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #222;
    color: #fff;
  }

  &__title {
    display: block;
    font-size: 1.5em;
  }
}
</style>