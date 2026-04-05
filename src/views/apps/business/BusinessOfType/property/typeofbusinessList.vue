<script setup lang="ts">
import { VDataTableServer } from "vuetify/labs/VDataTable";
import type { UserProperties } from "@/@fake-db/types";
import { paginationMetaText } from "@/@fake-db/utils";
import TypeofbusinesApi, { GetALLParams } from "@/Api/Business/TypeOfBusiness";
import { GetActions } from "@/Common/enum/Action";
import { getActivesBool } from "@/Common/enum/ActiveBool";
import type { BusinessResDTO } from "@/models/Admin/BusinessDTO";
import AddNewUserDrawer from "@/views/apps/user/list/AddNewUserDrawer.vue";
import { useUserListStore } from "@/views/apps/user/useUserListStore";
import type { Options } from "@core/types";
import { TypeOfBusinessDTOAllRes } from "@/models/TypeOfBusiness/TypeOfBusinessDTO";
import { CheckConnectType } from "@/Common/enum/TypeOfBusiness";
import { Findby, GetPayCode } from "@/Common/enum/Pay/PayCode";

// 👉 Store
const userListStore = useUserListStore();
const totalUsers = ref(0);

const options = ref<Options>({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
});

const headers = [
  { title: "Business", key: "business" },
  { title: "Action", key: "action" },
  { title: "Type", key: "type" },
  { title: "NameType", key: "nametype" },
  { title: "Description", key: "description" },
  { title: "Active", key: "active" },
  { title: "Actions", key: "actions", sortable: false },
];

// 👉 Fetching users

const route = useRoute();
const router = useRouter();

const getBusinessParams = ref<GetALLParams>({
  itemsPerPage: Number(route.query.pageSize) || 25,
  page: Number(route.query.page) || 1,
});

const data = ref<TypeOfBusinessDTOAllRes[]>();

const loadData = () => {
  TypeofbusinesApi.GetAll(getBusinessParams.value)
    .then((res) => {
      data.value = res.data;
      getBusinessParams.value = {
        ...getBusinessParams.value,
        ...res.pagination,
      };
    })
    .catch((err) => {
      console.log("err", err);
    });
};

onMounted(() => {
  loadData();
});

const isAddNewUserDrawerVisible = ref(false);

// 👉 Add new user
const addNewUser = (userData: UserProperties) => {
  userListStore.addUser(userData);

  // refetch User
};

// 👉 Delete user
const deleteUser = (id: number) => {
  userListStore.deleteUser(id);

  // refetch User
};

watch(
  () => [getBusinessParams.value.keywords],
  ([keywords], [oldSearch]) => {
    // Kiểm tra nếu giá trị đã thay đổi
    if (keywords !== oldSearch) loadData();
  },
  { deep: true }
);
watch(
  () => [getBusinessParams.value.page, getBusinessParams.value.itemsPerPage],
  ([page, itemsPerPage], [oldPage, oldItemsPerPage]) => {
    // Kiểm tra nếu giá trị đã thay đổi
    if (page !== oldPage || itemsPerPage !== oldItemsPerPage) {
      router.push({
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

const handleClick = (id: string) => {
  const encoded = btoa(unescape(encodeURIComponent(id)));
  return `sds1${encoded}`;
};
</script>

<template>
  <section>
    <VCard>
      <VCardText class="d-flex flex-wrap gap-4">
        <AppSelect
          :model-value="getBusinessParams.itemsPerPage"
          :items="[
            { value: 10, title: '10' },
            { value: 25, title: '25' },
            { value: 50, title: '50' },
            { value: 100, title: '100' },
            { value: -1, title: 'All' },
          ]"
          style="width: 5rem"
          @update:model-value="
            getBusinessParams.itemsPerPage = parseInt($event, 10)
          "
        />

        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <AppTextField
            v-model="getBusinessParams.keywords"
            placeholder="Search "
            density="compact"
            style="width: 18.5rem"
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
              :variant="!item.raw.business.avartar ? 'tonal' : undefined"
              class="me-3"
            >
              <VImg
                :src="
                  item.raw.business.avartar ??
                  'https://res.cloudinary.com/dnitjp0ng/image/upload/v1744476928/QLTB/default/DefaultUserList.jpg'
                "
              />
            </VAvatar>
            <div class="d-flex flex-column">
              <h6 class="text-body-1 font-weight-medium">
                <RouterLink
                  :to="{
                    name: 'apps-business-view',
                    query: {
                      tab: 'News',
                      id: handleClick(item.raw.business.id),
                    },
                  }"
                  class="user-list-name"
                >
                  {{ item.raw.name }}
                </RouterLink>
              </h6>
              <span class="text-sm text-disabled">{{
                item.raw.business.name
              }}</span>
            </div>
          </div>
        </template>
        <!-- Action -->
        <template #item.action="{ item }">
          <VChip
            label
            size="small"
            class="text-capitalize"
            :color="CheckConnectType(item.raw.action).color"
          >
            {{ CheckConnectType(item.raw.action).text }}
          </VChip>
        </template>
        <template #item.type="{ item }">
          <div class="d-flex flex-column">
            <h6 class="text-body-1 font-weight-medium">
              {{ Findby(item.raw.businessType.type).text }}
            </h6>
            <span class="text-sm text-disabled">{{
              item.raw.paytype ? item.raw.paytype.maximum : "0"
            }}</span>
          </div>
          {{ item.raw.paytype ? item.raw.paytype.price : "" }}
        </template>
        <template #item.nametype="{ item }">
          {{ item.raw.businessType.name }}
        </template>
        <template #item.description="{ item }">
          <span class="truncate-description">
            {{ item.raw.business.description }}
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

          <div
            class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3"
          >
            <p class="text-sm text-disabled mb-0">
              {{
                paginationMetaText(
                  getBusinessParams.itemsPerPage,
                  getBusinessParams.totalItems,
                  getBusinessParams.page
                )
              }}
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
            <VIcon size="24" icon="tabler-dots-vertical" />

            <VMenu activator="parent">
              <VList>
                <VListItem
                  :to="{
                    name: 'apps-user-view-id',
                    params: { id: item.raw.id },
                  }"
                >
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
</style>
