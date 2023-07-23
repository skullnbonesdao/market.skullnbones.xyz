<script lang="ts" setup>
import { useInsightsStore } from "../../../stores/InsightsStore";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
</script>

<template>
  <Accordion :activeIndex="1">
    <AccordionTab header="JSON">
      <json-viewer
        :expand-depth="5"
        :value="useInsightsStore().selected ?? ''"
        copyable
        sort
      ></json-viewer>
    </AccordionTab>
  </Accordion>
</template>

<style scoped></style>