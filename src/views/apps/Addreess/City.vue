<script setup lang="ts">
import { VDataTableServer } from "vuetify/labs/VDataTable";
import CityApi, { GetCityParams } from "@/Api/Lang/citysApi";
import { CountrysDTO } from "@/models/Lang/CountrysDTO";
import { paginationMeta } from "@/Api/paginationMeta";

import { useI18n } from "vue-i18n";
import { useTranslatedHeaders } from "@/plugins/i18n/translateHeader";
import { CityDTO, CityResDTO } from "@/models/Lang/citysDTO";
import {
  getProvinceCity,
  getProvinceCitySelect,
} from "@/Common/enum/country/countryEnum";

// 👉 i18n
const { t } = useI18n();
// 👉 Store

const route = useRoute();
const router = useRouter();

interface Props {
  country?: CountrysDTO;
}

interface Emit {
  (e: "update:citys", value: CityResDTO): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const filters = ref<GetCityParams>({
  itemsPerPage: 5, // Lấy pageSize từ query, mặc định 2
  page: 1, // Lấy page từ query, mặc định 1
  totalItems: 0,
  keywords: "",
  countryId: Number(route.query.id),
});

watch(
  () => props.country?.id,
  (newVal) => {
    filters.value.countryId === newVal;
  }
);

const data = ref<CityResDTO[]>([]);
const loadings = ref(false);

const loadData = () => {
  loadings.value = true;
  CityApi.GetAllCity(filters.value)
    .then((res) => {
      data.value = res.data;
      filters.value = { ...filters.value, ...res.pagination };
      loadings.value = false;
    })
    .catch(() => {
      loadings.value = false;
    });
};

const createCity = (val: CityDTO) => {
  loadings.value = true;
  CityApi.Create(val)
    .then((res) => {
      loadData();
      loadings.value = false;
    })
    .catch(() => {
      loadings.value = false;
    });
};
const updateCity = (val: CityDTO) => {
  loadings.value = true;
  CityApi.Update(val)
    .then((res) => {
      loadData();
      loadings.value = false;
    })
    .catch(() => {
      loadings.value = false;
    });
};

onMounted(() => {
  country.value = props.country;
  loadData();
});
watch(
  [
    () => filters.value.keywords,
    () => filters.value.countryId,
    () => filters.value.page,
    () => filters.value.itemsPerPage,
    () => props.country,
  ],
  () => {
    filters.value.countryId == props.country?.id;
    loadData();
  }
);

// 👉 headers
const headers = [
  { title: "#ID", key: "id", align: "center" },
  { title: "App.City.Name", key: "cityName", align: "center" },
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

const country = ref<CountrysDTO>();
const city = ref<CityResDTO>();
const openAddDialog = (item?: CityResDTO) => {
  if (item) {
    city.value = item;
    showEditDialog.value = true;
  } else showAddDialog.value = true;
};

const rowclick = (val: CityResDTO) => {
  emit("update:citys", val);
};

watch(
  () => props.country,
  (newval) => {
    country.value = newval;
  }
);

const editingMap = ref<Record<number, boolean>>({});

const updateOradd = async (val: CityDTO) => {
  if (val.id !== undefined && val.id !== null && val.id !== 0) {
    updateCity(val);
  } else {
    createCity(val);
  }
};
const toggleEdit = (val: CityResDTO) => {
  if (editingMap.value[val.id]) {
    updateOradd({
      id: val.id,
      cityName: val.cityName,
      countrysId: filters.value.countryId || 0,
      provinceCityEnum: val.provinceCityEnum,
    });
    emit("update:citys", val);
  }
  editingMap.value[val.id] = !editingMap.value[val.id];
};
//
const translatedTitle = (item: any) => {
  return t("App.City." + item.title, "none");
};
</script>

<template>
  <div>
    <AddOrEditCityDialog
      @update:is-dialog-visible="updatedialogvisibleAdd"
      @update:citys="updateOradd"
      :is-dialog-visible="showAddDialog"
      :countrys="country"
    />
    <AddOrEditCityDialog
      @update:is-dialog-visible="updatedialogvisibleEdit"
      :is-dialog-visible="showEditDialog"
      @update:citys="updateOradd"
      :citys="city"
      :countrys="country"
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
        class="min-vw-1800"
        v-model:items-per-page="filters.itemsPerPage"
        :headers="translatedHeaders"
        :items="data"
        :items-length="filters.totalItems || 0"
        :loading="loadings"
        @update:options="loadData"
      >
        <template #item.id="{ item }"> #{{ item.raw.id }} </template>
        <template #item="{ item, index }">
          <tr @click="rowclick(item.raw)">
            <td>{{ item.raw.id }}</td>
            <td>{{ item.raw.cityName }}</td>
            <td v-if="$can('manage', 'all')">
              <AppAutocomplete
                v-model="item.raw.provinceCityEnum"
                :items="getProvinceCitySelect()"
                :item-title="translatedTitle"
                item-value="value"
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
                :color="getProvinceCity(item.raw.provinceCityEnum).color"
                variant="outlined"
              >
                {{
                  t(
                    "App.City." +
                      getProvinceCity(item.raw.provinceCityEnum).text
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
        <template #item.actions="{ item }">
          <IconBtn>
            <VIcon class="text-error" icon="tabler-trash" />
          </IconBtn>

          <IconBtn @click="openAddDialog(item.raw)">
            <VIcon class="text-warning" icon="tabler-edit" />
          </IconBtn>
        </template>

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
