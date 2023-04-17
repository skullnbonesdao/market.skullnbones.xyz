<script setup lang="ts">
import { PropType } from "vue";
import { I_CURRENCY } from "../../static/currencies";

const props = defineProps({
  currency: {
    type: Object as PropType<I_CURRENCY>,
  },
});
</script>

<template>
  <img class="rounded-md" :src="props.currency?.image_path" alt="asset_image" />
</template>
