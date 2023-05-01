<template>
  <div class="grid grid-cols-100">
    <div v-for="i in [...Array(10).keys()]">{{ i }}</div>
  </div>

  <div id="chart">
    <apexchart
      type="heatmap"
      height="350"
      :options="chartOptions"
      :series="chartData"
    ></apexchart>
  </div>
</template>

<script setup>
import { ref } from "vue";

const chartOptions = ref({
  chart: {
    height: 350,
    type: "heatmap",
  },
  dataLabels: {
    enabled: false,
  },
  colors: ["#008FFB"],
  title: {
    text: "HeatMap Chart (Single color)",
  },
});

const chartData = ref([
  {
    name: "0",
    data: [
      { x: "0", y: 22 },
      { x: "1", y: 22 },
    ],
  },
  {
    name: "1",
    data: [
      { x: "0", y: 22 },
      { x: "1", y: 22 },
    ],
  },
]);
</script>

<style scoped></style>
