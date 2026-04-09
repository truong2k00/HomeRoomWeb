<script setup lang="ts">
import { useGlobalLoader } from "@/plugins/utils/useGlobalLoader";

const { isDialogVisible } = useGlobalLoader();
</script>
<template>
  <div @click="isDialogVisible = !isDialogVisible" v-if="isDialogVisible" class="global-loader">
    <VProgressCircular :size="60" color="primary" indeterminate />
  </div>
</template>

<style scoped>
.global-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: transparent;
  /* 👈 không nền */
  z-index: 9999;
}
</style>
