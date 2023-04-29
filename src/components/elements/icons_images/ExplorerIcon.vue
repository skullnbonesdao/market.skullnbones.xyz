<script setup lang="ts">
import { PropType } from "vue";
import { E_EXPLORER, EXPLORER, I_EXPLORER } from "../../../static/explorer";

const props = defineProps({
  explorer: Object as PropType<I_EXPLORER>,
  signature: String,
  address: String,
});
</script>

<template>
  <div class="hover:animate-spin" v-tooltip.bottom="'Open: ' + explorer?.name">
    <div
      v-if="explorer?.type === E_EXPLORER.STARATLAS"
      class="border-1 border-black rounded-full"
    >
      <a
        target="_blank"
        rel="noopener noreferrer"
        :href="
          EXPLORER.find((e) => e.type === explorer?.type)?.url +
          '/market/' +
          props.address
        "
      >
        <img
          style="width: 24px"
          class="rounded-md"
          :src="props.explorer?.image_path"
          alt="explorer_image"
        />
      </a>
    </div>
    <div v-else-if="signature">
      <a
        target="_blank"
        rel="noopener noreferrer"
        :href="
          EXPLORER.find((e) => e.type === explorer?.type)?.url +
          '/tx/' +
          props.signature
        "
      >
        <img
          style="width: 24px"
          class="rounded-md"
          :src="props.explorer?.image_path"
          alt="explorer_image"
        />
      </a>
    </div>
    <div v-else>
      <a
        target="_blank"
        rel="noopener noreferrer"
        :href="
          EXPLORER.find((e) => e.type === explorer?.type)?.url +
          '/address/' +
          props.address
        "
      >
        <img
          style="width: 24px"
          class="rounded-md"
          :src="props.explorer?.image_path"
          alt="explorer_image"
        />
      </a>
    </div>
  </div>
</template>
