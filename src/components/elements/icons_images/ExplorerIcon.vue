<script setup lang="ts">
import { PropType } from "vue";
import { EXPLORER, I_EXPLORER } from "../../../static/explorer";

const props = defineProps({
  explorer: Object as PropType<I_EXPLORER>,
  signature: String,
});
</script>

<template>
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
      class="rounded-md"
      :src="props.explorer?.image_path"
      alt="explorer_image"
    />
  </a>
</template>
