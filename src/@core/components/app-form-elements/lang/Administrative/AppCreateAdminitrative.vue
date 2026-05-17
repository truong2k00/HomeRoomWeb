<script setup lang="ts">
import { getProvinceTypeSelect1, getProvinceTypeSelect2, getProvinceTypeSelect3, getProvinceTypeSelect4 } from '@/Common/enum/country/AdministrativeUnitEnum';
import { CreateAdministrativeUnitDTO } from '@/models/Lang/administrativeUnitDTO';

import { useI18n } from "vue-i18n";
const { t } = useI18n();

interface Props {
  keyValue: string;
  levelType: number;
  isDialogVisible: boolean
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'submit', value: any): void
}

const props = defineProps<Props>();

const data = ref<CreateAdministrativeUnitDTO>({
  name: '',
  parentId: undefined,
  type: 0,
  countryId: 0,
})

const emit = defineEmits<Emit>()

const billingAddress = ref<CreateAdministrativeUnitDTO>(structuredClone(toRaw(data.value)))

const resetForm = () => {
  emit('update:isDialogVisible', false)
  billingAddress.value = structuredClone(toRaw(data.value))
}

const onFormSubmit = () => {
  emit('update:isDialogVisible', false)
  emit('submit', billingAddress.value)
}

watch(() => props.isDialogVisible, (newVal) => {
  if (newVal) {
    billingAddress.value = structuredClone(toRaw(data.value));
    data.value.name = props.keyValue;
  }
});

// 👉 có thể refactor lại bằng cách tạo 1 file enum riêng cho phần này
const getTypeLevelSelect = (): {
  value: number;
  title: string;
  color?: string;
}[] => {
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
      return [{ value: 0, title: 'None', color: 'secondary' }];
  }
};
const typeOptions = computed(() => getTypeLevelSelect());

watch(
  typeOptions,
  (list) => {
    if (!list?.length) return;

    // chỉ set khi chưa có giá trị
    if (!data.value.type || data.value.type === 0) {
      data.value.type = list[0].value;
    }
  },
  { immediate: true }
);

const translatedTitle = (item: any) => {
  return t(keyTranslatedTitle(props.levelType) + item.title, "none");
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
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 610" :model-value="props.isDialogVisible"
    @update:model-value="val => $emit('update:isDialogVisible', val)">
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn @click="$emit('update:isDialogVisible', false)" />

    <VCard v-if="data" class="pa-sm-8 pa-5">
      <!-- 👉 Title -->
      <VCardItem>
        <VCardTitle class="text-h4 text-center">
          {{ data ? 'Edit' : 'Add New' }} Address
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Subtitle -->
        <VCardSubtitle class="text-center mb-6">
          <span class="text-base">

            Add new address for express delivery
          </span>
        </VCardSubtitle>

        <!-- 👉 Form -->
        <VForm class="mt-4" @submit.prevent="onFormSubmit">
          <VRow>
            <!-- 👉 Company Name -->
            <VCol cols="12" md="6">
              <AppTextField v-model="data.name" label="Company Name" />
            </VCol>

            <!-- 👉 Email -->
            <VCol cols="12" md="6">
              <AppAutocomplete label="Email" v-model="data.type" :items="getTypeLevelSelect()"
                :item-title="translatedTitle" item-value="value" persistent-hint :menu-props="{ maxHeight: '200px' }">
              </AppAutocomplete>
              <!-- <AppTextField v-model="data.type" label="Email" /> -->
            </VCol>

            <!-- 👉 Submit and Cancel button -->
            <VCol cols="12" class="text-center">
              <VBtn type="submit" class="me-3">
                submit
              </VBtn>

              <VBtn variant="tonal" color="secondary" @click="resetForm">
                Cancel
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
