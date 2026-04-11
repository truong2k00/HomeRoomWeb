<script lang="ts" setup>
import AdministrativeUnitAPI, { AdministrativeUnitLevelParamsAll, AdministrativeUnitParamsAll } from "@/Api/addressDetail/AdministrativeUnitAPI";
import { AdminLevelType } from "@/Common/enum/country/AdministrativeUnitEnum";
import { computed, defineEmits, onMounted, ref, useAttrs } from "vue";
// Props
const props = defineProps<{
  items?: { key: string; value: string }[];
  level: AdminLevelType;
  countrysId: number;
  parentId?: string
}>();

// Emits
const emit = defineEmits<{
  (e: "update:modelValue", value: string | null): void;
}>();

// Items
const items = ref<{ key: string; value: string }[]>([]);

// Load data
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
      console.error(error);
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
      console.error(error);
    }
  }
};

// Mount
onMounted(async () => {
  if (!props.items) await loadData();
  else {
    items.value = props.items.map((i) => ({
      key: i.key,
      value: i.value, // chỉ lấy en để hiển thị
    }));
  }
});

watch(
  () => [props.countrysId, props.parentId],
  (newValue, val) => {
    if (!props.items) loadData();
    else {
      items.value = props.items.map((i) => ({
        key: i.key,
        value: i.value, // chỉ lấy en để hiển thị
      }));
    }
    loadData();
  }
);

// Computed
const computedItems = computed(() => {
  return items.value.map((item) => ({
    title: item.value,
    value: item.key,
  }));
});

// Label & ID
const label = computed(() => useAttrs().label as string | undefined);

const elementId = computed(() => {
  const attrs = useAttrs();
  const _token = attrs.id || attrs.label;

  return _token
    ? `app-select-${_token}-${Math.random().toString(36).slice(2, 7)}`
    : undefined;
});

// Model binding
const modelValue = computed<string | null>({
  get() {
    const val = useAttrs().modelValue;
    const keyList = items.value.map((i) => i.key);
    return typeof val === "string" && keyList.includes(val) ? val : null;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const handleModelChange = (newValue: string | null) => {
  modelValue.value = newValue;
};
</script>

<template>
  <div class="app-select flex-grow-1" :class="$attrs.class">
    <VLabel v-if="label" :for="elementId" class="mb-1 text-body-2 text-high-emphasis" :text="label" />
    <VSelect ref="vSelectRef" v-bind="{
      ...$attrs,
      class: null,
      label: undefined,
      items: computedItems,
      itemTitle: 'title',
      itemValue: 'value',
      variant: 'outlined',
      id: elementId,
      searchable: true,
      modelValue,
      menuProps: {
        contentClass: [
          'app-inner-list',
          'app-select__content',
          'v-select__content',
          $attrs.multiple !== undefined ? 'v-list-select-multiple' : '',
        ],
      },
    }" @update:modelValue="handleModelChange">
      <template v-for="[name, fn] in Object.entries($slots)" :key="name">
        <slot :name="name" v-bind="fn ? fn() : {}" />
      </template>
    </VSelect>
  </div>
</template>
