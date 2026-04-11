<script setup lang="ts">
import { VDataTableServer } from "vuetify/labs/VDataTable";
import { paginationMeta } from "@/Api/paginationMeta";
import { useI18n } from "vue-i18n";
import { useTranslatedHeaders } from "@/plugins/i18n/translateHeader";

import { headersCity, headersDistrict, headersStreet, headersWard } from "@/Data/Model/AdministrativeUnit/Header";
import AdministrativeUnitAPI, { AdministrativeUnitLevelParams, AdministrativeUnitParams } from "@/Api/addressDetail/AdministrativeUnitAPI";

import { getProvincetypeInfo, getTypeLevel, getTypeLevelSelect, keyTranslatedTitle } from "@/Common/enum/country/AdministrativeUnitEnum";
import { CountrysDTO } from "@/models/Lang/CountrysDTO";
import { AdministrativeUnitDTO, UpdateAdministrativeUnitDTO } from "@/models/Lang/administrativeUnitDTO";
import CreateAddressUnitDialog from "@/components/dialogs/lang/CreateAddressUnitDialog.vue";
import { useSnackbarStore } from "@/plugins/utils/snackbar";
import { useGlobalLoader } from "@/plugins/utils/useGlobalLoader";

const { t } = useI18n();

interface Props {
  parentId?: string;
  levelType: number;
  country: CountrysDTO;
  data: AdministrativeUnitDTO;
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
  id: '',
  keyWords: '',
  totalItems: 0,
  selectAll: false,
  level: props.levelType
});

const editingMap = ref<Record<string, boolean>>({});

// ================= API =================
const loadDatas = async () => {
  if (!props.parentId) {
    loadingsData.value = [];
    return;
  }
  try {
    loadings.value = true;

    const res = await AdministrativeUnitAPI.GetTrativeByLevel({
      ...filters.value,
      id: props.parentId ?? '',
    });

    loadingsData.value = res.data;
    filters.value = { ...filters.value, ...res.pagination };
  } catch (error) {
  } finally {
    loadings.value = false;
  }
};

// ================= LIFECYCLE =================
onMounted(() => {
  filters.value.id = props.parentId ?? '';
  loadDatas();
});

// ================= WATCH =================
// 👉 chỉ cần watch 1 thứ: country

watch(
  [
    () => filters.value.id,
    () => filters.value.page,
    () => filters.value.itemsPerPage,
    () => props.parentId,
    () => filters.value.keyWords,
  ],
  () => {
    filters.value.id == props.parentId;
    loadDatas();
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
      return headersStreet;
    case 4:
      return headersWard;
    default:
      return [];
  }
}

const translatedHeaders = useTranslatedHeaders(headers());

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


const isDialogCreate = ref(false);

const snackbar = useSnackbarStore();
const globalLoader = useGlobalLoader();

const getPreviousValidLevel = (
  level: number,
  skipLevels: number[] = []
): number | null => {
  let current = level - 1;

  while (current > 0) {
    if (!skipLevels.includes(current)) return current;
    current--;
  }

  return null;
};

const createNew = () => {
  if (!props.parentId) {
    const prevLevel = getPreviousValidLevel(
      props.levelType,
      props.country.skipLevel
    );

    if (!prevLevel) {
      snackbar.show(t("IsSelectItem", ["mục hợp lệ"]), "warning");
      return;
    }

    const label = t(
      "App." +
      getProvincetypeInfo(prevLevel).text
    );

    snackbar.show(t("IsSelectItem", [label]), "warning");
    return;
  }
  isDialogCreate.value = true;
};


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
}

const deleteasync = async (id: string) => {
  await AdministrativeUnitAPI.delete(id).then((res) => {
    if (res) {
      loadDatas();
      useSnackbarStore().show(t("Delete success"), "success");

    }
    else {
      useSnackbarStore().show(t("Delete failed"), "error");
    }
  });
};
const toggleActive = (item: any) => {
  if (editingMap.value[item.id]) {
    item.isActive = !item.isActive;
  }
};
</script>

<template>
  <div>
    <CreateAddressUnitDialog :countrys="props.country" :parent-id="props.parentId" :leveltype="props.levelType"
      v-model:is-dialog-visible="isDialogCreate" v-on:update:data="updateData" />
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
          ]" style="width: 6.25rem" @update:model-value="filters.itemsPerPage = parseInt($event, 10)" />
          <!-- 👉 Create invoice -->
          <VBtn v-if="$can('manage', 'all')" prepend-icon="tabler-plus" @click="createNew()">
            {{ t("Create") }}
          </VBtn>
          <VCheckbox v-model="filters.selectAll" :label="t('Select All')" @change="() => {
            if (filters.selectAll) {
              filters.id = '';
            } else {
              filters.id = props.parentId ?? '';
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
              <AppAutocomplete v-model="item.raw.type" :items="getTypeLevelSelect(props.levelType)"
                :item-title="translatedTitle" item-value="value" :readonly="!editingMap[item.raw.id]" persistent-hint
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
              <VChip :color="getTypeLevel(item.raw.type, props.levelType).color" variant="outlined">
                {{
                  t(
                    keyTranslatedTitle(props.levelType) +
                    getTypeLevel(item.raw.type, props.levelType).text,
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
