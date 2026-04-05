<script lang="ts" setup>
import { computed, defineEmits, onMounted, ref, useAttrs } from "vue";
import citysApi from "@/Api/Lang/citysApi";
// Props
const props = defineProps<{
  items?: { key: number; value: string }[];
  countrysId: number;
}>();

// Emits
const emit = defineEmits<{
  (e: "update:modelValue", value: number | null): void;
}>();

// Items
const items = ref<{ key: number; value: string }[]>([]);

// Load data
const loadData = async () => {
  if (props.countrysId !== 0) {
    try {
      const res = await citysApi.GetAll(props.countrysId);
      items.value = res.map((item: any) => ({
        key: item.id,
        value: item.cityName,
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
  () => props.countrysId,
  (newValue) => {
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
const modelValue = computed<number | null>({
  get() {
    const val = useAttrs().modelValue;
    const keyList = items.value.map((i) => i.key);
    return typeof val === "number" && keyList.includes(val) ? val : null;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const handleModelChange = (newValue: number | null) => {
  modelValue.value = newValue;
};
</script>

<template>
  <div class="app-select flex-grow-1" :class="$attrs.class">
    <VLabel
      v-if="label"
      :for="elementId"
      class="mb-1 text-body-2 text-high-emphasis"
      :text="label"
    />
    <VSelect
      ref="vSelectRef"
      v-bind="{
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
      }"
      @update:modelValue="handleModelChange"
    >
      <template v-for="[name, fn] in Object.entries($slots)" :key="name">
        <slot :name="name" v-bind="fn ? fn() : {}" />
      </template>
    </VSelect>
  </div>
</template>
