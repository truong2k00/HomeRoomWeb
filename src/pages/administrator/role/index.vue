<!--
  <script setup lang="ts">
  import apiRole from "@/Api/authen/roleAuthenticationApi"
  import { RoleResDTO } from "@/models/Role&UserAbility/RoleDTO"

  const dataRole = ref<RoleResDTO[]>([])
  const loadRole = () => {
  apiRole.getRole()
  .then((res) => {
  dataRole.value = res
  })
  .catch((err) => { })
  }
  onMounted(() => {
  loadRole()
  })
  </script>

  <template>
  {{ dataRole }}
  role
  </template>
-->
<script setup lang="ts">
import RoleCards from "@/views/Administrator/Role/RoleCard.vue";
import UserList from "@/views/Administrator/Role/UserList.vue";
</script>

<template>
  <VRow>
    <VCol cols="12">
      <h4 class="text-h4 mb-6">Roles List</h4>
      <p class="mb-0">
        A role provided access to predefined menus and features so that
        depending on assigned role an administrator can have access to what he
        need
      </p>
    </VCol>

    <!-- 👉 Roles Cards -->
    <VCol cols="12">
      <RoleCards />
    </VCol>

    <VCol cols="12">
      <!-- 👉 User List  -->
      <UserList />
    </VCol>
  </VRow>
</template>

<route lang="yaml">
meta:
  action: read
  subject: Auth
</route>
