<script setup lang="ts">
import { useGlobalStore } from "../stores/GlobalStore";
import { Metaplex } from "@metaplex-foundation/js";

import { onMounted, ref } from "vue";
import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection(useGlobalStore().rpc.url);
const mx = Metaplex.make(connection);

const assets = ref();
const mints = ref();
const meta = ref<any[]>();

const details = ref();

onMounted(async () => {
  let wallet_nfts = await mx
    .nfts()
    .findAllByOwner(
      new PublicKey("38s5kQmKd4qSQKQcfLabSqbrxEbuhryUgQMEfb5TCwMt")
    )
    .run();

  assets.value = wallet_nfts;

  details.value = await Promise.all(
    assets.value.map((metadata: any) => mx.nfts().loadMetadata(metadata).run())
  );
  //
  // mints.value = wallet_nfts.map((asset: any) => {
  //   return asset.mintAddress;
  // });

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
// watchEffect(async () => {
//   if (!assets.value) {
//     return;
//   }
//
//   details.value = await Promise.all(
//     assets.value.map((metadata: any) => mx.nfts().loadMetadata(metadata))
//   );
// });
</script>

<template>
  <div v-for="asset in details">
    {{ asset?.json?.image }}
  </div>
</template>
