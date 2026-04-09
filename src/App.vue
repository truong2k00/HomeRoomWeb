<script setup lang="ts">
import { useTheme } from "vuetify";
import ScrollToTop from "@core/components/ScrollToTop.vue";
import { useThemeConfig } from "@core/composable/useThemeConfig";
import { hexToRgb } from "@layouts/utils";

const {
  syncInitialLoaderTheme,
  syncVuetifyThemeWithTheme: syncConfigThemeWithVuetifyTheme,
  isAppRtl,
  handleSkinChanges,
} = useThemeConfig();

const { global } = useTheme();

// onMounted(() => {
//   let idsocketChecked = false

//   const interval = setInterval(() => {
//     const idsocket = Cookies.get('idsocket')

//     if (idsocket && !idsocketChecked) {
//       console.log('🎯 idsocket được set từ backend:', idsocket)

//       // 🛑 Đánh dấu đã log để không log lặp lại
//       idsocketChecked = true

//       // 🧹 Dừng kiểm tra sau khi đã thấy idsocket
//       clearInterval(interval)

//       // 👉 Bạn có thể mở WebSocket tại đây luôn nếu cần
//       // connectWebSocket(idsocket)
//     }
//     console.log(idsocket);

//   }, 500) // Kiểm tra mỗi 0.5 giây
// })
// ℹ️ Sync current theme with initial loader theme

const mobileBreakpoint = 768;

const updateLayoutNav = () => {
  const isMobile = window.innerWidth < mobileBreakpoint;
  if (isMobile) {
    localStorage.setItem("LayoutNav", "vertical");
  } else if (localStorage.getItem("LayoutNav")) {
    localStorage.setItem(
      "LayoutNav",
      localStorage.getItem("LayoutNav") !== "horizontal"
        ? "vertical"
        : "horizontal"
    );
  }
};

onMounted(() => {
  updateLayoutNav();
  window.addEventListener("resize", updateLayoutNav);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateLayoutNav);
});

syncInitialLoaderTheme();
syncConfigThemeWithVuetifyTheme();
handleSkinChanges();
</script>

<template>
  <VLocaleProvider :rtl="isAppRtl">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(
      global.current.value.colors.primary
    )}`">
      <RouterView />
      <ScrollToTop />
      <AppSnackbar />
      <GlobalLoader />
      <AppSnackbarMuti />
    </VApp>
  </VLocaleProvider>
</template>

<style>
.custom-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
}

.truncate-description {
  display: inline-block;
  overflow: hidden;
  max-inline-size: 250px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
