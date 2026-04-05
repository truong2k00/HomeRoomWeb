<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { VDataTableServer } from "vuetify/labs/VDataTable";
import { avatarTextApi } from "@/@core/utils/formatters";
import type { UserProperties } from "@/@fake-db/types";
import UserApi, { type GetUserParams } from "@/Api/user/User";
import { getActiveSelect, getActives } from "@/Common/enum/Active";
import { colorRoles } from "@/Common/enum/Role";
import { getItemsPerPageOptions } from "@/Data/ReusableSelect";
import type { UserResDTO } from "@/models/UserResDTO";
import AddNewUserDrawer from "@/views/apps/user/list/AddNewUserDrawer.vue";
import { useUserListStore } from "@/views/apps/user/useUserListStore";

const route = useRoute();
const router = useRouter();
const user = ref<UserResDTO[]>([]);
const loadings = ref(false);

const filters = ref<GetUserParams>({
  itemsPerPage: Number(route.query.pageSize) || 10, // Lấy pageSize từ query, mặc định 2
  page: Number(route.query.page) || 1, // Lấy page từ query, mặc định 1
  totalItems: 0,
  role: [],
  active: 0,
  keywords: "",
});

const headers = [
  { title: "User", key: "user" },
  { title: "Role", key: "role" },
  { title: "Username", key: "userName" },
  { title: "Email", key: "email" },
  { title: "Status", key: "status" },
  { title: "Phone", key: "phoneNumber" },
  { title: "Actions", key: "actions", sortable: false },
];

// 👉 Store
const userListStore = useUserListStore();

// Headers

// 👉 Fetching users

const loadData = () => {
  loadings.value = true;
  UserApi.GetAllAccount(filters.value)
    .then((res) => {
      user.value = res.data;
      filters.value = { ...filters.value, ...res.pagination };
      loadings.value = false;
    })
    .catch(() => {
      loadings.value = false;
    });
};

onMounted(() => {
  loadData();
});

const status = getActiveSelect();

const isAddNewUserDrawerVisible = ref(false);

// 👉 Add new user
const addNewUser = (userData: UserProperties) => {
  userListStore.addUser(userData);

  // refetch User
};

// 👉 List
const userListMeta = [
  {
    icon: "tabler-user",
    color: "primary",
    title: "Session",
    stats: "21,459",
    percentage: +29,
    subtitle: "Total Users",
  },
  {
    icon: "tabler-user-plus",
    color: "error",
    title: "Paid Users",
    stats: "4,567",
    percentage: +18,
    subtitle: "Last week analytics",
  },
  {
    icon: "tabler-user-check",
    color: "success",
    title: "Active Users",
    stats: "19,860",
    percentage: -14,
    subtitle: "Last week analytics",
  },
  {
    icon: "tabler-user-exclamation",
    color: "warning",
    title: "Pending Users",
    stats: "237",
    percentage: +42,
    subtitle: "Last week analytics",
  },
];

const updateRole = (newRole: string | string[]) => {
  // Đảm bảo luôn lưu `filters.value.role` dưới dạng string[]
  filters.value.role = Array.isArray(newRole) ? newRole : [newRole];
};

watch(
  () => filters.value.keywords || filters.value.active || filters.value.role,
  () => {
    loadData();
  }
);

watch(
  () => [filters.value.page, filters.value.itemsPerPage],
  ([page, itemsPerPage], [oldPage, oldItemsPerPage]) => {
    // Kiểm tra nếu giá trị đã thay đổi
    if (page !== oldPage || itemsPerPage !== oldItemsPerPage) {
      router.replace({
        // Dùng replace để không tạo lịch sử mới
        query: {
          ...route.query,
          page,
          pageSize: itemsPerPage,
        },
      });

      loadData();
    }
  },
  { deep: true }
);

// 👉 Delete user
const deleteUser = (id: number) => {
  userListStore.deleteUser(id);
};
</script>

<template>
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
                <span
                  :class="meta.percentage > 0 ? 'text-success' : 'text-error'"
                  >( {{ meta.percentage > 0 ? "+" : "" }}
                  {{ meta.percentage }}%)</span
                >
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
        <VCard :title="$t(`App.searchFilter`)">
          <!-- 👉 Filters -->
          <VCardText>
            <VRow>
              <!-- 👉 Select Role -->
              <VCol cols="12" sm="6">
                <AppRoleSelect
                  v-model="filters.role"
                  label="Select Role"
                  clear-icon="tabler-x"
                  clearablepassive
                  clearable
                  @update:modelValue="updateRole"
                />
              </VCol>
              <!-- 👉 Select Status -->
              <VCol cols="12" sm="6">
                <AppSelect
                  v-model="filters.active"
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
                :model-value="filters.itemsPerPage"
                :items="getItemsPerPageOptions()"
                style="width: 6.25rem"
                @update:model-value="
                  filters.itemsPerPage = parseInt($event, 10)
                "
              />
            </div>
            <VSpacer />

            <div
              class="app-user-search-filter d-flex align-center flex-wrap gap-4"
            >
              <!-- 👉 Search  -->
              <div style="inline-size: 10rem">
                <AppTextField
                  v-model="filters.keywords"
                  placeholder="Search"
                  density="compact"
                />
              </div>

              <!-- 👉 Export button -->
              <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="tabler-screen-share"
              >
                Export
              </VBtn>

              <!-- 👉 Add user button -->
              <VBtn
                prepend-icon="tabler-plus"
                @click="isAddNewUserDrawerVisible = true"
              >
                Add New User
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <!-- SECTION datatable -->
          <VDataTableServer
            v-model:items-per-page="filters.itemsPerPage"
            :headers="headers"
            :items="user"
            :items-length="filters.totalItems || 0"
            :loading="loadings"
            @update:options="loadData"
          >
            <template #item.user="{ item }">
              <div class="d-flex align-center">
                <VAvatar
                  size="34"
                  :variant="!item.raw.avatar ? 'tonal' : undefined"
                  :color="
                    !item.raw.avatar
                      ? colorRoles(item.raw.role).color
                      : undefined
                  "
                  class="me-3"
                >
                  <VImg :src="avatarTextApi(item.raw.avatar)" />
                </VAvatar>

                <div class="d-flex flex-column">
                  <h6 class="text-base">
                    <RouterLink
                      :to="{
                        name: 'apps-user-view',
                        query: { id: item.raw.id },
                      }"
                      class="font-weight-medium user-list-name"
                    >
                      {{ item.raw.fullName }}
                    </RouterLink>
                  </h6>

                  <span class="text-sm text-medium-emphasis">{{
                    item.raw.email
                  }}</span>
                </div>
              </div>
            </template>
            <template #item.status="{ item }">
              <VChip
                :color="getActives(item.raw.active).color"
                size="small"
                label
                class="text-capitalize"
              >
                {{ String(getActives(item.raw.active).text) }}
              </VChip>
            </template>
            <template #item.role="{ item }">
              <div class="d-flex align-center gap-4">
                <VAvatar
                  :size="30"
                  :color="colorRoles(item.raw.role).color"
                  variant="tonal"
                >
                  <VIcon :size="20" :icon="colorRoles(item.raw.role).icon" />
                </VAvatar>
                <span class="text-capitalize">{{ item.raw.role }}</span>
              </div>
            </template>
            <template #item.actions="{ item }">
              <IconBtn @click="deleteUser(item.raw.userName)">
                <VIcon icon="tabler-trash" />
              </IconBtn>

              <IconBtn>
                <VIcon icon="tabler-edit" />
              </IconBtn>

              <VBtn icon variant="text" size="small" color="medium-emphasis">
                <VIcon size="24" icon="tabler-dots-vertical" />

                <VMenu activator="parent">
                  <VList>
                    <VListItem
                      :to="{
                        name: 'apps-user-view-idGet',
                        params: { idGet: item.raw.id },
                      }"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-eye" />
                      </template>

                      <VListItemTitle>View</VListItemTitle>
                    </VListItem>

                    <VListItem link>
                      <template #prepend>
                        <VIcon icon="tabler-pencil" />
                      </template>
                      <VListItemTitle>Edit</VListItemTitle>
                    </VListItem>

                    <VListItem @click="deleteUser(item.raw.userName)">
                      <template #prepend>
                        <VIcon icon="tabler-trash" />
                      </template>
                      <VListItemTitle>Delete</VListItemTitle>
                    </VListItem>
                  </VList>
                </VMenu>
              </VBtn>
            </template>
            <template #bottom>
              <VDivider />
              <div
                class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3"
              >
                <p class="text-sm text-disabled mb-0">
                  Showing {{ filters.page }} to {{ filters.itemsPerPage }} of
                  {{ filters.totalItems }}
                  entries
                </p>

                <ReusablePagination
                  v-model="filters.page"
                  :length="Number(filters.totalPages)"
                />
              </div>
            </template>
          </VDataTableServer>
          <!-- SECTION -->
        </VCard>

        <!-- 👉 Add New User -->
        <AddNewUserDrawer
          v-model:isDrawerOpen="isAddNewUserDrawerVisible"
          @user-data="addNewUser"
        />
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">
.app-user-search-filter {
  inline-size: 31.6rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
}
</style>
