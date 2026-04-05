<script lang="ts" setup>
import { computed, useAttrs } from "vue";

// Định nghĩa tên component và tắt kế thừa attrs tự động
defineOptions({
  name: "AppSelect",
  inheritAttrs: false,
});

// Nhận props và emit
const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

// computed liên kết v-model
const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// Gán nhãn và ID tự động
const attrs = useAttrs();
const label = computed(() => attrs.label as string | undefined);
const elementId = computed(() => {
  const token = attrs.id || attrs.label || "select";
  return `app-select-${token}-${Math.random().toString(36).slice(2, 7)}`;
});
</script>

<template>
  <div>
    <div class="app-select flex-grow-1" :class="$attrs.class">
      <VLabel
        v-if="label"
        :for="elementId"
        class="mb-1 text-body-2 text-high-emphasis"
        :text="label"
      />

      <VSelect
        v-model="modelValue"
        :id="elementId"
        variant="outlined"
        v-bind="{
          ...$attrs,
          class: null,
          label: undefined,
          menuProps: {
            contentClass: [
              'app-inner-list',
              'app-select__content',
              'v-select__content',
              $attrs.multiple !== undefined ? 'v-list-select-multiple' : '',
            ],
          },
        }"
      >
        <template v-for="(_, name) in $slots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps || {}" />
        </template>
      </VSelect>
    </div>
  </div>
</template>
