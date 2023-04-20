<template>
  {{ open_orders }}
</template>

<script setup lang="ts">
import { getOpenOrdersForPlayer } from "@staratlas/factory";
import { useGlobalStore } from "../stores/GlobalStore";
import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "solana-wallets-vue";
import { GM_PROGRAM_ID } from "../static/constants/StarAtlasConstants";

const open_orders = getOpenOrdersForPlayer(
  new Connection(useGlobalStore().rpc.url),
  useWallet().publicKey.value ?? new PublicKey(""),
  new PublicKey(GM_PROGRAM_ID)
);

console.log(open_orders);
</script>

<style scoped></style>
