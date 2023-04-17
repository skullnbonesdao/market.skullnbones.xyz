<template>
  <div>
    <ToggleButton
      @click="darkThemeSwitch"
      v-model="is_dark"
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

const is_dark = ref(false);

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
    _addDarkTheme();
    is_dark.value = false;
  } else {
    _removeDarkTheme();
    is_dark.value = true;
  }
}
</script>

<style scoped></style>
