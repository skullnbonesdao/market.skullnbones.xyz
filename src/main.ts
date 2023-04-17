import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";

import "virtual:uno.css";
import "./style.css";
//import "./assets/main.css";
import "../public/css/theme_light.css";
//import "./theme_dark.css";

import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import HomeView from "./components/views/HomeView.vue";
import MarketView from "./components/views/MarketView.vue";
import { createRouter, createWebHashHistory } from "vue-router";

// @ts-ignore
import SolanaWallets from "solana-wallets-vue";
import "solana-wallets-vue/styles.css";
// @ts-ignore
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

// @ts-ignore
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import PortfolioView from "./components/views/PortfolioView.vue";

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
  { path: "/portfolio", component: PortfolioView },
];

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
});

const app = createApp(App);
app.component("Button", Button).component("Toast", Toast);

app
  .use(PrimeVue)
  .use(ToastService)
  .use(router)
  .use(SolanaWallets, walletOptions)
  .mount("#app");
