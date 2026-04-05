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
  getProvinceStreet,
  getProvinceStreetSelect,
  getProvinceWardSelect,
} from "@/Common/enum/country/countryEnum";
import { WardDTO, WardResDTO } from "@/models/Lang/WarDTO";
import StreetApi, { GetStreetsParams } from "@/Api/Lang/StreetApi";
import { StreetsDTO, StreetsResDTO } from "@/models/Lang/StreetDTO";

// 👉 i18n
const { t } = useI18n();
// 👉 Store

interface Props {
  city: CityResDTO;
  country?: CountrysDTO;
  ward: WardResDTO;
  district: DistrictResDTO;
}

interface Emit {
  (e: "update:street", value: StreetsDTO): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const filters = ref<GetStreetsParams>({
  itemsPerPage: 5, // Lấy pageSize từ query, mặc định 2
  page: 1, // Lấy page từ query, mặc định 1
  totalItems: 0,
  keywords: "",
  wardId: 0,
});

const data = ref<DistrictResDTO[]>([]);
const loadings = ref(false);

const loadData = () => {
  loadings.value = true;
  StreetApi.GetAllAsync(filters.value)
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
    () => props.ward?.id,
  ],
  () => {
    filters.value.wardId = props.ward?.id || 0;
    loadData();
  }
);

// 👉 headers
const headers = [
  { title: "App.Street.Name", key: "street", align: "center" },
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

const rowclick = (val: StreetsDTO) => {
  emit("update:street", val);
};

const streets = ref<StreetsResDTO>();
const openAddDialog = (item?: StreetsResDTO) => {
  if (item?.id) {
    streets.value = item;
    showEditDialog.value = true;
  } else showAddDialog.value = true;
};

const createWard = (val: StreetsDTO) => {
  loadings.value = true;
  StreetApi.Create(val)
    .then((res) => {
      loadData();
      loadings.value = false;
    })
    .catch(() => {
      loadings.value = false;
    });
};
const updateWard = (val: StreetsDTO) => {
  loadings.value = true;

  StreetApi.Update(val)
    .then((res) => {
      loadData();
      loadings.value = false;
    })
    .catch(() => {
      loadings.value = false;
    });
};

const updateOradd = async (val: StreetsDTO) => {
  if (val.id !== undefined && val.id !== null && val.id !== "") {
    updateWard(val);
  } else {
    createWard(val);
  }
};

const editingMap = ref<Record<string, boolean>>({});

const toggleEdit = (val: StreetsResDTO) => {
  if (editingMap.value[val.id]) {
    updateOradd({
      id: val.id,
      street: val.street,
      wardId: props.ward?.id || 0,
      streetRoadEnum: val.streetRoadEnum,
    });
  }
  editingMap.value[val.id] = !editingMap.value[val.id];
};

//
const translatedTitle = (item: any) => {
  return t("App.Street." + item.title, "none");
};
</script>

<template>
  <div>
    <AddOrEditStreetDialog
      @update:is-dialog-visible="updatedialogvisibleAdd"
      :is-dialog-visible="showAddDialog"
      :citys="props.city"
      :ward="props.ward"
      :district="props.district"
      @update:street="updateOradd"
      :countrys="props.country"
    />
    <AddOrEditStreetDialog
      @update:is-dialog-visible="updatedialogvisibleEdit"
      :citys="props.city"
      :countrys="props.country"
      :ward="ward"
      :street="streets"
      @update:street="updateOradd"
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
            <td>{{ item.raw.street }}</td>
            <td v-if="$can('manage', 'all')">
              <AppAutocomplete
                v-model="item.raw.streetRoadEnum"
                :item-title="translatedTitle"
                item-value="value"
                :items="getProvinceStreetSelect()"
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
                :color="getProvinceStreet(item.raw.streetRoadEnum).color"
                variant="outlined"
              >
                {{
                  t(
                    "App.Street." +
                      getProvinceStreet(item.raw.streetRoadEnum).text
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
