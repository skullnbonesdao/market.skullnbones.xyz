<script lang="ts" setup>
import { I_Token } from "../../../stores/UserWalletStore";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Avatar from "primevue/avatar";
import { PropType, ref, watchEffect } from "vue";
import { E_EXPLORER, EXPLORER } from "../../../static/explorer";
import { useGlobalStore } from "../../../stores/GlobalStore";
import TabView from "primevue/tabview";
import ExplorerIcon from "../../../components/icon-helper/ExplorerIcon.vue";
import TabPanel from "primevue/tabpanel";
import Image from "primevue/image";
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";
import BurnTokenButton from "../../../components/elements/solana_actions/buttons/BurnTokenButton.vue";
import MultiPriceTemplate from "../../../components/elements/templates/MultiPriceTemplate.vue";
import ToggleButton from "primevue/togglebutton";
import { format_address } from "../../../static/formatting/format_address";
import NoData from "../../../components/elements/NoData.vue";

const props = defineProps({
  account: {
    type: [] as PropType<Array<I_Token>>,
    default: [],
  },
});

const expandedRows = ref();
const hide_zero_quantity = ref(true);
const accounts_filtered = ref();
const totals = ref({
  usdc: 0,
  atlas: 0,
});

watchEffect(() => {
  if (hide_zero_quantity.value)
    accounts_filtered.value = props.account?.filter(
      (a) => a.account?.data?.parsed?.info?.tokenAmount?.uiAmount != 0
    );
  else accounts_filtered.value = props.account;
});

watchEffect(() => {
  totals.value.usdc = accounts_filtered?.value
    ?.flatMap(
      (a: I_Token) =>
        a.account?.data.parsed.info.tokenAmount.uiAmount *
        (a.market_price?.usdc ?? 0)
    )
    ?.reduce((a: number, b: number) => a + b, 0);

  totals.value.atlas = accounts_filtered?.value
    ?.flatMap(
      (a: I_Token) =>
        a.account?.data.parsed.info.tokenAmount.uiAmount *
        (a.market_price?.atlas ?? 0)
    )
    ?.reduce((a: number, b: number) => a + b, 0);
});
</script>

<template>
  <DataTable
    v-if="accounts_filtered.length"
    v-model:expandedRows="expandedRows"
    :sortOrder="-1"
    :value="accounts_filtered"
    class="p-datatable-sm"
    sortField="metadata.name"
  >
    <template #header>
      <div class="flex">
        <div class="w-full"></div>
        <ToggleButton
          v-model="hide_zero_quantity"
          class="w-9rem"
          offIcon="pi pi-times"
          offLabel="show 0"
          onIcon="pi pi-check"
          onLabel="hide 0"
        />
      </div>
    </template>

    <Column expander style="width: 5rem" />
    <Column>
      <template #body="slotProps">
        <Avatar
          v-if="slotProps.data.metadata?.json?.image"
          :image="slotProps.data.metadata?.json?.image"
          shape="circle"
        ></Avatar>
        <Avatar
          v-else-if="slotProps.data.metadata?.image"
          :image="slotProps.data.metadata?.image"
          shape="circle"
        ></Avatar>
        <Avatar
          v-else
          :image="slotProps.data.metadata?.logoURI"
          shape="circle"
        ></Avatar>
      </template>
    </Column>
    <Column :sortable="true" field="metadata.symbol" header="Symbol"></Column>
    <Column :sortable="true" field="metadata.name" header="Name"></Column>

    <Column
      field="account.data.parsed.info.tokenAmount.uiAmount"
      header="Quantity"
      sortable
    >
      <template #body="slotProps">
        <div class="grid grid-cols-1 gap-1">
          <p>
            {{
              slotProps.data.account.data.parsed.info.tokenAmount.uiAmount.toFixed(
                2
              )
            }}
          </p>
        </div>
      </template>
    </Column>

    <Column header="Price">
      <template #body="slotProps">
        <MultiPriceTemplate
          :price_atlas="slotProps.data.market_price.atlas"
          :price_usdc="slotProps.data.market_price.usdc"
        />
      </template>
    </Column>

    <Column header="Value">
      <template #body="slotProps">
        <MultiPriceTemplate
          :price_atlas="
            slotProps.data.market_price.atlas *
            slotProps.data.account.data.parsed.info.tokenAmount.uiAmount
          "
          :price_usdc="
            slotProps.data.market_price.usdc *
            slotProps.data.account.data.parsed.info.tokenAmount.uiAmount
          "
        />
      </template>
    </Column>

    <template #expansion="slotProps">
      <div>
        <TabView class="p-card">
          <TabPanel header="Details">
            <div class="flex flex-row space-x-2">
              <Image
                v-if="slotProps.data.metadata?.json?.image"
                :src="slotProps.data.metadata?.json?.image"
                alt="Image"
                class="basis-1/5"
                preview
                width="150"
              />
              <Image
                v-else-if="slotProps.data.metadata?.image"
                :src="slotProps.data.metadata?.image"
                alt="Image"
                class="basis-1/5"
                preview
                width="150"
              />
              <Image
                v-else-if="slotProps.data.metadata?.image"
                :src="slotProps.data.metadata?.image"
                alt="Image"
                class="basis-1/5"
                preview
                width="150"
              />

              <div class="grid grid-cols-1">
                <div class="grid grid-cols-3 gap-2">
                  <p>Name:</p>
                  <p>{{ slotProps.data.metadata.name }}</p>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <p>Symbol:</p>
                  <p>{{ slotProps.data.metadata.symbol }}</p>
                </div>
                <div class="grid grid-cols-3 items-center gap-2">
                  <p>Mint:</p>
                  <p class="w-40 text-xs">
                    {{
                      format_address(
                        slotProps.data.metadata.mint ??
                          slotProps.data.metadata.address ??
                          ""
                      )
                    }}
                  </p>
                  <div class="flex flex-row space-x-1">
                    <ExplorerIcon
                      :address="slotProps.data.token_mint"
                      :explorer="
                        EXPLORER.find((e) => e.type === E_EXPLORER.SOLSCAN)
                      "
                      class="w-5"
                    />
                    <ExplorerIcon
                      :address="slotProps.data.token_mint"
                      :explorer="
                        EXPLORER.find((e) => e.type === E_EXPLORER.SOLANAFM)
                      "
                      class="w-5"
                    />
                    <ExplorerIcon
                      :address="slotProps.data.token_mint"
                      :explorer="
                        EXPLORER.find((e) => e.type === E_EXPLORER.STARATLAS)
                      "
                      class="w-5"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-3 items-center gap-2">
                  <p>Account:</p>
                  <p class="w-40 text-xs">
                    {{
                      format_address(slotProps.data.publicKey.toString() ?? "")
                    }}
                  </p>
                  <div class="flex flex-row space-x-1">
                    <ExplorerIcon
                      :address="slotProps.data.token_account"
                      :explorer="
                        EXPLORER.find((e) => e.type === E_EXPLORER.SOLSCAN)
                      "
                      class="w-5"
                    />
                    <ExplorerIcon
                      :address="slotProps.data.token_account"
                      :explorer="
                        EXPLORER.find((e) => e.type === E_EXPLORER.SOLANAFM)
                      "
                      class="w-5"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <p>Quantity:</p>
                  <p>
                    {{
                      slotProps.data.account.data.parsed.info.tokenAmount
                        .uiAmountString
                    }}
                  </p>
                </div>
              </div>

              <div class="flex w-full justify-end items-center">
                <div class="flex-row space-x-2">
                  <BurnTokenButton
                    :max_amount_token="
                      parseFloat(
                        slotProps.data.account.data.parsed.info.tokenAmount
                          .uiAmountString
                      )
                    "
                    :mint_send_token="slotProps.data.metadata.mint"
                    :token_decimals="
                      slotProps.data.account.data.parsed.info.tokenAmount
                        .decimals
                    "
                  />

                  <CloseTokenAccountButton
                    :max_amount_token="
                      parseFloat(
                        slotProps.data.account.data.parsed.info.tokenAmount
                          .uiAmountString
                      )
                    "
                    :mint_send_token="slotProps.data.metadata.mint"
                  />

                  <SendTokenModal
                    :max_amount_token="
                      parseFloat(
                        slotProps.data.account.data.parsed.info.tokenAmount
                          .uiAmountString
                      )
                    "
                    :mint_send_token="slotProps.data.metadata.mint"
                  />
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Account">
            <json-viewer
              :class="useGlobalStore().is_dark ? 'bg-gray-300' : ''"
              :value="slotProps.data.account"
              expand-depth="5"
              theme="my-awesome-json-theme"
            ></json-viewer>
          </TabPanel>
          <TabPanel header="Metadata">
            <json-viewer
              :class="useGlobalStore().is_dark ? 'bg-gray-300' : ''"
              :value="slotProps.data.metadata"
              expand-depth="5"
              theme="my-awesome-json-theme"
            ></json-viewer>
          </TabPanel>
        </TabView>
      </div>
    </template>
    <ColumnGroup type="footer">
      <Row>
        <Column :colspan="6" footer="Totals:" footerStyle="text-align:left" />
        <Column>
          <template #footer>
            <MultiPriceTemplate
              :price_atlas="totals.atlas"
              :price_usdc="totals.usdc"
            />
          </template>
        </Column>
      </Row>
    </ColumnGroup>
  </DataTable>

  <NoData v-else class="flex justify-center" />
</template>

<style scoped></style>