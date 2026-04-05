<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import profileUser from "@/views/apps/user/view/UserProfile/Profile.vue";

// Lấy id từ URL
const route = useRoute();

const idGet = ref(typeof route.query.id === "string" ? route.query.id : "");
</script>

<template>
  <profileUser :id-user="idGet" />
</template>

<route lang="yaml">
meta:
  action: manage
  subject: all
  navActiveLink: apps-business-view
</route>
