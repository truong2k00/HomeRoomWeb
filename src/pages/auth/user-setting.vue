<script setup lang="ts">
import UserApi from '@/Api/user/User'
import type { UserDetailRes } from '@/models/UserResDTO'
import { useUserListStore } from '@/views/apps/user/useUserListStore'
import UserBioPanel from '@/views/apps/user/views/UserBioPanel.vue'
import UserTabAccount from '@/views/apps/user/views/UserTabAccount.vue'
import UserTabBillingsPlans from '@/views/apps/user/views/UserTabBillingsPlans.vue'
import UserTabConnections from '@/views/apps/user/views/UserTabConnections.vue'
import UserTabNotifications from '@/views/apps/user/views/UserTabNotifications.vue'
import UserTabSecurity from '@/views/apps/user/views/UserTabSecurity.vue'

// 👉 Store
const userListStore = useUserListStore()

const route = useRoute()
const userData = ref()
const userTab = ref(null)
const datatable = ref<UserDetailRes>()

const tabs = [
  { icon: 'tabler-user-check', title: 'Account' },
  { icon: 'tabler-lock', title: 'Security' },
  { icon: 'tabler-currency-dollar', title: 'Billing & Plan' },
  { icon: 'tabler-bell', title: 'Notifications' },
  { icon: 'tabler-link', title: 'Connections' },
]

const loadings = ref(false)

const loadData = () => {
  loadings.value = true
  UserApi.getByUser()
    .then(res => {
      datatable.value = res
      loadings.value = false
    })
    .catch(() => {
      loadings.value = false
    })
}

onMounted(() => {
  loadData()
})

userListStore.fetchUser(21).then(response => {
  userData.value = response.data
})
</script>

<template>
  <VRow v-if="userData">
    <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <UserBioPanel :user-data="userData" />
    </VCol>

    <VCol
      cols="12"
      md="7"
      lg="8"
    >
      <VTabs
        v-model="userTab"
        class="v-tabs-pill"
      >
        <VTab
          v-for="tab in tabs"
          :key="tab.icon"
        >
          <VIcon
            :size="18"
            :icon="tab.icon"
            class="me-1"
          />
          <span>{{ tab.title }}</span>
        </VTab>
      </VTabs>

      <VWindow
        v-model="userTab"
        class="mt-6 disable-tab-transition"
        :touch="false"
      >
        <VWindowItem>
          <UserTabAccount />
        </VWindowItem>

        <VWindowItem>
          <UserTabSecurity />
        </VWindowItem>

        <VWindowItem>
          <UserTabBillingsPlans />
        </VWindowItem>

        <VWindowItem>
          <UserTabNotifications />
        </VWindowItem>

        <VWindowItem>
          <UserTabConnections />
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
</template>
