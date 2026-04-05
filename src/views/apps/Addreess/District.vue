<script setup lang="ts">
import { VDataTableServer } from "vuetify/labs/VDataTable";
import DistrictApi, { GetDistrictParams } from "@/Api/Lang/districApi";
import { CountrysDTO, CountrysResDTO } from "@/models/Lang/CountrysDTO";
import { paginationMeta } from "@/Api/paginationMeta";

import { useI18n } from "vue-i18n";
import { useTranslatedHeaders } from "@/plugins/i18n/translateHeader";
import { CityResDTO } from "@/models/Lang/citysDTO";
import { DistrictDTO, DistrictResDTO } from "@/models/Lang/DistrictDTO";
import districApi from "@/Api/Lang/districApi";
import {
  getProvinceDistrict,
  getProvinceDistrictSelect,
} from "@/Common/enum/country/countryEnum";

// 👉 i18n
const { t } = useI18n();
// 👉 Store

interface Props {
  city?: CityResDTO;
  country?: CountrysDTO;
}

interface Emit {
  (e: "update:district", value: DistrictResDTO): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const filters = ref<GetDistrictParams>({
  itemsPerPage: 5, // Lấy pageSize từ query, mặc định 2
  page: 1, // Lấy page từ query, mặc định 1
  totalItems: 0,
  keywords: "",
  cityId: 0,
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
    () => props.city?.id,
  ],
  () => {
    filters.value.cityId = props.city?.id || 0;
    loadData();
  }
);

// 👉 headers
const headers = [
  { title: "App.Districts.Name", key: "districtName", align: "center" },
  { title: "App.type", key: "sas", align: "center" },
  { title: "App.Actions", key: "actions", align: "center", sortable: false },
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

const rowclick = (val: DistrictResDTO) => {
  emit("update:district", val);
};

const district = ref<DistrictResDTO>();
const openAddDialog = (item?: DistrictResDTO) => {
  if (item?.id) {
    district.value = item;
    showEditDialog.value = true;
  } else showAddDialog.value = true;
};

const createDistrict = (val: DistrictDTO) => {
  loadings.value = true;
  districApi
    .Create(val)
    .then((res) => {
      loadData();
      loadings.value = false;
    })
    .catch(() => {
      loadings.value = false;
    });
};
const updateDistrict = (val: DistrictDTO) => {
  loadings.value = true;

  districApi
    .Update(val)
    .then((res) => {
      loadData();
      loadings.value = false;
    })
    .catch(() => {
      loadings.value = false;
    });
};

const remove = (val: DistrictResDTO) => {
  loadings.value = true;
  console.log(val.id);

  districApi
    .delete(val.id)
    .then((res) => {
      loadData();
      loadings.value = false;
    })
    .catch(() => {
      loadings.value = false;
    });
};

const updateOradd = async (val: DistrictDTO) => {
  if (val.id !== undefined && val.id !== null && val.id !== 0) {
    updateDistrict(val);
  } else {
    createDistrict(val);
  }
};

const editingMap = ref<Record<number, boolean>>({});

const toggleEdit = (val: DistrictResDTO) => {
  if (editingMap.value[val.id]) {
    updateOradd({
      id: val.id,
      districtName: val.districtName,
      cityId: props.city?.id || 0,
      countyDistrictEnum: val.countyDistrictEnum,
    });
  }
  editingMap.value[val.id] = !editingMap.value[val.id];
};

//
const translatedTitle = (item: any) => {
  return t("App.Districts." + item.title, "none");
};
</script>

<template>
  <div>
    <AddOrEditDistrictDialog
      @update:is-dialog-visible="updatedialogvisibleAdd"
      :is-dialog-visible="showAddDialog"
      :citys="props.city"
      @update:district="updateOradd"
      :countrys="props.country"
    />
    <AddOrEditDistrictDialog
      @update:is-dialog-visible="updatedialogvisibleEdit"
      :citys="props.city"
      :countrys="props.country"
      @update:district="updateOradd"
      :district="district"
      :is-dialog-visible="showEditDialog"
    />
    <VCard v-if="data" id="invoice-list">
      <VCardText class="d-flex align-center flex-wrap gap-4">
        <div class="me-3 d-flex gap-3">
          <AppSelect
            :model-value="filters.itemsPerPage"
            :items="[
              { value: 5, title: '5' },
              { value: 10, title: '10' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: -1, title: 'All' },
            ]"
            style="width: 6.25rem"
            @update:model-value="filters.itemsPerPage = parseInt($event, 10)"
          />
          <!-- 👉 Create invoice -->
          <VBtn
            v-if="$can('manage', 'all')"
            prepend-icon="tabler-plus"
            @click="openAddDialog"
          >
            {{ t("Create") }}
          </VBtn>
        </div>

        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div class="invoice-list-filter">
            <AppTextField
              v-model="filters.keywords"
              :placeholder="t('Search')"
              density="compact"
            />
          </div>

          <!-- 👉 Select status -->
        </div>
      </VCardText>

      <VDivider />

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
        <template #item="{ item, index }">
          <tr @click="rowclick(item.raw)">
            <td>{{ item.raw.districtName }}</td>
            <td v-if="$can('manage', 'all')">
              <AppAutocomplete
                v-model="item.raw.countyDistrictEnum"
                :item-title="translatedTitle"
                item-value="value"
                :items="getProvinceDistrictSelect()"
                :readonly="!editingMap[item.raw.id]"
                persistent-hint
                :menu-props="{ maxHeight: '200px' }"
              >
                <template #append>
                  <VSlideXReverseTransition mode="out-in">
                    <VIcon
                      :key="`icon-${editingMap[item.raw.id]}`"
                      :color="editingMap[item.raw.id] ? 'success' : 'info'"
                      :icon="
                        editingMap[item.raw.id]
                          ? 'tabler-checks'
                          : 'tabler-edit-circle'
                      "
                      @click="toggleEdit(item.raw)"
                    />
                  </VSlideXReverseTransition>
                </template>
              </AppAutocomplete>
            </td>
            <td v-else>
              <VChip
                :color="getProvinceDistrict(item.raw.countyDistrictEnum).color"
                variant="outlined"
              >
                {{
                  t(
                    "App.Districts." +
                      getProvinceDistrict(item.raw.countyDistrictEnum).text
                  )
                }}
              </VChip>
            </td>
            <td>
              <IconBtn v-if="$can('manage', 'all')" @click="remove(item.raw)">
                <VIcon class="text-error" icon="tabler-trash" />
              </IconBtn>

              <IconBtn
                v-if="$can('manage', 'all')"
                @click="openAddDialog(item.raw)"
              >
                <VIcon class="text-warning" icon="tabler-edit" />
              </IconBtn>
            </td>
            <!-- Các cột khác -->
          </tr>
        </template>
        <!-- id -->

        <!-- pagination -->

        <template #bottom>
          <VDivider />
          <div
            class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3"
          >
            <p class="text-sm text-disabled mb-0">
              {{
                paginationMeta(
                  filters.page ? filters.page : 1,
                  filters.itemsPerPage ? filters.itemsPerPage : 10,
                  filters.totalItems ? filters.totalItems : 0
                )
              }}
            </p>

            <ReusablePagination
              v-model="filters.page"
              :length="Number(filters.totalPages)"
            />
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
