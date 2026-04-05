<script setup lang="ts">
import { VDataTableServer } from "vuetify/labs/VDataTable";
import CountrysApi, { GetContryParams } from "@/Api/Lang/CountrysApi";
import { CountrysDTO } from "@/models/Lang/CountrysDTO";
import { paginationMeta } from "@/Api/paginationMeta";

import { useI18n } from "vue-i18n";
import { useTranslatedHeaders } from "@/plugins/i18n/translateHeader";

// 👉 i18n
const { t } = useI18n();
// 👉 Store

const route = useRoute();
const router = useRouter();

const filters = ref<GetContryParams>({
  itemsPerPage: Number(route.query.pageSize) || 10, // Lấy pageSize từ query, mặc định 2
  page: Number(route.query.page) || 1, // Lấy page từ query, mặc định 1
  totalItems: 0,
  keywords: "",
});

const data = ref<CountrysDTO[]>([]);
const loadings = ref(false);

const loadData = () => {
  loadings.value = true;
  CountrysApi.GetAllCountry(filters.value)
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
  ],
  () => {
    loadData();
  }
);

// 👉 headers
const headers = [
  { title: "#ID", key: "id" },
  { title: "App.countrys.flag", key: "Flag" },
  { title: "App.countrys.countryName", key: "countryName" },
  { title: "App.countrys.languageName", key: "languageName" },
  { title: "App.countrys.vietnamesCountryName", key: "vietnamesCountryName" },
  { title: "App.countrys.areaCode", key: "areaCode" },
  { title: "App.countrys.languageCode", key: "languageCode" },
  { title: "App.countrys.countryCode", key: "countryCode" },
  { title: "App.Actions", key: "actions", sortable: false },
];
const translatedHeaders = useTranslatedHeaders(headers);

const showAddDialog = ref(false);
const showEditDialog = ref(false);
const updatedialogvisibleAdd = (val: boolean) => {
  showAddDialog.value = val;
};
const updatedialogvisibleEdit = (val: boolean) => {
  showEditDialog.value = val;
};

const country = ref<CountrysDTO>();
const openAddDialog = (item?: CountrysDTO) => {
  if (item?.id) {
    country.value = item;
    showEditDialog.value = true;
  } else showAddDialog.value = true;
};

const addNewitem = async (val: CountrysDTO) => {
  CountrysApi.Create(val).then((res) => {
    data.value.push(val);
  });
};

const addorUpdate = (val: CountrysDTO) => {
  console.log(val);
};

const viewDistrict = (item: CountrysDTO) => {
  router.replace({
    name: "administrator-address-AdministrativeUnit",
    query: { id: item.id },
  });
};
</script>

<template>
  <div>
    <VCard v-if="data" id="invoice-list">
      <AddOrEditCountryDialog :is-dialog-visible="showAddDialog" @update:countrys="addorUpdate"
        @update:is-dialog-visible="updatedialogvisibleAdd" />
      <AddOrEditCountryDialog :is-dialog-visible="showEditDialog" :country="country" @update:countrys="addorUpdate"
        @update:is-dialog-visible="updatedialogvisibleEdit" />
      <VCardText class="d-flex align-center flex-wrap gap-4">
        <div class="me-3 d-flex gap-3">
          <AppSelect :model-value="filters.itemsPerPage" :items="[
            { value: 10, title: '10' },
            { value: 25, title: '25' },
            { value: 50, title: '50' },
            { value: 100, title: '100' },
            { value: -1, title: 'All' },
          ]" style="width: 6.25rem" @update:model-value="filters.itemsPerPage = parseInt($event, 10)" />
          <!-- 👉 Create invoice -->
          <VBtn prepend-icon="tabler-plus" @click="openAddDialog">
            {{ t("Create") }}
          </VBtn>
        </div>

        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div class="invoice-list-filter">
            <AppTextField v-model="filters.keywords" :placeholder="t('Search')" density="compact" />
          </div>

          <!-- 👉 Select status -->
        </div>
      </VCardText>

      <VDivider />

      <!-- SECTION Datatable -->
      <VDataTableServer v-model:items-per-page="filters.itemsPerPage" :headers="translatedHeaders" :items="data"
        :items-length="filters.totalItems || 0" :loading="loadings" @update:options="loadData">
        <!-- Trending Header -->
        <template #column.trending>
          <VIcon size="22" icon="tabler-trending-up" />
        </template>

        <!-- id -->
        <template #item.id="{ item }">
          <RouterLink :to="{
            name: 'administrator-address-AdministrativeUnit',
            query: { id: item.value },
          }">
            #{{ item.raw.id }}
          </RouterLink>
        </template>

        <template #item.actions="{ item }">
          <IconBtn>
            <VIcon class="text-error" icon="tabler-trash" />
          </IconBtn>

          <IconBtn @click="openAddDialog(item.raw)">
            <VIcon class="text-warning" icon="tabler-edit" />
          </IconBtn>

          <VBtn icon variant="text" size="small" color="medium-emphasis">
            <VIcon size="24" icon="tabler-dots-vertical" />

            <VMenu activator="parent">
              <VList>
                <VListItem @click="viewDistrict(item.raw)">
                  <template #prepend>
                    <VIcon icon="tabler-eye" />
                  </template>

                  <VListItemTitle>{{ t("View") }}</VListItemTitle>
                </VListItem>

                <VListItem @click="openAddDialog(item.raw)">
                  <template #prepend>
                    <VIcon icon="tabler-pencil" />
                  </template>
                  <VListItemTitle>{{ t("Edit") }}</VListItemTitle>
                </VListItem>

                <VListItem link>
                  <template #prepend>
                    <VIcon icon="tabler-trash" />
                  </template>
                  <VListItemTitle>{{ t("Delete") }}</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </VBtn>
        </template>
        <template #item.Flag="{ item }">
          <VAvatar size="34" :variant="!item.raw.avatar ? 'tonal' : undefined" class="me-3">
            <VImg :src="`https://flagcdn.com/w320/${item.raw.areaCode.toLowerCase()}.png`" />
          </VAvatar>
        </template>

        <!-- pagination -->

        <template #bottom>
          <VDivider />
          <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
            <p class="text-sm text-disabled mb-0">
              {{
                paginationMeta(
                  filters.page ? filters.page : 1,
                  filters.itemsPerPage ? filters.itemsPerPage : 10,
                  filters.totalItems ? filters.totalItems : 0
                )
              }}
            </p>

            <ReusablePagination v-model="filters.page" :length="Number(filters.totalPages)" />
          </div>
        </template>
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
