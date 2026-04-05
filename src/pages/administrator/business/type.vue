<script setup lang="ts">
import BusinessList from "@/views/Admin/Business/Index.vue";
import TypeCard from "@/views/Admin/Business/TypeCard.vue";

onMounted(() => {});
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12">
        <h4 class="text-h4 mb-6">Type List</h4>
        <p class="mb-0">
          Type provides access to predefined menus and features so that
          depending on the assigned purpose, the administrator can access what
          they need.
        </p>
      </VCol>

      <!-- 👉 Roles Cards -->
      <VCol cols="12">
        <TypeCard />
      </VCol>

      <VCol cols="12">
        <!-- 👉 User List  -->
        <BusinessList />
      </VCol>
    </VRow>
  </div>
</template>
