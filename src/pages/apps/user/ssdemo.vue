<script setup lang="ts">
import { ref } from 'vue'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import type { Pagination } from '@/Api/PaginatedResponse'
import UserApi, { type GetUserParams } from '@/Api/user/User'
import type { UserDTO } from '@/models/UserResDTO'

const users = ref<UserDTO[]>([])
const loadings = ref(false)
const pagination = ref<Pagination>({ itemsPerPage: 10, page: 1, totalItems: 0 })

const filters = ref<GetUserParams>({
  itemsPerPage: 10,
  page: 1,
  totalItems: 0,
})

const headers = [
  { title: 'Username', key: 'userName' },
  { title: 'Email', key: 'email' },
  { title: 'Phone', key: 'phoneNumber' },
  { title: 'Role', key: 'role' },
]

const isAddNewUserDrawerVisible = ref(false)

const addNewUser = () => {
  console.log('sds')
}

const updateItemsPerPage = value => {
  if (filters.value)
    filters.value.itemsPerPage = parseInt(value, 10)
}

const loadData = () => {
  loadings.value = true
  console.log(filters.value)

  UserApi.GetAllAccount(filters.value)
    .then(res => {
      console.log('API Response:', res)
      users.value = res.data
      pagination.value = res.pagination
      loadings.value = false
    })
    .catch(() => {
      loadings.value = false
    })
}

// 👉 List
const userListMeta = [
  {
    icon: 'tabler-user',
    color: 'primary',
    title: 'Session',
    stats: '21,459',
    percentage: +29,
    subtitle: 'Total Users',
  },
  {
    icon: 'tabler-user-plus',
    color: 'error',
    title: 'Paid Users',
    stats: '4,567',
    percentage: +18,
    subtitle: 'Last week analytics',
  },
  {
    icon: 'tabler-user-check',
    color: 'success',
    title: 'Active Users',
    stats: '19,860',
    percentage: -14,
    subtitle: 'Last week analytics',
  },
  {
    icon: 'tabler-user-exclamation',
    color: 'warning',
    title: 'Pending Users',
    stats: '237',
    percentage: +42,
    subtitle: 'Last week analytics',
  },
]

watchEffect(loadData)
</script>

<template>
  <VOverlay
    v-model="loadings"
    class="custom-overlay"
  >
    <VProgressCircular
      indeterminate
      size="64"
      color="primary"
    />
  </VOverlay>
  <section>
    <VRow>
      <VCol
        v-for="meta in userListMeta"
        :key="meta.title"
        cols="12"
        sm="6"
        lg="3"
      >
        <VCard>
          <VCardText class="d-flex justify-space-between">
            <div>
              <span>{{ meta.title }}</span>
              <div class="d-flex align-center gap-2 my-1">
                <h6 class="text-h4">
                  {{ meta.stats }}
                </h6>
                <span :class="meta.percentage > 0 ? 'text-success' : 'text-error'">( {{ meta.percentage > 0 ? '+' : ''
                }} {{ meta.percentage }}%)</span>
              </div>
              <span>{{ meta.subtitle }}</span>
            </div>

            <VAvatar
              rounded
              variant="tonal"
              :color="meta.color"
              :icon="meta.icon"
            />
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12">
        <VCard title="Search Filter">
          <VCardText>
            <VRow>
              <!-- 👉 Select Role -->
              <VCol
                cols="12"
                sm="4"
              >
                <AppSelect
                  v-model="selectedRole"
                  label="Select Role"
                  :items="roles"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol>
              <!-- 👉 Select Plan -->
              <VCol
                cols="12"
                sm="4"
              >
                <AppSelect
                  v-model="selectedPlan"
                  label="Select Plan"
                  :items="plans"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol>
              <!-- 👉 Select Status -->
              <VCol
                cols="12"
                sm="4"
              >
                <AppSelect
                  v-model="selectedStatus"
                  label="Select Status"
                  :items="status"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VDivider />

          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <div class="me-3 d-flex gap-3">
              <AppSelect
                :model-value="filters?.itemsPerPage"
                :items="[
                  { value: 10, title: '10' },
                  { value: 25, title: '25' },
                  { value: 50, title: '50' },
                  { value: 100, title: '100' },
                  { value: -1, title: 'All' },
                ]"
                style="width: 6.25rem;"
                @update:model-value="updateItemsPerPage"
              />
            </div>
          </VCardText>

          <VDivider />
          <VDataTableServer
            v-model:items-per-page="pagination.itemsPerPage"
            :headers="headers"
            :items="users"
            :server-items-length="pagination.totalItems || 0"
            :loading="loadings"
            @update:options="loadData"
          />
        </VCard>
        <!-- 👉 Add New User -->
        <AddNewUserDrawer
          v-model:isDrawerOpen="isAddNewUserDrawerVisible"
          @user-data="addNewUser"
        />
      </vcol>
    </vrow>
  </section>
</template>
