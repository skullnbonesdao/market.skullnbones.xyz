<script lang="ts" setup>
import Chart from "primevue/chart";
import ProgressSpinner from "primevue/progressspinner";
import { onMounted, ref, watch } from "vue";

import Dropdown from "primevue/dropdown";
import {
  Api,
  UdfHistory,
} from "../../../../static/swagger/skullnbones_api/skullnbones_api";

const udfAPI = new Api({
  baseUrl: import.meta.env.VITE_SNB_UDF_URL,
});

const props = defineProps({
  symbol: {
    type: String,
    required: true,
  },
  volume: {
    type: Boolean,
    default: false,
  },
});

const is_loading = ref(true);
const udf_data = ref<UdfHistory>();
const x_axis = ref<number[]>([]);
const y_axis = ref<number[]>([]);

const timeframe_selected = ref({
  name: "1 Month",
  resolution: "1D",
  countback_days: 30,
});
const timeframe_options = ref([
  { name: "1 Day", resolution: "1h", countback_days: 2 },
  { name: "1 Week", resolution: "1D", countback_days: 8 },
  { name: "1 Month", resolution: "1D", countback_days: 30 },
  { name: "1 Year", resolution: "1W", countback_days: 356 },
  { name: "5 Years", resolution: "1M", countback_days: 356 * 5 },
]);

onMounted(async () => {
  await upadate_chart_data();
});

watch(
  () => props.symbol,
  async () => await upadate_chart_data()
);

watch(
  () => timeframe_selected.value,
  async () => await upadate_chart_data()
);

async function upadate_chart_data() {
  is_loading.value = true;
  await udfAPI.udf
    .getHistory({
      symbol: props.symbol,
      from: parseInt(
        (
          new Date().getTime() / 1000 -
          60 * 60 * 24 * timeframe_selected.value.countback_days
        ).toFixed(0)
      ),
      to: parseInt((new Date().getTime() / 1000).toFixed(0)),
      resolution: timeframe_selected.value.resolution,
    })
    .then((data) => {
      udf_data.value = data.data as unknown as UdfHistory;
      console.log(data.data);

      x_axis.value = udf_data.value.t.flatMap((t) => t * 1000);
      if (props.volume) {
        y_axis.value = udf_data.value.v;
      } else y_axis.value = udf_data.value.c;
      is_loading.value = false;
    });
}

const chartData = ref({
  labels: x_axis,
  datasets: [
    {
      label: props.symbol,
      data: y_axis,
      lineTension: 0.4,
      borderWidth: 3,
      fill: "start",
    },
  ],
});
const chartOptions = ref({
  plugins: {
    legend: {
      display: false,
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem: any) {
          console.log(tooltipItem);
          return tooltipItem.yLabel;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
    x: {
      type: "timeseries",
    },
  },
});
</script>

<template>
  <div v-if="!is_loading">
    <Chart :data="chartData" :options="chartOptions" type="line" />
    <div class="flex flex-row w-full p-1">
      <div class="w-full"></div>
      <Dropdown
        v-model="timeframe_selected"
        :options="timeframe_options"
        class="basis-1/5"
        optionLabel="name"
        placeholder="Select a timeframe"
      />
    </div>
  </div>
  <div v-else class="flex w-full justify-items-center">
    <ProgressSpinner></ProgressSpinner>
  </div>
</template>

<style scoped></style>