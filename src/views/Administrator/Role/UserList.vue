<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { VDataTableServer } from "vuetify/labs/VDataTable";
import { avatarTextApi } from "@/@core/utils/formatters";

import type { UserProperties } from "@/@fake-db/types";
import apiRole from "@/Api/authen/roleAuthenticationApi";
import UserApi, { type GetUserParams } from "@/Api/user/User";
import { getActives } from "@/Common/enum/Active";
import { colorRoles } from "@/Common/enum/Role";
import { getItemsPerPageOptions } from "@/Data/ReusableSelect";
import type { RoleDTO } from "@/models/Role&UserAbility/RoleDTO";
import type { UserResDTO } from "@/models/UserResDTO";
import AddNewUserDrawer from "@/views/apps/user/list/AddNewUserDrawer.vue";
import { useUserListStore } from "@/views/apps/user/useUserListStore";

const props = defineProps<Props>();
const route = useRoute();
const router = useRouter();
const user = ref<UserResDTO[]>([]);
const loadings = ref(false);

interface Props {
  roleId?: string;
}

const filters = ref<GetUserParams>({
  itemsPerPage: 10, // Lấy pageSize từ query, mặc định 2
  page: 1, // Lấy page từ query, mặc định 1
  totalItems: 0,
  role: [],
  active: 0,
  keywords: "",
});

const roleId = ref();

watch(
  roleId,
  (newVal) => {
    // Xóa tất cả phần tử cũ
    filters.value.role = [];

    filters.value.role.push(newVal);
  },
  { deep: true }
);

if (props.roleId && props.roleId.trim() !== "")
  filters.value.role.push(props.roleId);

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
const dataRole = ref<RoleDTO[]>([]);

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

const loadRole = () => {
  loadings.value = true;
  apiRole
    .get()
    .then((res) => {
      dataRole.value = res;
    })
    .catch((err) => {});
};

onMounted(() => {
  loadData();
  loadRole();
});

const isAddNewUserDrawerVisible = ref(false);

// 👉 Add new user
const addNewUser = (userData: UserProperties) => {
  userListStore.addUser(userData);

  // refetch User
};

watch(
  () => filters.value.keywords || filters.value.active || filters.value.role,
  () => {
    console.log(filters.value.role);

    loadData();
  }
);

// watch(
//   () => [filters.value.page, filters.value.itemsPerPage],
//   ([page, itemsPerPage], [oldPage, oldItemsPerPage]) => {
//     // Kiểm tra nếu giá trị đã thay đổi
//     if (page !== oldPage || itemsPerPage !== oldItemsPerPage) {
//       router.replace({
//         // Dùng replace để không tạo lịch sử mới
//         query: {
//           ...route.query,
//           page,
//           pageSize: itemsPerPage,
//         },
//       });

//       loadData();
//     }
//   },
//   { deep: true }
// );

watch(
  () => filters.value.page,
  (newVal) => {
    loadData();
  },
  { immediate: true } // optional: run on first load
);
watch(
  () => filters.value.itemsPerPage,
  (newVal) => {
    loadData();
  },
  { immediate: true } // optional: run on first load
);

// 👉 Delete user
const deleteUser = (id: number) => {
  userListStore.deleteUser(id);
};
</script>

<template>
  <section>
    <VCard>
      <VCardText class="d-flex flex-wrap gap-4">
        <div class="me-3 d-flex gap-3">
          <AppSelect
            :model-value="filters.itemsPerPage"
            :items="getItemsPerPageOptions()"
            style="width: 6.25rem"
            @update:model-value="filters.itemsPerPage = parseInt($event, 10)"
          />
        </div>

        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <AppTextField
            v-model="filters.keywords"
            placeholder="Search User"
            density="compact"
            style="width: 12.5rem"
          />

          <!-- 👉 Add user button -->
          <VSelect
            v-model="roleId"
            label="Select Role"
            :items="dataRole"
            item-title="roleName"
            item-value="id"
            density="compact"
            clear-icon="tabler-x"
            style="width: 10rem"
          />
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
                !item.raw.avatar ? colorRoles(item.raw.role).color : undefined
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
  </section>
</template>

<style lang="scss">
.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
}
</style>
