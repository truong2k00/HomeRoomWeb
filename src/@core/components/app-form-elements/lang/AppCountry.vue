<script lang="ts" setup>
import api from "@/Api/Lang/CountrysApi";
import { computed, defineEmits, onMounted, ref, useAttrs } from "vue";
import { useI18n } from "vue-i18n";

// Props
const props = defineProps<{
  items?: { key: string | number; value: { vi: string; en: string } }[];
}>();

// Emits
const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

// Items
const items = ref<
  { key: string | number; value: { vi: string; en: string } }[]
>([]);

// Load data
const loadData = async () => {
  try {
    const res = await api.GetAll();

    items.value = res.map((item: any) => ({
      key: item.id,
      value: {
        vi: item.vietnamesCountryName,
        en: item.countryName,
      },
    }));
  } catch (error) {
    items.value = loadFallbackItems();
  }
};

// Fallback
const loadFallbackItems = () => [
  { key: 1, value: { vi: "Ấn Độ", en: "India" } },
  { key: 2, value: { vi: "Anh", en: "UK" } },
  { key: 3, value: { vi: "Mỹ", en: "USA" } },
  { key: 4, value: { vi: "Úc", en: "Australia" } },
  { key: 5, value: { vi: "Đức", en: "Germany" } },
];

// Mount
onMounted(async () => {
  if (!props.items) await loadData();
  else items.value = props.items;
});

// I18n
const { locale } = useI18n();

// Computed
const computedItems = computed(() => {
  const lang = (locale.value || "en") as "vi" | "en";

  return items.value.map((item) => ({
    title: item.value[lang] ?? item.value.en,
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
const modelValue = computed<number>({
  get() {
    const val = useAttrs().modelValue;
    const keyList = items.value.map((i) => i.key);

    const valid = typeof val === "number" && keyList.includes(val);
    if (valid) return val;

    // Nếu không hợp lệ, emit giá trị mặc định
    nextTick(() => emit("update:modelValue", 127));
    return 127;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const handleModelChange = (newValue: number) => {
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
