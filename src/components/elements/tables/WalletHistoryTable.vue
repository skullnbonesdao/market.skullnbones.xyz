<template>
  <div class="">
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
    </TreeTable>
  </div>
</template>

<script setup lang="ts">
import TreeTable from "primevue/treetable";
import Column from "primevue/column";
import { useGlobalStore } from "../../../stores/GlobalStore";
import CurrencyIcon from "../../icon-helper/CurrencyIcon.vue";
import { CURRENCIES } from "../../../static/currencies";
</script>

<style scoped></style>
