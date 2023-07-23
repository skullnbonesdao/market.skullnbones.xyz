<script lang="ts" setup>
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import { useInsightsStore } from "../../../stores/InsightsStore";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
</script>

<template>
  <Accordion :activeIndex="0">
    <AccordionTab header="Attributes">
      <div
        v-for="key in Object.keys(useInsightsStore().selected?.attributes)"
        class="grid grid-cols-2 gap-2"
      >
        <div class="p-card p-2 mb-2 text-center uppercase">{{ key }}</div>
        <div class="p-card p-2 mb-2 text-center uppercase">
          {{ useInsightsStore().selected?.attributes[key] }}
        </div>
      </div>
    </AccordionTab>
    <AccordionTab header="Collection">
      <div
        v-for="key in Object.keys(useInsightsStore().selected?.collection)"
        class="grid grid-cols-2 gap-2"
      >
        <div class="p-card p-2 mb-2 uppercase">{{ key }}</div>
        <div class="p-card p-2 mb-2 uppercase">
          {{ useInsightsStore().selected?.collection?.[key] }}
        </div>
      </div>
    </AccordionTab>
  </Accordion>

  <Accordion>
    <AccordionTab
      v-for="key in Object.keys(useInsightsStore().selected?.slots)"
      :header="key.split('S')[0].toUpperCase()"
    >
      <DataTable
        :value="useInsightsStore().selected?.slots?.[key]"
        tableStyle="min-width: 50rem"
      >
        <Column
          v-for="keys in Object.keys(
            useInsightsStore().selected?.slots?.[key][0]
          )"
          v-if="useInsightsStore().selected?.slots?.[key][0]"
          :field="keys"
          :header="keys.toUpperCase()"
          :sortable="true"
        ></Column>
      </DataTable>
    </AccordionTab>
  </Accordion>
</template>

<style scoped></style>