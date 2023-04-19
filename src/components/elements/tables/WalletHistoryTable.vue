<template>
  <div class="">
    <TreeTable :value="useGlobalStore().wallet.historySorted">
      <Column field="name" header="" expander> </Column>
      <Column field="type" header="Type"></Column>
      <Column field="price" header="Price"></Column>

      <Column field="size" header="Size"></Column>
    </TreeTable>
  </div>
</template>

<script setup lang="ts">
import TreeTable from "primevue/treetable";
import Column from "primevue/column";
import { useGlobalStore } from "../../../stores/GlobalStore";
</script>

<style scoped></style>
