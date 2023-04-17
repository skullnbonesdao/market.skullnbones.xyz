<template>
  <div class="m-2 space-y-2">
    <div class="p-card">
      <div class="p-card-body flex flex-row space-x-2">
        <InputText class="w-full bg-gray-700" type="text" /><Button
          label="Search"
        />
      </div>
    </div>
    <div class="grid grid-cols-3 gap-5">
      <TokenPriceElement
        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.SOL)"
        :price="0.0"
        :change24h="24"
        image-name="some"
      />
      <TokenPriceElement
        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.SOL)"
        :price="0.0"
        :change24h="24"
        image-name="some"
      />
      <TokenPriceElement
        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.SOL)"
        :price="0.0"
        :change24h="24"
        image-name="some"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from "primevue/inputtext";
import TokenPriceElement from "../../components/elements/TokenPriceElement.vue";
import { CURRENCIES, E_CURRENCIES } from "../../static/currencies";
</script>

<style scoped></style>
