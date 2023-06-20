<script setup lang="ts">
import { Connection, PublicKey } from "@solana/web3.js";
import { useGlobalStore } from "../stores/GlobalStore";
import { FindNftsByOwnerOutput, Metaplex } from "@metaplex-foundation/js";

import { onMounted, ref, watchEffect } from "vue";

const connection = new Connection(useGlobalStore().rpc.url);
const mx = new Metaplex(connection);

const assets = ref<FindNftsByOwnerOutput>();
const mints = ref();
const meta = ref<any[]>();

const details = ref();

onMounted(async () => {
  let wallet_nfts = await mx.nfts().findAllByOwner({
    owner: new PublicKey("38s5kQmKd4qSQKQcfLabSqbrxEbuhryUgQMEfb5TCwMt"),
  });

  assets.value = wallet_nfts;

  mints.value = wallet_nfts.map((asset: any) => {
    return asset.mintAddress;
  });

  // for (const asset of wallet_nfts as Metadata[]) {
  //   details.value.push(
  //     await mx.nfts().load({
  //       metadata: asset,
  //     })
  //   );
  // }

  // let token_metada: any[] = [];
  // for (const mint of token_mints) {
  //   token_metada.push(await mx.nfts().findByMint({ mintAddress: mint }));
  // }
  // meta.value = token_metada;
});
watchEffect(async () => {
  if (!assets.value) {
    return;
  }

  details.value = await Promise.all(
    assets.value.map((metadata) =>
      metadata.model === "metadata" ? mx.nfts().load({ metadata }) : "err"
    )
  );
});
</script>

<template>
  <div v-for="asset in details">
    {{ asset }}
  </div>
</template>
