<script setup lang="ts">
import BusinessList from '@/views/Admin/Business/Index.vue'
</script>

<template>
  <BusinessList />
</template>

<route lang="yaml">
meta:
  action: read
  subject: Auth
</route>
