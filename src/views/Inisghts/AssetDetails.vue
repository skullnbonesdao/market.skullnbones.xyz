<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { Metaplex } from "@metaplex-foundation/js";
import { Connection } from "@solana/web3.js";
import { useGlobalStore } from "../../stores/GlobalStore";

const data = ref();

onMounted(async () => {
  const metaplex = Metaplex.make(new Connection(useGlobalStore().rpc.url));
  // const d = await metaplex.tokens().findMintByAddress({
  //   address: new PublicKey(useInsightsStore().selected?.mint ?? ""),
  // });
});
</script>

<template>
  <!--  <div class="flex flex-col p-card" v-if="useInsightsStore().selected">-->
  <!--    <div id="header" class="flex flex-row">-->
  <!--      <Image-->
  <!--        :src="'webp/' + useInsightsStore().selected?.mint + '.webp'"-->
  <!--        alt="Image"-->
  <!--        width="250"-->
  <!--      />-->
  <!--      <div class="flex flex-col m-2 space-y-3">-->
  <!--        <p class="text-6xl">{{ useInsightsStore().selected?.name }}</p>-->
  <!--        <p>{{ useInsightsStore().selected?.description }}</p>-->
  <!--        <ExplorerIcon-->
  <!--          class="w-12"-->
  <!--          :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.SOLSCAN)"-->
  <!--          :address="useInsightsStore().selected?.mint"-->
  <!--        />-->
  <!--        <ExplorerIcon-->
  <!--          class="w-12"-->
  <!--          :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.SOLANAFM)"-->
  <!--          :address="useInsightsStore().selected?.mint"-->
  <!--        />-->
  <!--        <ExplorerIcon-->
  <!--          class="w-12"-->
  <!--          :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.STARATLAS)"-->
  <!--          :address="useInsightsStore().selected?.mint"-->
  <!--        />-->
  <!--      </div>-->
  <!--    </div>-->

  <!--    <div id="content" class="p-2 space-y-10">-->
  <!--      <div class="p-2 border">-->
  <!--        <p class="text-4xl text-center underline underline-offset-1 pb-2">-->
  <!--          Attributes-->
  <!--        </p>-->
  <!--        <div-->
  <!--          class="grid grid-cols-2 gap-2"-->
  <!--          v-for="key in Object.keys(useInsightsStore().selected?.attributes)"-->
  <!--        >-->
  <!--          <div class="p-card p-2 mb-2 text-center">{{ key.toUpperCase() }}</div>-->
  <!--          <div class="p-card p-2 mb-2 text-center">-->
  <!--            {{ useInsightsStore().selected?.attributes[key].toUpperCase() }}-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </div>-->

  <!--      <div class="p-2 border">-->
  <!--        <p class="text-4xl text-center underline underline-offset-1 pb-2">-->
  <!--          Collection-->
  <!--        </p>-->
  <!--        <div-->
  <!--          class="grid grid-cols-2 gap-2"-->
  <!--          v-for="key in Object.keys(useInsightsStore().selected?.collection)"-->
  <!--        >-->
  <!--          <div class="p-card p-2 mb-2">{{ key }}</div>-->
  <!--          <div class="p-card p-2 mb-2">-->
  <!--            {{ useInsightsStore().selected?.collection?.[key] }}-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--      <div class="p-2 border">-->
  <!--        <p class="text-4xl text-center underline underline-offset-1 pb-2">-->
  <!--          Slots-->
  <!--        </p>-->
  <!--        <div-->
  <!--          class="grid grid-cols-2 gap-2"-->
  <!--          v-for="key in Object.keys(useInsightsStore().selected?.slots)"-->
  <!--        >-->
  <!--          <div class="p-card p-2 mb-2">{{ key }}</div>-->
  <!--          &lt;!&ndash;          <div class="p-card p-2 mb-2">&ndash;&gt;-->
  <!--          &lt;!&ndash;            {{ useInsightsStore().selected?.slots?.[key].toString() ?? "none" }}&ndash;&gt;-->
  <!--          &lt;!&ndash;          </div>&ndash;&gt;-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->

  <!--    <div id="footer">-->
  <!--      {{ useInsightsStore().selected }}-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<style scoped></style>