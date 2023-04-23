<template>
  <div class="">
    <div class="card">
      <Chart
        type="line"
        :data="chartData"
        :options="chartOptions"
        class="h-30rem"
      />
    </div>
    <TreeTable :value="useGlobalStore().wallet.historySorted">
      <Column field="name" header="" expander> </Column>
      <Column field="symbol" header="Symbol"></Column>
      <Column field="type" header="Type"></Column>
      <Column field="time_string" header="Time"></Column>
      <Column field="price" header="Price">
        <template #body="slotProps">
          <div
            v-if="slotProps.node.data.currency_mint"
            class="flex float-right gap-2 items-center"
          >
            <p>{{ slotProps.node.data.price }}</p>
            <CurrencyIcon
              style="height: 16px"
              :currency="
                CURRENCIES.find(
                  (c) => c.mint === slotProps.node.data.currency_mint
                )
              "
            />
          </div>
        </template>
      </Column>

      <Column field="size" header="Size">
        <template #body="slotProps">
          <p v-if="slotProps.node.data.size">x{{ slotProps.node.data.size }}</p>
        </template>
      </Column>
      <Column field="cost" header="Cost">
        <template #body="slotProps">
          <div
            v-if="slotProps.node.data.total_cost"
            class="flex float-right gap-2 items-center"
          >
            <p>{{ slotProps.node.data.total_cost }}</p>
            <CurrencyIcon
              style="height: 16px"
              :currency="
                CURRENCIES.find(
                  (c) => c.mint === slotProps.node.data.currency_mint
                )
              "
            />
          </div>
        </template>
      </Column>
    </TreeTable>
  </div>
  {{ wallet_history_chartData }}
</template>

<script setup lang="ts">
import Chart from "primevue/chart";
import TreeTable from "primevue/treetable";
import Column from "primevue/column";
import { useGlobalStore } from "../../../stores/GlobalStore";
import CurrencyIcon from "../../icon-helper/CurrencyIcon.vue";
import { CURRENCIES, E_CURRENCIES } from "../../../static/currencies";
import { computed, onMounted, ref } from "vue";

onMounted(() => {
  chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();

const test_data = {
  datasets: [
    {
      data: [
        {
          x: "2021-11-06 23:39:30",
          y: 50,
        },
        {
          x: "2021-11-07 01:00:28",
          y: 60,
        },
        {
          x: "2021-11-07 09:00:28",
          y: 20,
        },
      ],
    },
  ],
};

interface DataPoint {
  x: string;
  y: number;
}

const wallet_history_chartData = computed(() => {
  const documentStyle = getComputedStyle(document.documentElement);

  let table_data = {
    datasets: [
      {
        data: [] as DataPoint[],
      },
      {
        label: "ATLAS",
        data: [] as DataPoint[],
      },
    ],
  };
  useGlobalStore().wallet.historyRaw.forEach((trade) => {
    switch (trade.currency_mint) {
      case CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)?.mint:
        table_data.datasets[0].data.push({
          x: trade.timestamp * 1000,
          y: trade.price * trade.asset_change,
        } as never);
        table_data.datasets[1].data.push({
          x: trade.timestamp * 1000,
          y: trade.price * trade.asset_change,
        } as never);
        break;

      case CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)?.mint:
        table_data.datasets[1].data.push({
          x: trade.timestamp * 1000,
          y: trade.price * trade.asset_change,
        } as never);
        table_data.datasets[0].data.push({
          x: trade.timestamp * 1000,
          y: trade.price * trade.asset_change,
        } as never);
        break;
      default:
        break;
    }
  });
  chartData.value = {
    labels: useGlobalStore().wallet.historyRaw.flatMap((h) => {
      let date = new Date(h.timestamp * 1000);
      return (
        date.getMonth() +
        "/" +
        date.getDay() +
        "/" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes()
      );
    }),
    datasets: [
      {
        label: "USDC",
        data: useGlobalStore().wallet.historyRaw.flatMap((history) => {
          if (
            history.currency_mint ===
            CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)?.mint
          ) {
            return history.price * history.asset_change;
          } else {
            return;
          }
        }),
        fill: false,
        borderColor: documentStyle.getPropertyValue("--blue-500"),
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "ATLAS",
        data: useGlobalStore().wallet.historyRaw.flatMap((history) => {
          if (
            history.currency_mint ===
            CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)?.mint
          ) {
            return history.price * history.asset_change;
          } else {
            return;
          }
        }),
        fill: false,
        borderColor: documentStyle.getPropertyValue("--pink-500"),
        tension: 0.4,
        yAxisID: "yatlas",
      },
    ],
  };
});
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--text-color");
  const textColorSecondary = documentStyle.getPropertyValue(
    "--text-color-secondary"
  );
  const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

  return {
    stacked: false,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      title: {
        display: true,
        text: "Historic volume",
      },

      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      xAxes: [
        {
          display: true,
          type: "time",
          time: {
            parser: "MM/DD/YYYY HH:mm",
          },
        },
      ],
      y: {
        beginAtZero: true,
        type: "linear",
        position: "left",
      },
      yatlas: {
        beginAtZero: true,
        type: "linear",
        position: "right",
      },
    },
  };
};
</script>
