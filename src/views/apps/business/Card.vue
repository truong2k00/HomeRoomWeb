<script setup lang="ts">
import { useRouter } from "vue-router";
import BussinessApi, { type GetBusinessParams } from "@/Api/Business/Business";
import type { BusinessResDTO } from "@/models/Admin/BusinessDTO";

// 👉 Fetching users

const route = useRoute();
const router = useRouter();

const getBusinessParams = ref<GetBusinessParams>({
  itemsPerPage: Number(route.query.pageSize) || 10,
  page: Number(route.query.page) || 1,
});

const data = ref<BusinessResDTO[]>();

const loadData = () => {
  BussinessApi.GetAll(getBusinessParams.value).then((res) => {
    data.value = res.data;
    console.log(data.value);

    getBusinessParams.value = {
      ...getBusinessParams.value,
      ...res.pagination,
    };
  });
};

onMounted(() => {
  loadData();
});

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

const handleClick = (id: any) => {
  const encodeing = btoa(id);

  router.push({
    name: "apps-business-view",
    query: { tab: "profile", id: `sds1${encodeing}` },
  });
};
</script>

<template>
  <section>
    <VRow>
      <VCol v-for="meta in data" :key="meta.id" cols="12" sm="6" lg="3">
        <VCard @click="handleClick(meta.id)">
          <VCardText class="d-flex justify-space-between">
            <div>
              <span>{{ meta.name }}</span>
              <div class="d-flex align-center gap-2 my-1">
                <h6 class="text-h4">
                  {{ meta.usercount }}
                </h6>
              </div>
              <span class="truncate-description">{{ meta.description }}</span>
            </div>

            <VAvatar
              rounded
              variant="tonal"
              color="success"
              icon="tabler-user-plus"
              @click.stop="handleClick(meta.id)"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <VDivider />

    <ReusablePagination
      v-model="getBusinessParams.page"
      :length="Number(getBusinessParams.totalPages)"
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
