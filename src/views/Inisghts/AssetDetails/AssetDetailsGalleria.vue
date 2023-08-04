<script lang="ts" setup>
import { useInsightsStore } from "../../../stores/InsightsStore";
import { computed, ref } from "vue";
import Galleria from "primevue/galleria";

interface GalleryImage {
  itemImageSrc: string;
  thumbnailImageSrc: string;
  alt: string;
  title: string;
}

const images = computed(() => {
  let images: GalleryImage[] | undefined = [];

  images?.push({
    title: useInsightsStore().selected?.name ?? "main-image",
    alt: useInsightsStore().selected?.image ?? "",
    itemImageSrc: useInsightsStore().selected?.image ?? "",
    thumbnailImageSrc: useInsightsStore().selected?.image ?? "",
  } as GalleryImage);

  useInsightsStore()?.selected?.media?.gallery?.forEach((image, idx) => {
    images?.push({
      title: idx.toString(),
      alt: image,
      itemImageSrc: image,
      thumbnailImageSrc: image,
    } as GalleryImage);
  });

  return images;
});

const responsiveOptions = ref([
  {
    breakpoint: "991px",
    numVisible: 4,
  },
  {
    breakpoint: "767px",
    numVisible: 3,
  },
  {
    breakpoint: "575px",
    numVisible: 1,
  },
]);
</script>

<template>
  <Galleria
    :numVisible="5"
    :responsiveOptions="responsiveOptions"
    :value="images as any[]"
    style="height: 500px"
  >
    <template #item="slotProps">
      <img
        :alt="slotProps.item.alt"
        :src="slotProps.item.itemImageSrc"
        style="width: 100%"
      />
    </template>
    <template #thumbnail="slotProps">
      <img :alt="slotProps.item.alt" :src="slotProps.item.thumbnailImageSrc" />
    </template>
  </Galleria>
</template>

<style scoped></style>