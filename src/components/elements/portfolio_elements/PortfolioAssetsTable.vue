<script setup lang="ts">
import Avatar from "primevue/avatar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Image from "primevue/image";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { I_OptionL1 } from "../../../views/TestView.vue";
import { I_TokenData, useGlobalStore } from "../../../stores/GlobalStore";
import { CURRENCIES } from "../../../static/currencies";
import { ref } from "vue";
import NoData from "../NoData.vue";

const expandedRows = ref([]);

const props = defineProps({
  option_l1: {
    type: String,
    required: true,
  },
  option_sa: {
    type: String,
    required: false,
  },
});

function filter_list(option_l1: String, option_l2?: string): I_TokenData[] {
  if (option_l2) {
    return useGlobalStore().wallet.tokens.filter(
      (element) =>
        element.sa_api_data?.attributes.itemType.toUpperCase() ===
        option_l2.toUpperCase()
    );
  }
  return useGlobalStore().wallet.tokens.filter(
    (element) => (element.account_metadata?.model ?? "") === option_l1
  );
  return useGlobalStore().wallet.tokens;
}

const onRowExpand = (event: any) => {
  //toast.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
};
const onRowCollapse = (event: any) => {
  //   toast.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
};
</script>

<template>
  <div>
    <DataTable
      v-if="filter_list(option_l1, option_sa).length"
      v-model:expandedRows="expandedRows"
      :value="filter_list(option_l1, option_sa)"
      @rowExpand="onRowExpand"
      @rowCollapse="onRowCollapse"
      tableStyle="min-width: 50rem"
    >
      <Column expander style="width: 5rem" />
      <Column>
        <template #body="slotProps">
          <Avatar
            v-if="CURRENCIES.some((c) => c.mint === slotProps.data.token_mint)"
            :image="
              CURRENCIES.find((c) => c.mint === slotProps.data.token_mint)
                ?.image_path
            "
          ></Avatar>
          <Avatar
            v-else-if="slotProps.data.sa_api_data"
            :image="'/webp/' + slotProps.data.token_mint + '.webp'"
            shape="circle"
          />
          <Avatar
            v-else
            :image="slotProps.data.token_list_info?.logoURI"
            shape="circle"
          />
          <!--          <Avatar-->
          <!--            :image="slotProps.data.token_list_info?.logoURI"-->
          <!--            shape="circle"-->
          <!--          />-->
        </template>
      </Column>
      <Column field="account_metadata.symbol" header="Symbol"></Column>
      <Column header="Type">
        <template #body="slotProps">
          {{ slotProps.data.account_metadata.model.toUpperCase() }}
        </template>
      </Column>

      <Column header="Info">
        <template #body="slotProps">
          <div class="flex flex-col">
            <div class="flex flex-row text-xs">
              Mint: {{ slotProps.data.token_mint }}
            </div>
            <div class="flex-1 text-xs">
              Account: {{ slotProps.data.token_account }}
            </div>
          </div>
        </template>
      </Column>
      <Column
        field="account_info.data.parsed.info.tokenAmount.uiAmount"
        header="Amount"
      ></Column>
      <template #expansion="slotProps">
        <div>
          <TabView>
            <TabPanel header="About">
              <div>
                <div class="flex flex-row items-center space-x-2">
                  <div>
                    <Image
                      class="basis-1/5"
                      :src="slotProps.data.sa_api_data?.image"
                      alt="Image"
                      width="150"
                      preview
                    />
                  </div>
                  <div class="grid grid-cols-2 text-sm">
                    <div class="grid grid-cols-1">
                      <div>Name:</div>
                      <div>Symbol:</div>
                      <div>Mint:</div>
                      <div>Account:</div>
                      <div>Amount:</div>
                    </div>
                    <div class="grid grid-cols-1">
                      <div>{{ slotProps.data.account_metadata.name }}</div>
                      <div>{{ slotProps.data.account_metadata.symbol }}</div>
                      <div>{{ slotProps.data.token_mint }}</div>
                      <div>{{ slotProps.data.token_account }}</div>
                      <div>
                        x{{
                          slotProps.data.account_info.data.parsed.info
                            .tokenAmount.uiAmountString
                        }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-full justify-end">
                    <div class="flex flex-row space-x-2">
                      <Button>123</Button>
                      <Button>123</Button>
                      <Button>123</Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Account">
              <json-viewer
                expand-depth="5"
                theme="my-awesome-json-theme"
                :class="useGlobalStore().is_dark ? 'bg-gray-300' : ''"
                :value="slotProps.data.account_info"
              ></json-viewer>
            </TabPanel>
            <TabPanel header="Metadata">
              <json-viewer
                expand-depth="5"
                theme="my-awesome-json-theme"
                :class="useGlobalStore().is_dark ? 'bg-gray-300' : ''"
                :value="slotProps.data.account_metadata"
              ></json-viewer>
            </TabPanel>
            <TabPanel header="StarAtlasData">
              <json-viewer
                expand-depth="5"
                theme="my-awesome-json-theme"
                :class="useGlobalStore().is_dark ? 'bg-gray-300' : ''"
                :value="slotProps.data.sa_api_data"
              ></json-viewer>
            </TabPanel>
          </TabView>
        </div>
      </template>

      <!--      <Column field="account_info" header="account_info"></Column>-->
      <!--      <Column field="account_metadata" header="account_metadata"></Column>-->
      <!--      <Column field="token_list_info" header="token_list_info"></Column>-->
    </DataTable>
    <NoData v-else></NoData>
  </div>
</template>

<style scoped></style>
