<script setup lang="ts">
import { useSnackbarStore } from "@/plugins/utils/snackbar";
const snackbar = useSnackbarStore();
</script>

<template>
  <div class="snackbar-stack">
    <VSnackbar v-for="(item, index) in snackbar.active" :key="item.id" :model-value="true" :color="item.color"
      location="bottom end" variant="flat" class="snackbar-item" :style="{ marginBottom: `${index * 60}px` }">
      {{ item.message }}
    </VSnackbar>
  </div>
</template>

<style scoped>
.snackbar-stack {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 2000;
  display: flex;
  flex-direction: column-reverse;
  /* cái mới nằm dưới cùng */
  gap: 10px;
}

.snackbar-item {
  min-width: 250px;
}
</style>
