<script setup lang="ts">
import SettingSystem from '@/Api/Setting/SettingSystem'
import { ref, watch } from 'vue'

const icons = ref<any[]>([])
const result = ref<any[]>([])
const visibleIcons = ref<any[]>([])

const keyword = ref("")
const loading = ref(false)

const pageSize = 35
const page = ref(1)

interface Props {
  modelValue?: string
  colorValue?: string | "secondary"
  isDialogVisible: boolean
}

interface Emit {
  (e: 'update:modelValue', value: string): void
  (e: 'update:colorValue', value: string): void
  (e: 'update:isDialogVisible', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

// mở / đóng dialog
const updateDialog = (val: boolean) => {
  emit('update:isDialogVisible', val)
}

const updateColor = (val: string) => {
  emit('update:colorValue', val)
}
// chọn icon
const updateIcon = (val: string) => {
  emit('update:modelValue', val)
  emit('update:isDialogVisible', false)
}

// load icon khi mở dialog
watch(() => props.isDialogVisible, async (val) => {

  if (!val) return

  loading.value = true

  if (icons.value.length === 0) {
    const data = await SettingSystem.GetSettingKey("/IconConfigAll/9c707820-4a4b-474d-a6c3-8d95ee85b59b.json")

    icons.value = Object.values(data)
  }

  searchIcon()

  loading.value = false

})

// search icon
const searchIcon = () => {

  const key = keyword.value.toLowerCase()

  result.value = icons.value.filter((x: any) =>
    x.name.toLowerCase().includes(key) ||
    x.tags?.some((t: string) => t.toLowerCase().includes(key))
  )

  page.value = 1
  visibleIcons.value = result.value.slice(0, pageSize)
}

// scroll load thêm
const loadMore = () => {

  const next = page.value + 1
  const start = (next - 1) * pageSize
  const end = next * pageSize

  const more = result.value.slice(start, end)

  if (more.length > 0) {
    visibleIcons.value.push(...more)
    page.value = next
  }
}

// bắt sự kiện scroll
const handleScroll = (e: any) => {

  const bottom =
    e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 20

  if (bottom) {
    loadMore()
  }

}
const color = ref(props.colorValue ?? 'secondary')

watch(
  () => props.colorValue,
  val => {
    color.value = val ?? 'secondary'
  }
)

watch(color, val => {
  emit('update:colorValue', val)
})

const colors = [
  'primary',
  'secondary',
  'error',
  'warning',
  'info',
  'success',
]

</script>

<template>
  <VDialog max-width="700" :model-value="props.isDialogVisible" @update:model-value="updateDialog">
    <VCard>

      <!-- header -->
      <VCardTitle class="d-flex justify-space-between align-center">

        <span>Chọn Icon and Color</span>

        <div class="d-flex align-center gap-2">
          <VAvatar :color="props.colorValue" variant="tonal" size="34" rounded>
            <VIcon :color="props.colorValue" :icon="'tabler-' + props.modelValue" />
          </VAvatar>
          <!-- <VIcon size="24" color="primary" :icon="'tabler-' + props.modelValue" /> -->
          <VSelect v-model="color" :items="colors" density="compact" style="max-width: 120px;">
            <!-- item -->z
            <template #item="{ props, item }">
              <VListItem v-bind="props">
                <template #prepend>
                  <VAvatar :color="item.raw" size="20" />
                </template>
              </VListItem>
            </template>

            <!-- selected -->
            <template #selection="{ item }">
              <VAvatar :color="item.raw" size="20" />
            </template>
          </VSelect>
          <VBtn icon="tabler-x" variant="text" @click="updateDialog(false)" />

        </div>

      </VCardTitle>

      <VCardText>

        <!-- loading -->
        <div v-if="loading" class="text-center pa-10">
          <VProgressCircular indeterminate />
        </div>

        <template v-else>

          <!-- search -->
          <VTextField v-model="keyword" label="Search icon" density="compact" clearable @input="searchIcon" />

          <!-- icon list -->
          <div class="d-flex flex-wrap" style="max-height: 400px; overflow-y: auto;" @scroll="handleScroll">

            <VCard v-for="icon in visibleIcons" :key="icon.name" class="ma-2 cursor-pointer" width="70" height="70"
              :color="icon.name === props.modelValue ? 'primary' : undefined" variant="tonal"
              @click="updateIcon(icon.name)">

              <VCardText class="d-flex align-center justify-center pa-2">
                <VIcon size="28" :icon="'tabler-' + icon.name" />
              </VCardText>

              <VTooltip activator="parent" location="top">
                {{ 'tabler-' + icon.name }}
              </VTooltip>

            </VCard>

          </div>

        </template>

      </VCardText>

    </VCard>
  </VDialog>
</template>
