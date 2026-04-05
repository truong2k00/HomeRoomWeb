<script setup lang="ts">
import { useRoute } from 'vue-router'

// Lấy param từ URL
const route = useRoute()
const id = route.params.id
</script>

<template>
  ID from URL: {{ id }}
</template>
