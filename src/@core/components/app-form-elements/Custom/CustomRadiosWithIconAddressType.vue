<script lang="ts" setup>
import {
  AddressTypeEnum,
  getAddressType,
  getAddressTypes,
} from "@/Common/enum/AddressType";
import type { CustomInputContent, GridColumn } from "@core/types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface Props {
  selectedRadio: AddressTypeEnum;
  gridColumn?: GridColumn;
}

interface Emit {
  (e: "update:selectedRadio", value?: AddressTypeEnum): void;
}

const props = defineProps<Props>();

const radioContent = getAddressTypes();

const emit = defineEmits<Emit>();

const selectedOption = ref(getAddressType(props.selectedRadio));

watch(
  () => props.selectedRadio,
  (newValue) => {
    selectedOption.value = getAddressType(newValue);
  }
);

watch(selectedOption.value, () => {
  emit("update:selectedRadio", selectedOption.value?.key);
});

const address = "App.address.";
</script>

<template>
  <VRadioGroup v-if="radioContent" v-model="selectedOption.key">
    <VRow>
      <VCol v-for="item in radioContent" :key="item.key" v-bind="gridColumn">
        <VLabel
          class="custom-input custom-radio-icon rounded cursor-pointer"
          :class="selectedOption?.key === item.key ? 'active' : ''"
        >
          <slot :item="item">
            <div class="d-flex flex-column align-center text-center gap-2">
              <VIcon v-bind="item.icon" class="text-high-emphasis" />
              <h6 class="cr-title text-base">
                {{ t(address + item.title) }}
              </h6>

              <p class="text-sm mb-0 clamp-text">
                {{ t(address + item.desc) }}
              </p>
            </div>
          </slot>

          <div>
            <VRadio :value="item.key" />
          </div>
        </VLabel>
      </VCol>
    </VRow>
  </VRadioGroup>
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
