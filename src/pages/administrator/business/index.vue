<script setup lang="ts">
import BusinessList from "@/views/Admin/Business/Index.vue";
import Card from "@/views/apps/business/Card.vue";
</script>

<template>
  <Card />
</template>

<route lang="yaml">
meta:
  action: read
  subject: Auth
</route>
