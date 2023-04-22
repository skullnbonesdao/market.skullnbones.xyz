<script setup lang="ts">
import { PropType } from "vue";
import { EXPLORER, I_EXPLORER } from "../../../static/explorer";

const props = defineProps({
  explorer: Object as PropType<I_EXPLORER>,
  signature: String,
  address: String,
});
</script>

<template>
  <div v-if="signature">
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
  <div v-if="address">
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
</template>
