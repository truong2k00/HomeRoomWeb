<script setup lang="ts">
import { snackbarState } from "@/plugins/snackbar";
</script>

<template>
  <VSnackbar v-model="snackbarState.show" :timeout="snackbarState.timeout" :color="snackbarState.color"
    location="bottom right">
    {{ snackbarState.message }}
    <template #actions>
      <VBtn icon variant="text" size="small" @click="snackbarState.show = false">
        <VIcon icon="tabler-x" color="black" size="18" />
      </VBtn>
    </template>
  </VSnackbar>
</template>
