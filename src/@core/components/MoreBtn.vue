<script lang="ts" setup>
interface Props {
  menuList?: unknown[]
  itemProps?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', value: string): void
}>()

const onItemSelect = (event: any) => {
  emit('select', event)
}
</script>

<template>
  <IconBtn
    density="compact"
    color="disabled"
  >
    <VIcon icon="tabler-dots-vertical" />

    <VMenu
      v-if="props.menuList"
      activator="parent"
    >
      <VList
        :items="props.menuList"
        :item-props="props.itemProps"
        @click:select="onItemSelect"
      />
    </VMenu>
  </IconBtn>
</template>
