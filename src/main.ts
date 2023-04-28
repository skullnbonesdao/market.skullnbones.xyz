import { createApp, h, provide } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";

import PrimeVue from "primevue/config";
import Button from "primevue/button";
import Toast from "primevue/toast";
import Tooltip from "primevue/tooltip";
import ToastService from "primevue/toastservice";

import "virtual:uno.css";
import "./style.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "./themes/themes/soho/soho-light/theme.scss";

import HomeView from "./components/views/HomeView.vue";
import MarketView from "./components/views/MarketView.vue";
import { createRouter, createWebHashHistory } from "vue-router";

import "chartjs-adapter-date-fns";
// @ts-ignore
import VueApolloComponents from "@vue/apollo-components";

// @ts-ignore
import SolanaWallets from "solana-wallets-vue";

// @ts-ignore
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

// @ts-ignore
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import PortfolioView from "./components/views/PortfolioView.vue";

import "./styles_wallet_connect.css";
import Explorer from "./components/views/Explorer.vue";
import MarketTable from "./components/views/MarketTable.vue";
import AboutView from "./components/views/AboutView.vue";
import SagePrizes from "./components/views/SagePrizes.vue";
import TestView from "./components/views/TestView.vue";
import { apolloClient, apolloProvider } from "./static/graphql/testql";
import { DefaultApolloClient } from "@vue/apollo-composable";

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SlopeWalletAdapter(),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
  ],
  autoConnect: true,
};

const routes = [
  { path: "/", component: HomeView },
  { path: "/market", component: MarketView },
  { path: "/market_table", component: MarketTable },
  { path: "/explorer", component: Explorer },
  { path: "/portfolio", component: PortfolioView },
  { path: "/sageprizes", component: SagePrizes },
  { path: "/about", component: AboutView },
  { path: "/test", component: TestView },
];

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
});

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App),
});
app
  .component("Button", Button)
  .component("Toast", Toast)
  .directive("tooltip", Tooltip);
const pinia = createPinia();

app
  .use(apolloProvider)
  .use(VueApolloComponents)
  .use(pinia)
  .use(PrimeVue)
  .use(ToastService)
  .use(router)
  .use(SolanaWallets, walletOptions)
  .mount("#app");
