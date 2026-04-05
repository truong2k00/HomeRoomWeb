<script setup>
defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  prevText: {
    type: String,
    default: 'Previous',
  },
  nextText: {
    type: String,
    default: 'Next',
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <VPagination
    :model-value="modelValue"
    :length="length || 1"
    :total-visible="Math.min(5, length || 1)"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #prev="slotProps">
      <VBtn
        variant="tonal"
        color="default"
        v-bind="slotProps"
        :icon="false"
      >
        {{ prevText }}
      </VBtn>
    </template>

    <template #next="slotProps">
      <VBtn
        variant="tonal"
        color="default"
        v-bind="slotProps"
        :icon="false"
      >
        {{ nextText }}
      </VBtn>
    </template>
  </VPagination>
</template>
