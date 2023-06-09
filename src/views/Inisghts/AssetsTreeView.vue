<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Tree from "primevue/tree";
import { ItemType } from "../../static/StarAtlasAPIItem";
import { useGlobalStore } from "../../stores/GlobalStore";
import { useInsightsStore } from "../../stores/InsightsStore";

const selectedKey = ref({});

const nodes = computed(() => {
  let parent_nodes: any[] = [];
  Object.keys(ItemType).forEach((item_type, idx) => {
    parent_nodes.push({
      label: item_type.toUpperCase(),
      name: item_type.toString(),
      children: [],
    });
  });

  parent_nodes.forEach((parent, idx) => {
    let matching_childs = useGlobalStore().sa_api_data.filter((asset) => {
      return (
        asset.attributes.itemType.toUpperCase() === parent.name.toUpperCase()
      );
    });
    console.log(matching_childs);
    matching_childs.forEach((asset, idy) => {
      parent_nodes[idx].children.push({
        key: asset.mint,
        label: asset.name.toUpperCase(),
        data: asset.name,
        item: asset,
      });
    });

    //    parent_nodes[idx].children.push()
  });

  return parent_nodes;
});

watch(
  () => selectedKey.value,
  () => {
    useInsightsStore().selected = useGlobalStore().sa_api_data.find(
      (asset) => asset.mint === Object.keys(selectedKey.value)[0]
    );
  }
);
</script>

<template>
  <div class="flex flex-col p-card p-1 space-y-2">
    <Tree :value="nodes" class="w-full md:w-30rem"></Tree>

    <Tree
      v-model:selectionKeys="selectedKey"
      selectionMode="single"
      :value="nodes"
      :filter="true"
      filterMode="lenient"
      class="w-full md:w-30rem"
    ></Tree>
  </div>
</template>

<style scoped></style>
