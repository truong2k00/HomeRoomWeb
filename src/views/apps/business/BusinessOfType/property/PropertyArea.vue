<script setup lang="ts">
import type { PropertyArea } from "./types";

const props = defineProps<{
  formData: PropertyArea;
  next: boolean;
}>();

const propertyArearef = ref();

const emit = defineEmits<{
  (e: "update:formData", value: PropertyArea): void;
  (e: "update:next-step", value: boolean): void;
}>();

const nextStep = async () => {
  const { valid } = await propertyArearef.value!.validate();
  console.log(valid);

  if (valid) {
    emit("update:next-step", true);
  }
};

watch(
  () => props.next,
  (val) => {
    if (val) {
      // validate hoặc hành động khi parent trigger next
      nextStep(); // ví dụ
    }
  }
);

const formData = ref<PropertyArea>(props.formData);

watch(formData, () => {
  emit("update:formData", formData.value);
});
</script>

<template>
  <VForm ref="propertyArearef">
    <VRow>
      <VCol cols="12" sm="6">
        <!-- 👉 Total Area -->
        <AppTextField
          v-model="formData.totalArea"
          label="Total Area"
          suffix="sq-ft"
          type="number"
          placeholder="1000"
        />
      </VCol>
      <VCol cols="12" sm="6">
        <!-- 👉 Carpet Area -->
        <AppTextField
          v-model="formData.carpetArea"
          label="Carpet Area"
          suffix="sq-ft"
          type="number"
          placeholder="800"
        />
      </VCol>
      <VCol cols="12" sm="6">
        <!-- 👉 Plot Area -->
        <AppTextField
          v-model="formData.plotArea"
          label="Plot Area"
          suffix="sq-ft"
          type="number"
          placeholder="800"
        />
      </VCol>
      <VCol cols="12" sm="6">
        <!-- 👉 Available From -->
        <AppDateTimePicker
          v-model="formData.availableFrom"
          label="Available From"
          type="date"
          format="YYYY-MM-DD"
        />
      </VCol>
      <VCol cols="12" sm="6">
        <!-- 👉 Possession Status -->
        <VRadioGroup v-model="formData.possessionStatus">
          <template #label>
            <div class="text-high-emphasis">Possession Status</div>
          </template>
          <VRadio
            value="Under Construciton"
            label="Under Construction"
            class="ms-2"
          />
          <VRadio value="Ready to Move" label="Ready to Move" class="ms-2" />
        </VRadioGroup>
      </VCol>
      <VCol cols="12" sm="6">
        <!-- 👉 Transaction Type -->
        <VRadioGroup v-model="formData.transactionType">
          <template #label>
            <div class="text-high-emphasis">Transaction Type</div>
          </template>
          <VRadio value="New Property" label="New Property" class="ms-2" />
          <VRadio value="Resale" label="Resale" class="ms-2" />
        </VRadioGroup>
      </VCol>
      <VCol cols="12" sm="6">
        <!-- 👉 property Location -->
        <VRadioGroup v-model="formData.isOnMainRoad">
          <template #label>
            <div class="text-high-emphasis">Is Property Facing Main Road?</div>
          </template>
          <VRadio value="Yes" label="Yes" class="ms-2" />
          <VRadio value="No" label="No" class="ms-2" />
        </VRadioGroup>
      </VCol>
      <VCol cols="12" sm="6">
        <!-- 👉 Gated Colony -->
        <VRadioGroup v-model="formData.isGatedColony">
          <template #label>
            <div class="text-high-emphasis">Gated Colony</div>
          </template>
          <VRadio value="Yes" label="Yes" class="ms-2" />
          <VRadio value="No" label="No" class="ms-2" />
        </VRadioGroup>
      </VCol>
    </VRow>
  </VForm>
</template>
