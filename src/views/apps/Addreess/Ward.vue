<script setup lang="ts">
import { VDataTableServer } from "vuetify/labs/VDataTable";
import { CountrysDTO } from "@/models/Lang/CountrysDTO";
import { paginationMeta } from "@/Api/paginationMeta";

import { useI18n } from "vue-i18n";
import { useTranslatedHeaders } from "@/plugins/i18n/translateHeader";
import { CityResDTO } from "@/models/Lang/citysDTO";
import { DistrictResDTO } from "@/models/Lang/DistrictDTO";
import {
  getProvinceDistrict,
  getProvinceDistrictSelect,
  getProvinceWard,
  getProvinceWardSelect,
} from "@/Common/enum/country/countryEnum";
import { WardDTO, WardResDTO } from "@/models/Lang/WarDTO";
import wardApi, { GetWardParams } from "@/Api/Lang/wardApi";

// 👉 i18n
const { t } = useI18n();
// 👉 Store

interface Props {
  city?: CityResDTO;
  country?: CountrysDTO;
  district: DistrictResDTO;
}

interface Emit {
  (e: "update:ward", value: WardResDTO): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const filters = ref<GetWardParams>({
  itemsPerPage: 5, // Lấy pageSize từ query, mặc định 2
  page: 1, // Lấy page từ query, mặc định 1
  totalItems: 0,
  keywords: "",
  districtId: 0,
});

const data = ref<DistrictResDTO[]>([]);
const loadings = ref(false);

const loadData = () => {
  loadings.value = true;
  wardApi
    .GetAllAsync(filters.value)
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
    () => props.district?.id,
  ],
  () => {
    filters.value.districtId = props.district?.id || 0;
    loadData();
  }
);

// 👉 headers
const headers = [
  { title: "App.Ward.Name", key: "districtName", align: "center" },
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

const rowclick = (val: WardResDTO) => {
  emit("update:ward", val);
};

const ward = ref<WardResDTO>();
const openAddDialog = (item?: WardResDTO) => {
  if (item?.id) {
    ward.value = item;
    showEditDialog.value = true;
  } else showAddDialog.value = true;
};

const createWard = (val: WardDTO) => {
  loadings.value = true;
  wardApi
    .Create(val)
    .then((res) => {
      loadData();
      loadings.value = false;
    })
    .catch(() => {
      loadings.value = false;
    });
};
const updateWard = (val: WardDTO) => {
  loadings.value = true;

  wardApi
    .Update(val)
    .then((res) => {
      loadData();
      loadings.value = false;
    })
    .catch(() => {
      loadings.value = false;
    });
};

const updateOradd = async (val: WardDTO) => {
  if (val.id !== undefined && val.id !== null && val.id !== 0) {
    updateWard(val);
  } else {
    createWard(val);
  }
};

const editingMap = ref<Record<number, boolean>>({});

const toggleEdit = (val: WardResDTO) => {
  if (editingMap.value[val.id]) {
    updateOradd({
      id: val.id,
      wardName: val.wardName,
      districtId: props.district?.id || 0,
      communeWardEnum: val.communeWardEnum,
    });
  }
  editingMap.value[val.id] = !editingMap.value[val.id];
};

//
const translatedTitle = (item: any) => {
  return t("App.Ward." + item.title, "none");
};
</script>

<template>
  <div>
    <AddOrEditWardDialog
      @update:is-dialog-visible="updatedialogvisibleAdd"
      :is-dialog-visible="showAddDialog"
      :citys="props.city"
      :district="props.district"
      @update:ward="updateOradd"
      :countrys="props.country"
    />
    <AddOrEditWardDialog
      @update:is-dialog-visible="updatedialogvisibleEdit"
      :citys="props.city"
      :countrys="props.country"
      :ward="ward"
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
            <td>{{ item.raw.wardName }}</td>
            <td v-if="$can('manage', 'all')">
              <AppAutocomplete
                v-model="item.raw.communeWardEnum"
                :item-title="translatedTitle"
                item-value="value"
                :items="getProvinceWardSelect()"
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
                :color="getProvinceWard(item.raw.communeWardEnum).color"
                variant="outlined"
              >
                {{
                  t(
                    "App.Ward." + getProvinceWard(item.raw.communeWardEnum).text
                  )
                }}
              </VChip>
            </td>
            <td>
              <IconBtn v-if="$can('manage', 'all')">
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
