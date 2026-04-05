<script setup lang="ts">
import { VDataTableServer } from "vuetify/labs/VDataTable";
import DistrictApi, { GetDistrictParams } from "@/Api/Lang/districApi";
import { CountrysDTO } from "@/models/Lang/CountrysDTO";
import { paginationMeta } from "@/Api/paginationMeta";

import { useI18n } from "vue-i18n";
import { useTranslatedHeaders } from "@/plugins/i18n/translateHeader";
import { CityResDTO } from "@/models/Lang/citysDTO";
import { DistrictResDTO } from "@/models/Lang/DistrictDTO";

// 👉 i18n
const { t } = useI18n();
// 👉 Store

interface Props {
  cityId: number;
  keywords: string;
}

interface Emit {
  (e: "update:district", value: DistrictResDTO): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const filters = ref<GetDistrictParams>({
  itemsPerPage: 10, // Lấy pageSize từ query, mặc định 2
  page: 1, // Lấy page từ query, mặc định 1
  totalItems: 0,
  keywords: props.keywords,
  cityId: props.cityId,
});

const data = ref<DistrictResDTO[]>([]);
const loadings = ref(false);

const loadData = () => {
  loadings.value = true;
  DistrictApi.GetAllAsync(filters.value)
    .then((res) => {
      data.value = res.data;
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
watch(
  [
    () => filters.value.keywords,
    () => filters.value.page,
    () => filters.value.itemsPerPage,
    () => props.cityId,
    () => props.keywords,
  ],
  () => {
    filters.value.cityId = props.cityId ?? 0;
    filters.value.keywords = props.keywords;
    loadData();
  }
);

// 👉 headers
const headers = [
  { title: "#ID", key: "id" },
  { title: "App.District.Name", key: "districtName" },
];
const translatedHeaders = useTranslatedHeaders(headers);
</script>

<template>
  <div>
    <VCard v-if="data" id="invoice-list">
      <!-- SECTION Datatable -->
      <VDataTableServer
        v-model:items-per-page="filters.itemsPerPage"
        :headers="translatedHeaders"
        :items="data"
        :items-length="filters.totalItems || 0"
        :loading="loadings"
        @update:options="loadData"
      >
        <!-- Trending Header -->
        <template #column.trending>
          <VIcon size="22" icon="tabler-trending-up" />
        </template>
        <!-- id -->
        <template #item.id="{ item }">
          <RouterLink
            :to="{
              name: 'apps-invoice-preview-id',
              params: { id: item.value },
            }"
          >
            #{{ item.raw.id }}
          </RouterLink>
        </template>
        <!-- pagination -->

        <template #bottom> </template>
      </VDataTableServer>
      <!-- !SECTION -->
    </VCard>
  </div>
</template>

<style lang="scss">
#invoice-list {
  .invoice-list-actions {
    inline-size: 8rem;
  }

  .invoice-list-filter {
    inline-size: 12rem;
  }
}
</style>
