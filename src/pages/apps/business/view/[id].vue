<script lang="ts" setup>
import { useRoute } from 'vue-router'
import BusinessProfile from '@/views/apps/business/it/Description.vue'
import UserConnections from '@/views/pages/user-profile/connections/index.vue'
import UserProjects from '@/views/pages/user-profile/projects/index.vue'
import UserTeam from '@/views/pages/user-profile/team/index.vue'
import UserProfileHeader from '@/views/pages/user-profile/UserProfileHeader.vue'

const route = useRoute()

const activeTab = ref(route.params.tab)

// tabs
const tabs = [
  { title: 'Profile', icon: 'tabler-user-check', tab: 'profile' },
  { title: 'Team', icon: 'tabler-users', tab: 'teams' },
  { title: 'Projects', icon: 'tabler-layout-grid', tab: 'projects' },
  { title: 'Connections', icon: 'tabler-link', tab: 'connections' },
]
</script>

<template>
  <div>
    <UserProfileHeader class="mb-5" />

    <VTabs v-model="activeTab" class="v-tabs-pill">
      <VTab v-for="item in tabs" :key="item.icon" :value="item.tab"
        :to="{ name: 'apps-business-view-id', params: { tab: item.tab } }">
        <VIcon size="20" start :icon="item.icon" />
        {{ item.title }}
      </VTab>
    </VTabs>

  </div>
</template>

<route lang="yaml">
meta:
  navActiveLink: apps-business-view-id
</route>
