<script setup lang="ts">
import { VDataTableServer } from "vuetify/labs/VDataTable";
import { paginationMeta } from "@/Api/paginationMeta";
import { useI18n } from "vue-i18n";
import { useTranslatedHeaders } from "@/plugins/i18n/translateHeader";

import { headersCity } from "@/Data/Model/AdministrativeUnit/Header";
import AdministrativeUnitAPI, { AdministrativeUnitParams } from "@/Api/addressDetail/AdministrativeUnitAPI";

import { getProvincetypeInfoLevel1, getProvinceTypeSelect1, keyTranslatedTitle } from "@/Common/enum/country/AdministrativeUnitEnum";
import { CountrysDTO } from "@/models/Lang/CountrysDTO";
import { AdministrativeUnitDTO, UpdateAdministrativeUnitDTO } from "@/models/Lang/administrativeUnitDTO";
import { useSnackbarStore } from "@/plugins/utils/snackbar";
import { useGlobalLoader } from "@/plugins/utils/useGlobalLoader";

const { t } = useI18n();

interface Props {
  country?: CountrysDTO;
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

const filters = ref<AdministrativeUnitParams>({
  itemsPerPage: 5,
  page: 1,
  id: 0,
  totalItems: 0,
  keyWords: '',
  selectAll: false,
});

const editingMap = ref<Record<string, boolean>>({});

// ================= API =================
const loadDatas = async () => {
  if (!props.country) {
    return;
  }
  loadings.value = true;
  await AdministrativeUnitAPI.GetAll({
    ...filters.value,
    id: props.country?.id ?? 0,
  }).then((res) => {
    loadingsData.value = res.data;
    filters.value = { ...filters.value, ...res.pagination };
    loadings.value = false;
  })
    .catch((error) => {
      loadings.value = false;
    })
}

// ================= LIFECYCLE =================
onMounted(() => {
  filters.value.id = props.country?.id ?? 0;
});

// ================= WATCH =================
// 👉 chỉ cần watch 1 thứ: country

watch(
  [
    () => filters.value.page,
    () => filters.value.itemsPerPage,
    () => filters.value.keyWords,
  ],
  () => {
    loadDatas();
  }
);

watch(
  () => props.country,
  (newCountry) => {
    if (newCountry) {
      filters.value.id = newCountry.id;
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
const translatedHeaders = useTranslatedHeaders(headersCity);

const rowclick = (val: AdministrativeUnitDTO) => {
  emit("update:data", val);
};

const toggleEdit = (val: AdministrativeUnitDTO) => {
  if (editingMap.value[val.id]) {
    updateDataAfterEdit(val);
  }
  editingMap.value[val.id] = !editingMap.value[val.id];
  Object.keys(editingMap.value).forEach(key => {
    if (!editingMap.value[key]) {
      delete editingMap.value[key];
    }
  });
};

const translatedTitle = (item: any) => {
  return t(keyTranslatedTitle(props.levelType) + item.title, "none");
};

const isCreateDialogVisible = ref(false);
const updateData = (val: AdministrativeUnitDTO) => {
  const pageSize = filters.value.itemsPerPage ?? 10;

  const index = loadingsData.value.findIndex(item => item.id === val.id);

  if (index !== -1) {
    loadingsData.value[index] = val;
  } else {
    loadingsData.value.unshift(val);

    if (loadingsData.value.length > pageSize) {
      loadingsData.value.pop();
    }
  }
}

const updateDataAfterEdit = async (val: AdministrativeUnitDTO) => {
  useGlobalLoader().show();
  const updatedaddressDetailUnitDTO = ({
    id: val.id,
    name: val.name,
    type: val.type,
    isActive: val.isActive,
  } as UpdateAdministrativeUnitDTO);
  await AdministrativeUnitAPI.updated(updatedaddressDetailUnitDTO).then((res) => {
    const index = loadingsData.value.findIndex(item => item.id === res.id);

    if (index !== -1) {
      loadingsData.value[index] = res;
    }
  }).catch((err) => {
    useSnackbarStore().show(t("Update failed"), "error");
  });
  useGlobalLoader().hide();
}

const deleteasync = async (id: string) => {
  useGlobalLoader().show();
  await AdministrativeUnitAPI.delete(id).then((res) => {
    if (res) {
      loadDatas();
    }
    else {
      useSnackbarStore().show(t("Delete failed"), "error");
    }
  });
  useGlobalLoader().hide();
};

const toggleActive = (item: any) => {
  if (editingMap.value[item.id]) {
    item.isActive = !item.isActive;
  }
};
</script>

<template>
  <div>
    <CreateAddressUnitDialog v-model:is-dialog-visible="isCreateDialogVisible" :countrys="props.country"
      :leveltype="props.levelType" @update:isDialogVisible="isCreateDialogVisible = $event" @update:data="updateData" />
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
          ]" style='width: 6.25rem;' @update:model-value="filters.itemsPerPage = parseInt($event, 10)" />
          <!-- 👉 Create invoice -->
          <VBtn v-if="$can('manage', 'all')" prepend-icon="tabler-plus" @click="isCreateDialogVisible = true">
            {{ t("Create") }}
          </VBtn>
          <VCheckbox v-model="filters.selectAll" :label="t('Select All')" @change="() => {
            if (filters.selectAll) {
              filters.id = 0;
            } else {
              filters.id = props.country?.id ?? 0;
            }
            loadDatas();
          }" />
        </div>

        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div class="invoice-list-filter">
            <AppTextField v-model="filters.keyWords" :placeholder="t('Search')" density="compact" />
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
              <AppAutocomplete v-model="item.raw.type" :items="getProvinceTypeSelect1()" :item-title="translatedTitle"
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
              <VChip :color="getProvincetypeInfoLevel1(item.raw.type).color" variant="outlined">
                {{
                  t(
                    "App.City." +
                    getProvincetypeInfoLevel1(item.raw.type).text,
                  )
                }}
              </VChip>
            </td>
            <td>
              <IconBtn v-if="$can('manage', 'all') && editingMap[item.raw.id]" @click="">
                <VIcon :class="item.raw.isActive ? 'text-success' : 'text-warning'"
                  :icon="item.raw.isActive ? 'tabler-check' : 'tabler-circle'" @click="toggleActive(item.raw)" />
              </IconBtn>
              <IconBtn v-if="$can('manage', 'all')">
                <VIcon @click="deleteasync(item.raw.id)" class="text-error" icon="tabler-trash" />
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
