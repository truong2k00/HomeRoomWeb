<script setup lang="ts">
import apiRole from '@/Api/authen/roleAuthenticationApi'
import type { RoleResDTO } from '@/models/Role&UserAbility/RoleDTO'

const dataRole = ref<RoleResDTO[]>([])

const loadRole = () => {
  apiRole.getRole()
    .then(res => {
      dataRole.value = res
    })
    .catch(err => { })
}

onMounted(() => {
  loadRole()
})
</script>

<template>
  {{ dataRole }}
  role
</template>

<route lang="yaml">
meta:
  action: read
  subject: Auth
</route>
