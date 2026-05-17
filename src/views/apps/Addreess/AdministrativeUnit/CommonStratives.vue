<script setup lang="ts">
import { VDataTableServer } from "vuetify/labs/VDataTable";
import { paginationMeta } from "@/Api/paginationMeta";
import { useI18n } from "vue-i18n";
import { useTranslatedHeaders } from "@/plugins/i18n/translateHeader";

import { headersCity, headersDistrict, headersStreet, headersWard } from "@/Data/Model/AdministrativeUnit/Header";
import AdministrativeUnitAPI, { AdministrativeUnitLevelParams, AdministrativeUnitParams } from "@/Api/addressDetail/AdministrativeUnitAPI";

import { getProvincetypeInfoLevel1, getProvincetypeInfoLevel2, getProvincetypeInfoLevel3, getProvincetypeInfoLevel4, getProvinceTypeSelect1, getProvinceTypeSelect2, getProvinceTypeSelect3, getProvinceTypeSelect4 } from "@/Common/enum/country/AdministrativeUnitEnum";
import { CountrysDTO } from "@/models/Lang/CountrysDTO";
import { AdministrativeUnitDTO } from "@/models/Lang/administrativeUnitDTO";

const { t } = useI18n();

interface Props {
  country?: CountrysDTO;
  parentId?: string;
  levelType: number;
}

interface Emit {
  (e: "update:data", value: AdministrativeUnitDTO): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

// ================= STATE =================
const loadings = ref(false);
const loadingsData = ref<AdministrativeUnitDTO[]>([]);

const filters = ref<AdministrativeUnitLevelParams>({
  itemsPerPage: 5,
  page: 1,
  id: "",
  totalItems: 0,
  selectAll: false,
  keyWords: "",
  level: props.levelType,
});

const editingMap = ref<Record<string, boolean>>({});

// ================= API =================
const loadDatas = async () => {
  if (!props.parentId) {
    return;
  }
  loadings.value = true;
  await AdministrativeUnitAPI.GetTrativeByLevel({
    ...filters.value,
    id: props.parentId ?? '',
  }).then((res) => {
    loadingsData.value = res.data;
    filters.value = res.pagination;
    loadings.value = false;
  })
    .catch((error) => {
      console.error("Load data error:", error);
      loadings.value = false;
    })
}

// ================= LIFECYCLE =================
onMounted(() => {
  filters.value.id = props.parentId ?? '';
});

// ================= WATCH =================
// 👉 chỉ cần watch 1 thứ: country

watch(
  [
    () => filters.value.page,
    () => filters.value.itemsPerPage,
  ],
  () => {
    loadDatas();
  }
);

watch(
  () => props.parentId,
  (newCountry) => {
    if (newCountry) {
      filters.value.id = newCountry;
      loadDatas();
    }
  }
);

// ================= TABLE EVENT =================
const handleOptionsUpdate = (options: any) => {
  filters.value.page = options.page;
  filters.value.itemsPerPage = options.itemsPerPage;

  loadDatas();
};


// ================= UI =================
const headers = () => {
  switch (props.levelType) {
    case 1:
      return headersCity;
    case 2:
      return headersDistrict;
    case 3:
      return headersWard;
    case 4:
      return headersStreet;
    default:
      return [];
  }
}

const translatedHeaders = useTranslatedHeaders(headers());

const rowclick = (val: AdministrativeUnitDTO) => {
  emit("update:data", val);
};

const toggleEdit = (val: AdministrativeUnitDTO) => {
  editingMap.value[val.id] = !editingMap.value[val.id];
};

const translatedTitle = (item: any) => {
  return t(keyTranslatedTitle(props.levelType) + item.title, "none");
};



// 👉 có thể refactor lại bằng cách tạo 1 file enum riêng cho phần này
const getTypeLevel = (type: number) => {
  switch (props.levelType) {
    case 1:
      return getProvincetypeInfoLevel1(type);
    case 2:
      return getProvincetypeInfoLevel2(type);
    case 3:
      return getProvincetypeInfoLevel3(type);
    case 4:
      return getProvincetypeInfoLevel4(type);
    default:
      return { text: "none", color: "default" };
  }
};

const getTypeLevelSelect = () => {
  console.log("level type", props.levelType);
  switch (props.levelType) {
    case 1:
      return getProvinceTypeSelect1();
    case 2:
      return getProvinceTypeSelect2();
    case 3:
      return getProvinceTypeSelect3();
    case 4:
      return getProvinceTypeSelect4();
    default:
      return () => [];
  }
};

const keyTranslatedTitle = (level: number) => {
  switch (level) {
    case 1:
      return "App.City.";
    case 2:
      return "App.Districts.";
    case 3:
      return "App.Ward.";
    case 4:
      return "App.Street.";
    default:
      return "";
  }
};
</script>

<template>
  <div>
    <VCard v-if="loadingsData" id="invoice-list">
      <VCardText class="d-flex align-center flex-wrap gap-4">
        <div class="me-3 d-flex gap-3">
          <AppSelect :model-value="filters.itemsPerPage" :items="[
            { value: 5, title: '5' },
            { value: 10, title: '10' },
            { value: 25, title: '25' },
            { value: 50, title: '50' },
            { value: 100, title: '100' },
            { value: -1, title: 'All' },
          ]" style="width: 6.25rem;" @update:model-value="filters.itemsPerPage = parseInt($event, 10)" />
          <!-- 👉 Create invoice -->
          <VBtn v-if="$can('manage', 'all')" prepend-icon="tabler-plus" @click="">
            {{ t("Create") }}
          </VBtn>
        </div>

        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div class="invoice-list-filter">
            <!-- <AppTextField v-model="filters.keywords" :placeholder="t('Search')" density="compact" /> -->
          </div>

          <!-- 👉 Select status -->
        </div>
      </VCardText>

      <VDivider />

      <!-- SECTION Datatable -->
      <VDataTableServer class="min-vw-1800" v-model:items-per-page="filters.itemsPerPage" :headers="translatedHeaders"
        :items="loadingsData" :items-length="filters.totalItems || 0" :loading="loadings" @update:options="loadDatas">
        <template #item.id="{ item }"> #{{ item.raw.id }} </template>
        <template #item="{ item, index }">
          <tr @click="rowclick(item.raw)">
            <!-- <td>{{ item.raw.id }}</td> -->
            <td>{{ item.raw.name }}</td>
            <td v-if="$can('manage', 'all')">
              <AppAutocomplete v-model="item.raw.type" :items="getTypeLevelSelect()" :item-title="translatedTitle"
                item-value="value" :readonly="!editingMap[item.raw.id]" persistent-hint
                :menu-props="{ maxHeight: '200px' }">
                <template #append>
                  <VSlideXReverseTransition mode="out-in">
                    <VIcon :key="`icon-${editingMap[item.raw.id]}`"
                      :color="editingMap[item.raw.id] ? 'success' : 'info'" :icon="editingMap[item.raw.id]
                        ? 'tabler-checks'
                        : 'tabler-edit-circle'
                        " @click="toggleEdit(item.raw)" />
                  </VSlideXReverseTransition>
                </template>
              </AppAutocomplete>
            </td>
            <td v-else>
              <VChip :color="getTypeLevel(item.raw.type).color" variant="outlined">
                {{
                  t(
                    "App.District." +
                    getTypeLevel(item.raw.type).text,
                  )
                }}
              </VChip>
            </td>
            <td>
              <IconBtn v-if="$can('manage', 'all')">
                <VIcon class="text-error" icon="tabler-trash" />
              </IconBtn>

              <IconBtn v-if="$can('manage', 'all')" @click="">
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

          <IconBtn @click="">
            <VIcon class="text-warning" icon="tabler-edit" />
          </IconBtn>
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
