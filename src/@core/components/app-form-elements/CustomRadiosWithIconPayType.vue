<script lang="ts" setup>
import type { GridColumn } from "@/@core/types";
import { GetByPackage } from "@/Common/enum/Pay/PayCode";
import type { PayTypeBusinessDTORes } from "@/models/PayTypeBusiness/PayTypeBusinessDTO";

const props = defineProps<{
  modelValue: string | null;
  options: PayTypeBusinessDTORes[];
  gridColumn?: GridColumn;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const selected = ref(props.modelValue || "");

watch(
  () => props.options,
  (val) => {
    selected.value = props.modelValue ?? val[0]?.id ?? "";
  },
  { immediate: true }
);

watch(
  () => props.modelValue,
  (val) => {
    selected.value = val || props.options[0]?.id || "";
  },
  { immediate: true }
);

const colsPerItem = computed(() => {
  return props.options.length > 3 ? 4 : 12; // If more than 3 items, each takes 4 columns, otherwise 12
});

const colsPerItemSm = computed(() => {
  return props.options.length > 3 ? 4 : 6; // For small screen, adjust to 6 for more than 3 items
});

// Class for row depending on the number of items
const rowClass = computed(() => {
  if (props.options.length > 3) return ""; // Default behavior: no specific class needed for more than 3 items

  // For less than 3 items, we center them
  return "justify-center";
});

watch(selected, (val) => {
  if (val !== props.modelValue) emit("update:modelValue", val);
});
</script>

<template>
  <div>
    <VRadioGroup v-if="props.options" v-model="selected">
      <VRow :class="rowClass">
        <VCol
          v-for="item in props.options"
          :key="item.id"
          :cols="colsPerItem"
          :sm="colsPerItemSm"
          v-bind="gridColumn"
        >
          <VLabel
            class="custom-input custom-radio-icon rounded cursor-pointer"
            :class="{ active: selected === item.id }"
          >
            <slot :item="item">
              <div class="d-flex flex-column align-center text-center gap-2">
                <VIcon
                  v-bind="GetByPackage(item.package)?.icon"
                  class="text-high-emphasis"
                />
                <h6 class="cr-title text-base">
                  {{ GetByPackage(item.package)?.text }}
                </h6>

                <p class="text-sm mb-0 clamp-text">
                  {{
                    item.free ? "Miễn phí" : `${item.price.toLocaleString()}₫`
                  }}
                </p>
                <p class="text-sm mb-0 clamp-text">
                  {{ item.maximum }}
                </p>
              </div>
            </slot>

            <div>
              <VRadio :value="item.id" />
            </div>
          </VLabel>
        </VCol>
      </VRow>
    </VRadioGroup>
  </div>
  <!--
    <VRadioGroup v-if="props.radioContent" v-model="selectedOption">
    <VRow>
    <VCol v-for="item in props.radioContent" :key="item.title" v-bind="gridColumn">
    <VLabel class="custom-input custom-radio-icon rounded cursor-pointer"
    :class="selectedOption === item.value ? 'active' : ''">
    <slot :item="item">
    <div class="d-flex flex-column align-center text-center gap-2">
    <VIcon v-bind="item.icon" class="text-high-emphasis" />
    <h6 class="cr-title text-base">
    {{ item.title }}
    </h6>

    <p class="text-sm mb-0 clamp-text">
    {{ item.desc }}
    </p>
    </div>
    </slot>

    <div>
    <VRadio :value="item.value" />
    </div>
    </VLabel>
    </VCol>
    </VRow>
    </VRadioGroup>
  -->
</template>

<style lang="scss" scoped>
.custom-radio-icon {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  .v-radio {
    margin-block-end: -0.25rem;
  }

  .cr-title {
    font-weight: 500;
  }
}
</style>

<style lang="scss">
.custom-radio-icon {
  .v-radio {
    margin-block-end: -0.25rem;

    .v-selection-control__wrapper {
      margin-inline-start: 0;
    }
  }
}
</style>
