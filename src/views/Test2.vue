<template>hallo {{ result?.trades[0] }}</template>

<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import { GET_LAST_PRICE_FOR_MINTS } from "../static/graphql/get_last_price_for_mints";

// export default {
//   name: "Test2",
//   apollo: {
//     trades: {
//       query: GET_LAST_PRICE_FOR_MINTS,
//       loadingKey: "i am loading ",
//     },
//   },
//};

const { result } = useQuery(GET_LAST_PRICE_FOR_MINTS, {
  asset_mint: "ammoK8AkX2wnebQb35cDAZtTkvsXQbi82cGeTnUvvfK",
  currency_mint: "ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx",
});
</script>
