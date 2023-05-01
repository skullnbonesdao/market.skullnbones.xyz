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
          :disabled="!useGlobalStore().status.is_initalized"
          icon="pi pi-search"
          @click="update_wallet_prizes(text_user_wallet_input)"
        />
      </div>
    </div>
    <NoData
      class="p-card justify-center"
      v-if="!is_valid_publicKey(text_user_wallet_input)"
      text="Invalid PublicKey!"
    ></NoData>
    <div v-else>
      <div class="p-card">
        <NoData
          v-if="!is_loading && !prizes.length"
          class="w-full justify-center"
        ></NoData>
        <div v-else-if="is_loading" class="flex w-full justify-center">
          <ProgressSpinner></ProgressSpinner>
        </div>

        <div v-else>
          <Panel header="Loot-Table" toggleable>
            <DataTable
              v-model:expandedRows="expandedRows"
              :value="prizes"
              dataKey="name"
              tableStyle="min-width: 60rem"
            >
              <template #header>
                <div class="flex w-full justify-end gap-2">
                  <Button
                    text
                    icon="pi pi-plus"
                    label="Expand All"
                    @click="expandAll"
                  />
                  <Button
                    text
                    icon="pi pi-minus"
                    label="Collapse All"
                    @click="collapseAll"
                  />
                </div>
              </template>
              <Column expander style="width: 5rem" />
              <Column header="Loot">
                <template #body="slotProps">
                  <div class="flex flex-row items-center space-x-2">
                    <CurrencyIcon
                      style="width: 32px"
                      v-if="
                        CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)
                          ?.mint === slotProps.data?.elements?.at(0).mint
                      "
                      :currency="
                        CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)
                      "
                    ></CurrencyIcon>
                    <Avatar
                      v-else
                      shape="circle"
                      :image="
                        '/webp/' +
                        slotProps.data?.elements?.at(0).mint +
                        '.webp'
                      "
                    ></Avatar>
                    <p>{{ slotProps.data?.name }}</p>
                  </div>
                </template>
              </Column>
              <Column header="Rarity">
                <template #body="slotProps">
                  <AssetRarityBadge
                    :asset_class="slotProps.data.elements?.at(0).rarity"
                  ></AssetRarityBadge>
                </template>
              </Column>
              <Column field="elements.length" header="Drops" sortable>
                <template #body="slotProps">
                  x{{ slotProps.data.elements?.length }}
                </template>
              </Column>
              <Column header="Quantity">
                <template #body="slotProps">
                  {{
                    slotProps.data.elements
                      ?.flatMap((e: I_SagePrize) => e.quantity)
                      .reduce((a: number, b: number) => a + b)
                  }}
                  <!--          <Avatar-->
                  <!--            :image="'/webp/' + slotProps.data?.elements[0]?.mint + '.webp'"-->
                  <!--          ></Avatar>-->
                </template>
              </Column>
              <Column field="atlas_price" header="Market-Price" sortable>
                <template #body="slotProps">
                  <div class="flex gap-2">
                    <CurrencyIcon
                      style="height: 24px"
                      :currency="
                        CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)
                      "
                    />
                    <span> {{ slotProps.data?.atlas_price }}</span>
                  </div>
                </template>
              </Column>
              <Column header="Value" sortable>
                <template #body="slotProps">
                  <div class="flex gap-2">
                    <CurrencyIcon
                      style="height: 24px"
                      :currency="
                        CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)
                      "
                    />
                    <span>
                      {{
                        (
                          slotProps.data.elements
                            ?.flatMap((e: I_SagePrize) => e.quantity)
                            .reduce((a: number, b: number) => a + b) *
                            slotProps.data.atlas_price ?? 0
                        ).toFixed(2)
                      }}</span
                    >
                  </div>
                </template>
              </Column>

              <template #expansion="slotProps">
                <div class="p-3">
                  <h5 class="font-bold text-xl">
                    Details for {{ slotProps.data.name }}
                  </h5>
                  <DataTable
                    :value="slotProps.data.elements"
                    sort-field="createdAt"
                    sort-order="-1"
                  >
                    <Column field="name" header="Name">
                      <template #body="slotProps">
                        <div class="flex flex-row items-center space-x-2">
                          <Avatar
                            shape="circle"
                            :image="'/webp/' + slotProps.data?.mint + '.webp'"
                          ></Avatar>
                          <p>{{ slotProps.data.name }}</p>
                        </div>
                      </template>
                    </Column>
                    <Column field="rarity" header="Rarity">
                      <template #body="slotProps">
                        <AssetRarityBadge
                          :asset_class="slotProps.data.rarity"
                        ></AssetRarityBadge>
                      </template>
                    </Column>
                    <Column
                      field="quantity"
                      header="Quantity"
                      sortable
                    ></Column>

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
                                new Date(slotProps.data.createdAt).getTime() /
                                  1000
                              )
                            }}
                          </p>
                        </div>
                      </template>
                    </Column>
                  </DataTable>
                </div>
              </template>
              <ColumnGroup type="footer">
                <Row>
                  <Column
                    footer="Sum:"
                    :colspan="3"
                    footerStyle="text-align:right"
                  />

                  <Column :footer="'x' + sum_drops.toString()" />
                  <Column :footer="sum_quantity.toString()" />
                  <Column> </Column>
                  <Column>
                    <template #footer>
                      <div class="flex flex-row space-x-2">
                        <CurrencyIcon
                          style="width: 24px"
                          :currency="
                            CURRENCIES.find(
                              (c) => c.type === E_CURRENCIES.ATLAS
                            )
                          "
                        ></CurrencyIcon>

                        <p class="text-green-500">
                          {{ sum_value?.toFixed(2) }}
                        </p>
                      </div></template
                    >
                  </Column>
                </Row>
                <Row>
                  <Column
                    footerStyle="text-align:right"
                    :footer="'Net cost estimation*:'"
                    :colspan="3"
                  ></Column>
                  <Column>
                    <template #footer>
                      <div class="flex flex-col space-y-1">
                        <div
                          v-tooltip.bottom="'Incoming SOL transfers'"
                          class="p-inputgroup flex-1"
                        >
                          <span class="p-inputgroup-addon">
                            <CurrencyIcon
                              style="height: 24px"
                              :currency="
                                CURRENCIES.find(
                                  (c) => c.type === E_CURRENCIES.SOL
                                )
                              "
                            ></CurrencyIcon>
                          </span>
                          <InputText
                            type="number"
                            v-model="player_sol.inflow"
                          ></InputText>
                          <span class="p-inputgroup-addon flex-1">+IN</span>
                        </div>
                        <div
                          v-tooltip.bottom="'Outgoing SOL transfers'"
                          class="p-inputgroup flex-1"
                        >
                          <span class="p-inputgroup-addon">
                            <CurrencyIcon
                              style="height: 24px"
                              :currency="
                                CURRENCIES.find(
                                  (c) => c.type === E_CURRENCIES.SOL
                                )
                              "
                            ></CurrencyIcon>
                          </span>
                          <InputText
                            type="number"
                            v-model="player_sol.outflow"
                          ></InputText>
                          <span class="p-inputgroup-addon flex-1">-OUT</span>
                        </div>
                        <div
                          v-tooltip.bottom="'Current wallet balance'"
                          class="p-inputgroup flex-1"
                        >
                          <span class="p-inputgroup-addon">
                            <CurrencyIcon
                              style="height: 24px"
                              :currency="
                                CURRENCIES.find(
                                  (c) => c.type === E_CURRENCIES.SOL
                                )
                              "
                            ></CurrencyIcon>
                          </span>
                          <InputText v-model="player_sol.current"></InputText>
                          <span type="number" class="p-inputgroup-addon flex-1"
                            >-IS</span
                          >
                        </div>
                      </div>
                    </template>
                  </Column>
                  <Column>
                    <template #footer>
                      <div class="flex flex-row space-x-2">
                        <CurrencyIcon
                          style="height: 24px"
                          :currency="
                            CURRENCIES.find((c) => c.type === E_CURRENCIES.SOL)
                          "
                        ></CurrencyIcon>
                        <p>
                          {{ player_sol_sage_usage.toFixed(5) }}
                          (Sage-Usage)
                        </p>
                      </div>
                    </template>
                  </Column>

                  <Column>
                    <template #footer>
                      <div class="flex flex-row space-x-2">
                        <CurrencyIcon
                          style="height: 24px"
                          :currency="
                            CURRENCIES.find(
                              (c) => c.type === E_CURRENCIES.ATLAS
                            )
                          "
                        ></CurrencyIcon>
                        <p>
                          {{
                            (
                              ((useGlobalStore().currencyPrice?.data[
                                CURRENCIES.find(
                                  (c) => c.type === E_CURRENCIES.SOL
                                )?.mint ?? ""
                              ]?.value ?? 0) *
                                player_sol_sage_usage) /
                              useGlobalStore().currencyPrice.data[
                                CURRENCIES.find(
                                  (c) => c.type === E_CURRENCIES.ATLAS
                                )?.mint ?? ""
                              ]?.value
                            )?.toFixed(3)
                          }}
                          (used/value)
                        </p>
                      </div></template
                    >
                  </Column>

                  <Column>
                    <template #footer>
                      <div class="flex flex-row space-x-2">
                        <CurrencyIcon
                          style="height: 24px"
                          :currency="
                            CURRENCIES.find(
                              (c) => c.type === E_CURRENCIES.ATLAS
                            )
                          "
                        ></CurrencyIcon>
                        <p>
                          {{ roi_net_value }}
                          (NET*)
                        </p>
                      </div></template
                    >
                  </Column>
                </Row>
              </ColumnGroup>
              <div class="w-full">
                <p class="w-full text-right text-xs p-3 text-orange-400">
                  * Net calculation - can be incorrect! [based on
                  last(50)-sol-transfers Formula: sage=in-out-balance]
                </p>
              </div>
            </DataTable>
          </Panel>
          <Panel header="Loot-Heatmap" toggleable>
            <div class="flex w-full justify-center">
              <SageLootHeatmap :data="sage_heatmap_data"></SageLootHeatmap>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Panel from "primevue/panel";
import Button from "primevue/button";
import NoData from "../components/elements/NoData.vue";
import InputText from "primevue/inputtext";
import ProgressSpinner from "primevue/progressspinner";
import CurrencyIcon from "../components/icon-helper/CurrencyIcon.vue";
import { CURRENCIES, E_CURRENCIES } from "../static/currencies";
import { computed, ref } from "vue";
import { get_player_prizes } from "../static/apis/SA_Galaxy/SA_Galaxy";
import { I_SagePrize } from "../static/apis/SA_Galaxy/I_Sage_Prizes";
import Avatar from "primevue/avatar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Row from "primevue/row";
import ColumnGroup from "primevue/columngroup";
import AssetRarityBadge from "../components/elements/badges/AssetRarityBadge.vue";
import { calc_passed_time } from "../static/formatting/calc_passed_time";
import { useQuery } from "@vue/apollo-composable";
import { GET_LAST_PRICE_FOR_MINTS } from "../static/graphql/get_last_price_for_mints";
import { is_valid_publicKey } from "../static/formatting/is_valid_public_key";
import { useWallet } from "solana-wallets-vue";
import { Connection, PublicKey } from "@solana/web3.js";
import { useGlobalStore } from "../stores/GlobalStore";
import SageLootHeatmap, {
  HeatMapData,
} from "../components/charts/heatmap/SageLootHeatmap.vue";

const text_user_wallet_input = ref<string>(
  useWallet().publicKey.value?.toString() ??
    import.meta.env.VITE_DEV_SCORE_TEST_WALLET.toString()
);
const expandedRows = ref();
const expandAll = () => {
  expandedRows.value = prizes.value.filter((p) => p.name);
};
const collapseAll = () => {
  expandedRows.value = null;
};

const is_loading = ref(false);

interface SortedElement {
  name: string;
  elements: I_SagePrize[] | undefined;
  atlas_price: any;
}

const player_prizes = ref<I_SagePrize[]>();
const player_sol: any = ref({
  inflow: 0,
  current: 0,
  outflow: 0,
});

const prizes = computed(() => {
  let unique_prize_names = [
    ...new Set(player_prizes.value?.map((item: I_SagePrize) => item.name)),
  ] as string[];

  let sorted: SortedElement[] = [];
  for (const prize of unique_prize_names) {
    sorted.push({
      name: prize,
      elements: player_prizes.value?.filter((p) => p.name.includes(prize)),
      atlas_price:
        prize === "ATLAS"
          ? 1.0
          : useQuery(GET_LAST_PRICE_FOR_MINTS, {
              asset_mint: player_prizes.value?.find((p) =>
                p.name.includes(prize)
              )?.mint,
              currency_mint: CURRENCIES.find(
                (c) => c.type === E_CURRENCIES.ATLAS
              )?.mint,
            }).result?.value?.trades[0]?.price ?? 0.0,
    });
  }
  return sorted;
});

const sum_drops = computed(() => {
  let value = 0;
  prizes.value.forEach((p) => {
    value += p.elements?.length ?? 0;
  });
  return value;
});

const sum_quantity = computed(() => {
  let value = 0;
  prizes.value.forEach((p) => {
    value +=
      p.elements?.flatMap((e) => e.quantity).reduce((a, b) => a + b) ?? 0;
  });
  return value;
});

const sum_value = computed(() => {
  let value = 0;
  prizes.value.forEach((p) => {
    value +=
      (p.elements?.flatMap((e) => e.quantity).reduce((a, b) => a + b) ?? 0) *
      p.atlas_price;
  });
  return value;
});

const roi_used_value = computed(() => {});

const roi_net_value = computed(() => {
  return (
    sum_value.value -
    (useGlobalStore().currencyPrice.data[
      CURRENCIES.find((c) => c.type === E_CURRENCIES.SOL)?.mint ?? ""
    ]?.value *
      player_sol_sage_usage.value) /
      useGlobalStore().currencyPrice.data[
        CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)?.mint ?? ""
      ]?.value
  ).toFixed(3);
});

function get_account_solana_stats(wallet: string) {
  //Get Amount Inflow
  fetch(
    "https://api.solscan.io/account/soltransfer/txs?address=" +
      wallet +
      "&offset=0&limit=50"
  )
    .then((resp) => resp.json())
    .then((json) => {
      player_sol.value.inflow = 0;
      player_sol.value.outflow = 0;

      json.data.tx.transactions.forEach((element: any) => {
        player_sol.value.inflow +=
          element.dst === wallet ? element.lamport * Math.pow(10, -9) : 0;
        player_sol.value.outflow +=
          element.dst === wallet ? 0 : element.lamport * Math.pow(10, -9);
      });
    });

  //Get Current Amount
  player_sol.value.current = 0;
  const connection = new Connection(useGlobalStore().rpc.url);
  connection.getAccountInfo(new PublicKey(wallet)).then((resp) => {
    player_sol.value.current = (resp?.lamports ?? 0) * Math.pow(10, -9);
  });
}

const player_sol_sage_usage = computed(() => {
  return (
    player_sol.value.inflow -
    player_sol.value.outflow -
    player_sol.value.current
  );
});

const sage_heatmap_data = computed(() => {
  let array: HeatMapData[] = [];

  player_prizes.value?.forEach((prize) => {
    array.push({
      x_label: prize.sector?.x.toString(),
      y_label: prize.sector?.y.toString(),
      value: 1,
    });
  });

  //Remove duplicates
  return Object.values(
    array.reduce((acc, { x_label, y_label, value }) => {
      value = +value; // convert to number
      const key = x_label + "_" + y_label; // unique combination of id and subject
      acc[key] = acc[key] || { x_label, y_label, value: 0 };
      acc[key].value += value;
      return acc;
    }, {})
  );
});

async function update_wallet_prizes(wallet: string) {
  is_loading.value = true;
  get_account_solana_stats(wallet);
  player_prizes.value = (await get_player_prizes(wallet)) as never;

  is_loading.value = false;
}
</script>

<style scoped></style>
