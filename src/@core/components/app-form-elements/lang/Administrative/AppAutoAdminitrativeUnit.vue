<script lang="ts" setup>
import AdministrativeUnitAPI, {
  AdministrativeUnitLevelParamsAll,
  AdministrativeUnitParamsAll
} from "@/Api/addressDetail/AdministrativeUnitAPI";
import { AdminLevelType } from "@/Common/enum/country/AdministrativeUnitEnum";
import { useSnackbarStore } from "@/plugins/utils/snackbar";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// ================= PROPS =================
const props = defineProps<{
  items?: { key: string; value: string }[];
  level: AdminLevelType;
  countrysId: number;
  allowCreate?: boolean;
  parentId?: string;
  modelValue?: string | null;
  lable?: string;
  placeholder?: string;
  addnewlable?: string;
}>();

// ================= EMIT =================
const emit = defineEmits(["update:modelValue"]);

// ================= STATE =================
const items = ref<{ key: string; value: string }[]>([]);
const search = ref("");

// ================= LOAD DATA =================

const loadData = async () => {
  if (props.level === AdminLevelType.Level1) {
    try {
      const dataAll = {
        id: props.countrysId,
        keyWords: '',
        level: props.level
      } as AdministrativeUnitParamsAll;
      const res = await AdministrativeUnitAPI.GetTrativeAllCountry(dataAll);
      items.value = res.map((item: any) => ({
        key: item.id,
        value: item.name,
      }));
    } catch (error) {
      useSnackbarStore().show(t("Loading failed"), "error");
    }
  }
  else {
    try {
      const dataAll = {
        id: props.parentId,
        keyWords: '',
        level: props.level
      } as AdministrativeUnitLevelParamsAll;
      const res = await AdministrativeUnitAPI.GetTrativeAllLevel(dataAll);
      items.value = res.map((item: any) => ({
        key: item.id,
        value: item.name,
      }));
    } catch (error) {
      useSnackbarStore().show(t("Loading failed"), "error");
    }
  }
};
// ================= LIFECYCLE =================
onMounted(loadData);

// reload khi đổi country / parent
watch(
  () => [props.countrysId, props.parentId],
  () => {
    loadData();
    emit("update:modelValue", props.modelValue); // reset
  }
);

// ================= MODEL =================
const model = computed({
  get: () => props.modelValue ?? null,
  set: (val: string | null) => emit("update:modelValue", val)
});

// ================= ITEMS FOR UI =================
const computedItems = computed(() =>
  items.value.map(i => ({
    title: i.value,
    value: i.key
  }))
);

// ================= ADD NEW =================
const showAddNew = computed(() => {
  if (!search.value) return false;

  const keyword = search.value.toLowerCase();

  return !items.value.some(x =>
    x.value.toLowerCase().includes(keyword)
  );
});

const addNewItem = () => {
  isCreateDialogVisible.value = true;
  console.log("Add new item:", search.value);
};

const isCreateDialogVisible = ref(false);
</script>

<template>
  <div>
    <AppCreateAdminitrative :level-type="props.level" :key-value="search"
      v-model:is-dialog-visible="isCreateDialogVisible" />
    <AppAutocomplete v-model:search="search" v-model="model" closable-chips clearable :items="computedItems"
      item-title="title" item-value="value" :label="props.lable || t('App.Address')"
      :placeholder="props.placeholder || t('App.Address')">
      <template #append-item>
        <VListItem v-if="props.allowCreate && showAddNew" @click="addNewItem">
          <template #title>
            <span class="text-warning font-weight-medium">
              <VIcon @click="addNewItem" icon="mdi-plus" size="16" />
              {{ props.addnewlable || t('App.AddNewAddress') }} "{{ search }}"
            </span>
          </template>
        </VListItem>
      </template>
    </AppAutocomplete>
  </div>
</template>
