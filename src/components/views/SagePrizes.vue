<template>
  <div class="m-2 space-y-2">
    <div class="p-card p-2 flex flex-col md:flex-row w-full gap-2">
      <div class="p-fluid flex w-full gap-2">
        <InputText
          class="w-full"
          type="text"
          placeholder="Enter a wallet address"
          v-model="text_user_wallet_input"
        /><Button
          icon="pi pi-search"
          @click="
            useGlobalStore().update_prizes(text_user_wallet_input.toString())
          "
        />
      </div>
    </div>
    <NoData
      class="p-card justify-center"
      v-if="!useGlobalStore().wallet.prizes.length"
    ></NoData>
    <div v-else class="flex flex-col space-y-2">
      <div class="flex justify-around">
        <div
          class="p-card p-2 flex flex-row space-x-2 items-center"
          v-for="object in mapped_prize_parents"
        >
          <Avatar
            :image="
              '/webp/' +
              useGlobalStore().wallet.prizes?.find((p) => p.name === object)
                .mint +
              '.webp'
            "
            size="large"
            shape="circle"
          />
          <div class="flex flex-col">
            <p>{{ object }}</p>
            <p>
              {{
                useGlobalStore()
                  .wallet.prizes.filter((p) => p.name.includes(object))
                  .map((p) => p.quantity)
                  ?.reduce((a, b) => a + b)
              }}
            </p>
          </div>
        </div>
      </div>
      <DataTable
        :filters="table_filters"
        :value="useGlobalStore().wallet.prizes"
        sortField="createdAt"
        :sortOrder="-1"
        tableStyle="min-width: 50rem"
        @filter="update_total()"
      >
        <template #header>
          <div class="flex justify-content-end">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="table_filters['global'].value"
                placeholder="Keyword Search"
              />
            </span>
          </div>
        </template>
        <template #empty> No prizes found. </template>
        <template #loading> Loading prizes table data. Please wait. </template>

        <Column>
          <template #body="slotProps">
            <Avatar
              :image="'/webp/' + slotProps.data.mint + '.webp'"
              class="mr-2"
              size="large"
              shape="circle"
            />
          </template>
        </Column>
        <Column field="name" header="Name" sortable></Column>
        <Column field="rarity" header="Rarity" sortable></Column>
        <Column field="quantity" header="Quantity" sortable></Column>
        <Column field="sector" header="Sector">
          <template #body="slotProps">
            <div class="grid grid-cols-2 gap-2">
              <p>X</p>
              <p>{{ slotProps.data.sector?.x }}</p>
              <p>Y</p>
              <p>{{ slotProps.data.sector?.y }}</p>
            </div>
          </template>
        </Column>

        <Column field="createdAt" header="Create" sortable>
          <template #body="slotProps">
            <div class="flex flex-col">
              <p>{{ slotProps.data.createdAt }}</p>

              <p class="text-purple-500 text-xs">
                Before:
                {{
                  calc_passed_time(
                    new Date(slotProps.data.createdAt).getTime() / 1000
                  )
                }}
              </p>
            </div>
          </template>
        </Column>
        <ColumnGroup type="footer">
          <Row>
            <Column footer="Sum:" :colspan="3" footerStyle="text-align:right" />
            <Column :footer="total_quantity_sum" />
            <Column :colspan="3" />
          </Row>
        </ColumnGroup>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Row from "primevue/row";
import ColumnGroup from "primevue/columngroup";
import { ref, watch } from "vue";
import InputText from "primevue/inputtext";
import Avatar from "primevue/avatar";
import { FilterMatchMode } from "primevue/api";
import { useGlobalStore } from "../../stores/GlobalStore";
import { calc_passed_time } from "../../static/formatting/calc_passed_time";
import { useWallet } from "solana-wallets-vue";
import NoData from "../elements/NoData.vue";

const text_user_wallet_input = ref(
  useWallet().publicKey.value?.toString() ??
    "862HwAZzNWwjdNCNYcTv9PbTpesxRuJehoQKB3aPVQK7"
);

const table_filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const total_quantity_sum = ref("");

const mapped_prize_parents = ref();

watch(
  () => useGlobalStore().wallet.prizes,
  () => {
    total_quantity_sum.value = useGlobalStore()
      .wallet.prizes.flatMap((p) => p.quantity)
      .reduce((a, b) => a + b)
      .toString();

    mapped_prize_parents.value = Array.from(
      new Set(useGlobalStore().wallet.prizes.map(({ name }) => name))
    );
  }
);

function update_total() {
  total_quantity_sum.value = useGlobalStore()
    .wallet.prizes.filter(
      (p) =>
        p.name
          .toLowerCase()
          .includes((table_filters.value.global.value ?? "").toLowerCase()) ||
        p.rarity
          .toLowerCase()
          .includes((table_filters.value.global.value ?? "").toLowerCase())
    )
    .flatMap((p) => p.quantity)
    .reduce((a, b) => a + b)
    .toString();
}
</script>

<style scoped></style>
