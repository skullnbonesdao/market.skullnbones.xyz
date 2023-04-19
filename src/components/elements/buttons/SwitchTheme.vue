<template>
  <div>
    <ToggleButton
      @click="darkThemeSwitch"
      v-model="dark_active"
      onLabel=""
      offLabel=""
      onIcon="pi pi-sun"
      offIcon="pi pi-moon"
      class="w-9rem"
    />
  </div>
</template>

<script setup>
import ToggleButton from "primevue/togglebutton";
import { ref } from "vue";
import { useGlobalStore } from "@/src/stores/GlobalStore";

const dark_active = ref(useGlobalStore().is_dark);

if (useGlobalStore().is_dark) {
  darkThemeSwitch();
}

function _addDarkTheme() {
  let darkThemeLinkEl = document.createElement("link");
  darkThemeLinkEl.setAttribute("rel", "stylesheet");
  darkThemeLinkEl.setAttribute("href", "/css/theme_dark.css");
  darkThemeLinkEl.setAttribute("id", "dark-theme-style");

  let docHead = document.querySelector("head");
  docHead.append(darkThemeLinkEl);
}

function _removeDarkTheme() {
  let darkThemeLinkEl = document.querySelector("#dark-theme-style");
  let parentNode = darkThemeLinkEl.parentNode;
  parentNode.removeChild(darkThemeLinkEl);
}

function darkThemeSwitch() {
  let darkThemeLinkEl = document.querySelector("#dark-theme-style");
  if (!darkThemeLinkEl) {
    useGlobalStore().is_dark = true;
    _addDarkTheme();
  } else {
    useGlobalStore().is_dark = false;
    _removeDarkTheme();
  }
}
</script>

<style scoped></style>
