<script lang="ts" setup>
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import { useInsightsStore } from "../../../stores/InsightsStore";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
</script>

<template>
  <Accordion :activeIndex="0">
    <AccordionTab header="Collection">
      <DataTable
        :value="
          Object.keys(useInsightsStore().selected?.collection).flatMap(
            (obj) => {
              return {
                key: obj.toString().toUpperCase(),
                value: useInsightsStore().selected?.collection?.[obj],
              };
            }
          )
        "
        tableStyle="min-width: 50rem"
      >
        <Column :sortable="true" field="key" header="Info" />
        <Column :sortable="true" field="value" header="Value" />
      </DataTable>
    </AccordionTab>

    <AccordionTab header="Attributes">
      <DataTable
        :value="
          Object.keys(useInsightsStore().selected?.attributes).flatMap(
            (obj) => {
              return {
                key: obj.toString(),
                value: useInsightsStore().selected?.attributes?.[obj],
              };
            }
          )
        "
        tableStyle="min-width: 50rem"
      >
        <Column :sortable="true" field="key" header="Info" />
        <Column :sortable="true" field="value" header="Value" />
      </DataTable>
    </AccordionTab>
  </Accordion>

  <Accordion>
    <AccordionTab
      v-for="key in Object.keys(useInsightsStore().selected?.slots)"
      :header="key.split('S')[0].toUpperCase()"
    >
      <DataTable
        v-if="useInsightsStore().selected?.slots?.[key].length"
        :value="useInsightsStore().selected?.slots?.[key]"
        tableStyle="min-width: 50rem"
      >
        <Column
          v-for="keys in Object.keys(
            (useInsightsStore().selected?.slots?.[key])[0]
          )"
          :field="keys"
          :header="keys.toUpperCase()"
          :sortable="true"
        ></Column>
      </DataTable>
    </AccordionTab>
  </Accordion>
</template>

<style scoped></style>