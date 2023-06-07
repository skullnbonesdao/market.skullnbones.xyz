<script setup lang="ts">
import Avatar from "primevue/avatar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Image from "primevue/image";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { I_TokenData, useGlobalStore } from "../../../stores/GlobalStore";
import { CURRENCIES } from "../../../static/currencies";
import { ref } from "vue";
import NoData from "../NoData.vue";
import SendTokenModal from "../solana_actions/modals/SendTokenModal.vue";
import BurnTokenButton from "../solana_actions/buttons/BurnTokenButton.vue";
import ExplorerIcon from "../../icon-helper/ExplorerIcon.vue";
import { E_EXPLORER, EXPLORER } from "../../../static/explorer";
import CloseTokenAccountButton from "../solana_actions/buttons/CloseTokenAccountButton.vue";
import InputText from "primevue/inputtext";
import { FilterMatchMode } from "primevue/api";
import { BLACKLIST_URLS } from "../../../static/blacklist";
import { useUserWalletStore } from "../../../stores/UserWalletStore";

const expandedRows = ref([]);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

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
    return useUserWalletStore().tokens.filter(
      (element) =>
        element.sa_api_data?.attributes.itemType.toUpperCase() ===
        option_l2.toUpperCase()
    );
  }
  return useUserWalletStore().tokens.filter(
    (element) => (element.account_metadata?.model ?? "") === option_l1
  );
}
</script>

<template>
  <div>
    <DataTable
      v-if="filter_list(option_l1, option_sa).length"
      v-model:expandedRows="expandedRows"
      :value="filter_list(option_l1, option_sa)"
      tableStyle="min-width: 50rem"
      :global-filter-fields="['account_metadata.symbol']"
      v-model:filters="filters"
      sortField="account_metadata.symbol"
      :sortOrder="1"
    >
      <template #header>
        <div class="flex">
          <div class="flex w-full"></div>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="filters['global'].value"
              placeholder="Search (name)"
            />
          </span>
        </div>
      </template>

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
            v-else-if="slotProps.data.token_list_info"
            :image="slotProps.data.token_list_info?.logoURI"
            shape="circle"
          />
          <Avatar
            v-else-if="
              !BLACKLIST_URLS.some((black_url) =>
                slotProps.data.json_metadata?.image?.includes(black_url)
              )
            "
            :image="slotProps.data.json_metadata?.image"
            shape="circle"
          />
        </template>
      </Column>
      <Column field="account_metadata.symbol" header="Symbol" sortable></Column>
      <Column header="Type" sortable>
        <template #body="slotProps">
          {{ slotProps.data.account_metadata.model.toUpperCase() }}
        </template>
      </Column>

      <Column
        field="account_info.data.parsed.info.tokenAmount.uiAmount"
        header="Amount"
        sortable
      ></Column>
      <Column header="Price"></Column> <Column header="Value"></Column>
      <template #expansion="slotProps">
        <div>
          <TabView>
            <TabPanel header="About">
              <div>
                <div class="flex flex-row space-x-2">
                  <Image
                    v-if="slotProps.data.sa_api_data"
                    class="basis-1/5"
                    :src="slotProps.data.sa_api_data?.image"
                    alt="Image"
                    width="150"
                    preview
                  />
                  <Image
                    v-else-if="slotProps.data.token_list_info?.logoURI"
                    class="basis-1/5"
                    :src="slotProps.data.token_list_info?.logoURI"
                    alt="Image"
                    width="150"
                    preview
                  />
                  <Image
                    v-else-if="
                      !BLACKLIST_URLS.some((black_url) =>
                        slotProps.data.json_metadata?.image?.includes(black_url)
                      )
                    "
                    :src="slotProps.data.json_metadata?.image"
                    class="basis-1/5"
                    alt="Image"
                    width="150"
                    preview
                  />

                  <div class="grid grid-cols-1">
                    <div class="grid grid-cols-3 gap-2">
                      <p>Name:</p>
                      <p>{{ slotProps.data.account_metadata.name }}</p>
                    </div>
                    <div class="grid grid-cols-3 gap-2">
                      <p>Symbol:</p>
                      <p>{{ slotProps.data.account_metadata.symbol }}</p>
                    </div>
                    <div class="grid grid-cols-3 items-center gap-2">
                      <p>Mint:</p>
                      <p class="w-40 text-xs">
                        {{ slotProps.data.token_mint.substring(0, 5) }}[...]{{
                          slotProps.data.token_mint.substring(
                            slotProps.data.token_mint.length,
                            slotProps.data.token_mint.length - 5
                          )
                        }}
                      </p>
                      <div class="flex flex-row space-x-1">
                        <ExplorerIcon
                          class="w-5"
                          :explorer="
                            EXPLORER.find((e) => e.type === E_EXPLORER.SOLSCAN)
                          "
                          :address="slotProps.data.token_mint"
                        />
                        <ExplorerIcon
                          class="w-5"
                          :explorer="
                            EXPLORER.find((e) => e.type === E_EXPLORER.SOLANAFM)
                          "
                          :address="slotProps.data.token_mint"
                        />
                        <ExplorerIcon
                          class="w-5"
                          :explorer="
                            EXPLORER.find(
                              (e) => e.type === E_EXPLORER.STARATLAS
                            )
                          "
                          :address="slotProps.data.token_mint"
                        />
                      </div>
                    </div>
                    <div class="grid grid-cols-3 items-center gap-2">
                      <p>Account:</p>
                      <p class="w-40 text-xs">
                        {{ slotProps.data?.token_account.substring(0, 5) }}[...]
                        {{
                          slotProps.data?.token_account.substring(
                            slotProps.data?.token_account.length,
                            slotProps.data?.token_account.length - 5
                          )
                        }}
                      </p>
                      <div class="flex flex-row space-x-1">
                        <ExplorerIcon
                          class="w-5"
                          :explorer="
                            EXPLORER.find((e) => e.type === E_EXPLORER.SOLSCAN)
                          "
                          :address="slotProps.data.token_account"
                        />
                        <ExplorerIcon
                          class="w-5"
                          :explorer="
                            EXPLORER.find((e) => e.type === E_EXPLORER.SOLANAFM)
                          "
                          :address="slotProps.data.token_account"
                        />
                      </div>
                    </div>
                    <div class="grid grid-cols-3 gap-2">
                      <p>Amount:</p>
                      <p>
                        x{{
                          slotProps.data.account_info.data.parsed.info
                            .tokenAmount.uiAmountString
                        }}
                      </p>
                    </div>
                  </div>

                  <div class="flex w-full justify-end">
                    <div class="flex-row space-x-2">
                      <BurnTokenButton
                        :mint_send_token="slotProps.data.token_mint"
                        :max_amount_token="
                          parseFloat(
                            slotProps.data.account_info.data.parsed.info
                              .tokenAmount.uiAmountString
                          )
                        "
                        :token_decimals="
                          slotProps.data.account_info.data.parsed.info
                            .tokenAmount.decimals
                        "
                      />

                      <CloseTokenAccountButton
                        :mint_send_token="slotProps.data.token_mint"
                        :max_amount_token="
                          parseFloat(
                            slotProps.data.account_info.data.parsed.info
                              .tokenAmount.uiAmountString
                          )
                        "
                      />

                      <SendTokenModal
                        :mint_send_token="slotProps.data.token_mint"
                        :max_amount_token="
                          parseFloat(
                            slotProps.data.account_info.data.parsed.info
                              .tokenAmount.uiAmountString
                          )
                        "
                      />
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
            <TabPanel v-if="slotProps.data.sa_api_data" header="StarAtlasData">
              <json-viewer
                expand-depth="5"
                theme="my-awesome-json-theme"
                :class="useGlobalStore().is_dark ? 'bg-gray-300' : ''"
                :value="slotProps.data.sa_api_data"
              ></json-viewer>
            </TabPanel>
            <TabPanel v-if="slotProps.data.json_metadata" header="JsonMetadata">
              <json-viewer
                expand-depth="5"
                theme="my-awesome-json-theme"
                :class="useGlobalStore().is_dark ? 'bg-gray-300' : ''"
                :value="slotProps.data.json_metadata"
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
