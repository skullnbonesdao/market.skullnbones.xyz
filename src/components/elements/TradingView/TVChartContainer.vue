<template>
  <div ref="chartContainer" class="TVChartContainer" />
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { UDFCompatibleDatafeed } from "@/public/feeds/udf-compatible-datafeed.js";
import { widget } from "@/public/charting_library";
import { useGlobalStore } from "@/src/stores/GlobalStore";

const tvWidget = ref(null);
const chartContainer = ref(null);
const globalStore = useGlobalStore();

const props = defineProps({
  symbol: {
    type: String,
    required: true,
  },
});

onMounted(() => {
  createTVChart();
});

watch(
  () => props.symbol,
  async () => {
    createTVChart();
  }
);

watch(
  () => globalStore.is_dark,
  async () => {
    createTVChart();
  }
);

function getLanguageFromURL() {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function createTVChart() {
  const container = chartContainer.value;
  const chart_theme = globalStore.is_dark ? "dark" : "light";
  const widgetOptions = {
    //symbol: globalStore.symbol.name, //assetSelected,
    symbol: props.symbol,

    debug: false,
    // BEWARE: no trailing slash is expected in feed URL
    /*  default: 'http://localhost:3000',*/
    /* default: '/api',*/
    /* https://api2.skullnbones.xyz*/

    //datafeed: new UDFCompatibleDatafeed('http://localhost:8080/udf'),
    datafeed: new UDFCompatibleDatafeed(
      import.meta.env.VITE_SNB_UDF_URL + "/udf"
    ),
    interval: "1D",
    container: container,
    library_path: "/charting_library/",
    theme: chart_theme,

    locale: getLanguageFromURL() || "en",
    disabled_features: ["use_localstorage_for_settings"],
    /*enabled_features: ["study_templates"],*/
    /*      charts_storage_url: this.chartsStorageUrl,*/
    charts_storage_api_version: "1.1",
    client_id: "clientID",
    user_id: "someID",
    fullscreen: false,
    autosize: true,
    studies_overrides: {},
  };

  const tvWidget = new widget(widgetOptions);
  tvWidget.value = tvWidget;

  tvWidget.onChartReady(() => {
    // tvWidget.headerReady().then(() => {
    //   const button = tvWidget.createButton();
    //   //useGlobalStore().update_symbol(tvWidget.activeChart().symbol());
    //   button.setAttribute("title", "Click to show a notification popup");
    //   button.classList.add("apply-common-tooltip");
    //
    //   button.addEventListener("click", () =>
    //     tvWidget.showNoticeDialog({
    //       title: "Notification",
    //       body: "TradingView Charting Library API works correctly",
    //       callback: () => {
    //         // eslint-disable-next-line no-console
    //         console.log("Noticed!");
    //       },
    //     })
    //   );
    //
    //   button.innerHTML = "API";
    // });
    tvWidget
      .activeChart()
      .onSymbolChanged()
      .subscribe(null, () => {
        useGlobalStore().update_symbol(tvWidget.activeChart().symbol());
      });
  });
}
</script>

<style lang="scss" scoped>
.TVChartContainer {
  height: calc(60vh);
}
</style>