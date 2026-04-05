<script lang="ts" setup>
import { i18nCompLanguages } from "@/plugins/i18n/data";
import NavBarI18n from "@core/components/I18n.vue";
import { useThemeConfig } from "@core/composable/useThemeConfig";

const { isAppRtl } = useThemeConfig();
const rtlLangs = [
  "ar",
  "fa",
  "he",
  "ur",
  "ku",
  "af",
  "ckb",
  "sd",
  "ug",
  "yi",
  "ps",
];

const handleLangChange = (lang: string) => {
  isAppRtl.value = rtlLangs.includes(lang);
};

// const handleLangChange = (lang: string) => {
//   isAppRtl.value = lang === "ar";
//   isAppRtl.value = lang === "fa";
//   isAppRtl.value = lang === "he";
//   isAppRtl.value = lang === "ur";
//   isAppRtl.value = lang === "ku";
//   isAppRtl.value = lang === "af";
//   isAppRtl.value = lang === "ckb";
//   isAppRtl.value = lang === "sd";
//   isAppRtl.value = lang === "ug";
//   isAppRtl.value = lang === "yi";
//   isAppRtl.value = lang === "ps";
// };
</script>

<template>
  <NavBarI18n :languages="i18nCompLanguages" @change="handleLangChange" />
</template>
