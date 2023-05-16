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
import { E_EXPLORER, EXPLORER } from "../../../static/explorer";
import ExplorerIcon from "../icons_images/ExplorerIcon.vue";
import Button from "primevue/button";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useWallet } from "solana-wallets-vue";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import SendTokenModal from "../modals/SendTokenModal.vue";

const expandedRows = ref([]);
const is_unsecured = ref(false);
const toast = useToast();
const send_modal_visible = ref(false);

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

function btn_make_unsecure() {
  is_unsecured.value = true;
  toast.add({
    severity: "warn",
    summary: "Burning - active",
    detail: "Click again to burn your NFT!",
    life: 3000,
  });
}

async function btn_action_burn(nft_mint_to_burn: string) {
  const connection = new Connection(useGlobalStore().rpc.url);

  const associatedAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(nft_mint_to_burn),
    new PublicKey(useWallet().publicKey.value ?? "")
  );

  const burn_instruction = spl.Token.createBurnInstruction(
    TOKEN_PROGRAM_ID,
    new PublicKey(nft_mint_to_burn),
    associatedAddress,
    new PublicKey(useWallet().publicKey.value ?? ""),
    [],
    1
  );

  const close_account_instruction = spl.Token.createCloseAccountInstruction(
    TOKEN_PROGRAM_ID,
    associatedAddress,
    new PublicKey(useWallet().publicKey.value ?? ""),
    new PublicKey(useWallet().publicKey.value ?? ""),
    []
  );

  const instuctions = new Transaction().add(
    burn_instruction,
    close_account_instruction
  );

  const tx_signature = await useWallet().sendTransaction(
    instuctions,
    connection
  );

  const is_confirmed = await connection.confirmTransaction(
    tx_signature,
    "processed"
  );

  if (is_confirmed) {
    console.log("Burned");
  } else {
    console.log("errror buring");
  }
}
</script>

<template>
  <div>
    <Toast />
    <DataTable
      v-if="filter_list(option_l1, option_sa).length"
      v-model:expandedRows="expandedRows"
      :value="filter_list(option_l1, option_sa)"
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
                  <div class="flex flex-row items-center space-x-2">
                    <div class="flex flex-col">
                      <div>Name:</div>
                      <div>Symbol:</div>
                      <div>Mint:</div>
                      <div>Account:</div>
                      <div>Amount:</div>
                    </div>

                    <div class="flex flex-col">
                      <div>{{ slotProps.data.account_metadata.name }}</div>
                      <div>{{ slotProps.data.account_metadata.symbol }}</div>
                      <div class="grid grid-cols-2">
                        {{ slotProps.data.token_mint }}
                      </div>
                      <div>{{ slotProps.data.token_account }}</div>
                      <div>
                        x{{
                          slotProps.data.account_info.data.parsed.info
                            .tokenAmount.uiAmountString
                        }}
                      </div>
                    </div>
                    <div class="flex flex-col space-y-2">
                      <div class="text-transparent">-</div>
                      <div class="text-transparent">-</div>
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

                      <div class="text-transparent">-</div>
                    </div>
                  </div>

                  <div class="flex w-full justify-end">
                    <div class="flex flex-row space-x-2">
                      <Button
                        v-tooltip.bottom="'Burn NFT (unlock)'"
                        v-if="!is_unsecured"
                        class="p-button-secondary"
                        @click="btn_make_unsecure"
                        ><i class="pi pi-trash"></i
                      ></Button>
                      <Button
                        v-else
                        @click="
                          btn_action_burn(slotProps.data.token_mint).then(
                            () => {
                              is_unsecured = false;
                            }
                          )
                        "
                        v-tooltip.bottom="'Burn NFT (unlocked)'"
                        class="p-button-danger"
                        ><i class="pi pi-exclamation-triangle"></i
                      ></Button>

                      <SendTokenModal
                        :mint_send_token="slotProps.data.token_mint"
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
