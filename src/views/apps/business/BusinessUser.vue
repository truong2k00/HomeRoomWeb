<script setup lang="ts">
import { RoleUserDTO } from "@/models/Role&UserAbility/RoleDTO";
const itemnull = import.meta.env.VITE_DEFAULT_AVATAR;
interface props {
  userlist: RoleUserDTO[];
}
const props = defineProps<props>();
</script>

<template>
  <div class="v-avatar-group">
    <!-- Hiển thị tối đa 5 avatar -->
    <VAvatar
      v-for="item in props.userlist.slice(0, 5)"
      :key="item.idUser"
      :size="42"
    >
      <VImg :src="item.avatar ?? itemnull" />
      <VTooltip activator="parent" location="top">
        {{ item.name }}
      </VTooltip>
    </VAvatar>

    <!-- Avatar "..." nếu danh sách dài hơn 5 -->
    <VAvatar v-if="props.userlist.length > 5" color="secondary" size="large">
      <VTooltip activator="parent" location="top"> Select All </VTooltip>
      <span class="text-lg">...</span>
    </VAvatar>
  </div>
</template>
