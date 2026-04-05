<script lang="ts" setup>
import { computed, onMounted, ref, useAttrs, watch } from 'vue'
import { VLabel, VSelect } from 'vuetify/components'
import roleAuthenticationApi from '@/Api/authen/roleAuthenticationApi'
import type { RoleDTO } from '@/models/Role&UserAbility/RoleDTO'

// Nhận props và emit sự kiện
const props = defineProps<{
  modelValue: string | string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[]): void
}>()

// computed để liên kết với v-model
const modelValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val), // Cập nhật khi giá trị thay đổi
})

const keyword = ref('')
const dataRole = ref<RoleDTO[]>([])

const loadRole = () => {
  roleAuthenticationApi.get(keyword.value)
    .then(res => dataRole.value = res)
    .catch(err => console.error('Lỗi khi load role:', err))
}

onMounted(() => {
  loadRole()
})

// Theo dõi thay đổi giá trị
watch(modelValue, newVal => {
  modelValue.value = newVal
  emit('update:modelValue', modelValue.value)
})

const attrs = useAttrs()
const label = computed(() => attrs.label as string | undefined)

const elementId = computed(() => {
  const _elementIdToken = attrs.id || attrs.label

  return _elementIdToken ? `app-select-${_elementIdToken}-${Math.random().toString(36).slice(2, 7)}` : undefined
})
</script>

<template>
  <div
    class="app-select flex-grow-1"
    :class="$attrs.class"
  >
    <VLabel
      v-if="label"
      :for="elementId"
      class="mb-1 text-body-2 text-high-emphasis"
      :text="label"
    />

    <VSelect
      :id="elementId"
      v-model="modelValue"
      :items="dataRole"
      item-title="roleName"
      item-value="id"
      :multiple="Array.isArray(modelValue)"
      variant="outlined"
      :clearable="$attrs.clearable !== undefined"
      v-bind="{ ...$attrs, class: null, label: undefined }"
      :menu-props="{
        contentClass: [
          'app-inner-list',
          'app-select__content',
          'v-select__content',
          $attrs.multiple !== undefined ? 'v-list-select-multiple' : '',
        ],
      }"
    >
      <template
        v-for="(_, name) in $slots"
        #[name]="slotProps"
      >
        <slot
          :name="name"
          v-bind="slotProps || {}"
        />
      </template>
    </VSelect>
  </div>
</template>
