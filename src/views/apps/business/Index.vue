<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import type { UserProperties } from '@/@fake-db/types'
import { paginationMeta } from '@/@fake-db/utils'
import BussinessApi, { type GetBusinessParams } from '@/Api/Business/Business'
import { GetActions } from '@/Common/enum/Action'
import { getActivesBool } from '@/Common/enum/ActiveBool'
import { getItemsPerPageOptions } from '@/Data/ReusableSelect'
import type { BusinessResDTO } from '@/models/Admin/BusinessDTO'
import AddNewUserDrawer from '@/views/apps/user/list/AddNewUserDrawer.vue'
import { useUserListStore } from '@/views/apps/user/useUserListStore'
import type { Options } from '@core/types'

// 👉 Store
const userListStore = useUserListStore()
const totalUsers = ref(0)

const options = ref<Options>({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
})

const headers = [
  { title: 'Business', key: 'business' },
  { title: 'Action', key: 'action' },
  { title: 'Description', key: 'description' },
  { title: 'Active', key: 'active' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// 👉 Fetching users

const route = useRoute()
const router = useRouter()

const getBusinessParams = ref<GetBusinessParams>({
  itemsPerPage: Number(route.query.pageSize) || 1,
  page: Number(route.query.page) || 1,
})

const data = ref<BusinessResDTO[]>()

const loadData = () => {
  BussinessApi.GetAll(getBusinessParams.value)
    .then(res => {
      data.value = res.data
      console.log(data.value)

      getBusinessParams.value = { ...getBusinessParams.value, ...res.pagination }
    })
    .catch(err => {
      console.log('err', err)
    })
}

onMounted(() => {
  loadData()
})

const isAddNewUserDrawerVisible = ref(false)

// 👉 Add new user
const addNewUser = (userData: UserProperties) => {
  userListStore.addUser(userData)

  // refetch User
}

// 👉 Delete user
const deleteUser = (id: number) => {
  userListStore.deleteUser(id)

  // refetch User
}

watch(
  () => [getBusinessParams.value.keywords],
  ([keywords], [oldSearch]) => {
    // Kiểm tra nếu giá trị đã thay đổi
    if (keywords !== oldSearch)
      loadData()
  },
  { deep: true },
)
watch(
  () => [getBusinessParams.value.page, getBusinessParams.value.itemsPerPage],
  ([page, itemsPerPage], [oldPage, oldItemsPerPage]) => {
    // Kiểm tra nếu giá trị đã thay đổi
    if (page !== oldPage || itemsPerPage !== oldItemsPerPage) {
      router.replace({ // Dùng replace để không tạo lịch sử mới
        query: {
          ...route.query,
          page,
          pageSize: itemsPerPage,
        },
      })

      loadData()
    }
  },
  { deep: true },
)
</script>

<template>
  <section>
    <VCard>
      <VCardText class="d-flex flex-wrap gap-4">
        <AppSelect
          :model-value="getBusinessParams.itemsPerPage"
          :items="getItemsPerPageOptions()"
          style="width: 5rem;"
          @update:model-value="getBusinessParams.itemsPerPage = parseInt($event, 10)"
        />

        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <AppTextField
            v-model="getBusinessParams.keywords"
            placeholder="Search "
            density="compact"
            style="width: 18.5rem;"
          />
        </div>
      </VCardText>

      <VDivider />

      <!-- SECTION datatable -->
      <VDataTableServer
        v-model:items-per-page="getBusinessParams.itemsPerPage"
        v-model:page="getBusinessParams.page"
        :items="data"
        :items-length="totalUsers"
        :headers="headers"
        class="text-no-wrap"
        @update:options="options = $event"
      >
        <!-- Business -->
        <template #item.business="{ item }">
          <div class="d-flex align-center">
            <VAvatar
              size="38"
              :variant="!item.raw.avartar ? 'tonal' : undefined"
              class="me-3"
            >
              <VImg :src="item.raw.avartar ?? 'https://res.cloudinary.com/dnitjp0ng/image/upload/v1744476928/QLTB/default/DefaultUserList.jpg'" />
            </VAvatar>
            <div class="d-flex flex-column">
              <h6 class="text-body-1 font-weight-medium">
                <RouterLink
                  :to="{ name: 'apps-user-view-id', params: { id: item.raw.id } }"
                  class="user-list-name"
                >
                  {{ item.raw.name }}
                </RouterLink>
              </h6>
              <span class="text-sm text-disabled">{{ item.raw.userDetailRes.account }}</span>
            </div>
          </div>
        </template>
        <!-- Action -->
        <template #item.action="{ item }">
          <VChip
            label
            size="small"
            class="text-capitalize"
            :color="GetActions(item.raw.action).color"
          >
            {{ GetActions(item.raw.action).text }}
          </VChip>
        </template>

        <template #item.description="{ item }">
          <span class="truncate-description">
            {{ item.raw.description }}
          </span>
        </template>

        <template #item.active="{ item }">
          <span class="truncate-description">
            <VChip
              :color="getActivesBool(item.raw.active).color"
              size="small"
              label
              class="text-capitalize"
            >
              {{ getActivesBool(item.raw.active).text }}
            </VChip>
          </span>
        </template>

        <template #bottom>
          <VDivider />

          <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
            <p class="text-sm text-disabled mb-0">
              {{ paginationMeta(options, totalUsers) }}
            </p>

            <ReusablePagination
              v-model="getBusinessParams.page"
              :length="Number(getBusinessParams.totalPages)"
            />
          </div>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn>
            <VIcon icon="tabler-edit" />
          </IconBtn>
          <IconBtn @click="deleteUser(item.raw.id)">
            <VIcon icon="tabler-trash" />
          </IconBtn>

          <VBtn
            icon
            color="medium-emphasis"
            density="comfortable"
            variant="text"
          >
            <VIcon
              size="24"
              icon="tabler-dots-vertical"
            />

            <VMenu activator="parent">
              <VList>
                <VListItem :to="{ name: 'apps-user-view-id', params: { id: item.raw.id } }">
                  <VListItemTitle>View</VListItemTitle>
                </VListItem>
                <VListItem link>
                  <VListItemTitle>Suspend</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </VBtn>
        </template>
      </VDataTableServer>
      <!-- SECTION -->
    </VCard>

    <!-- 👉 Add New User -->
    <AddNewUserDrawer
      v-model:isDrawerOpen="isAddNewUserDrawerVisible"
      @user-data="addNewUser"
    />
  </section>
</template>

<style lang="scss">
.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
}

.truncate-description {
  display: inline-block;
  overflow: hidden;
  max-inline-size: 250px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
