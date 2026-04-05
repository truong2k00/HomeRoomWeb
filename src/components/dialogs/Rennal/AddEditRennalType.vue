<script setup lang="ts">
import RenalTypeAPI from '@/Api/Business/Renal/RenalTypeAPI';
import { RenalTypeDTO } from '@/models/Business/Renal/RenalTypeDTO'



const props = defineProps<{
  isDialogVisible: boolean
  data?: RenalTypeDTO
}>()

const emit = defineEmits<{
  (e: 'add:data', val: RenalTypeDTO): void
  (e: 'update:isDialogVisible', val: boolean): void
  (e: 'updatedData', val: RenalTypeDTO): void
}>()

// dữ liệu mặc định
const defaultData: RenalTypeDTO = {
  id: '',
  name: '',
  tablerIcon: 'new-section',
  color: 'secondary',
}

// state local
const formData = reactive<RenalTypeDTO>({
  ...defaultData,
  ...props.data,
})

watch(
  () => props.data,
  val => {
    Object.assign(formData, defaultData, val)
  },
  { immediate: true },
)

const isDialogVisibleIcon = ref(false)

const submit = async () => {
  if (formData.id === '') {
    await RenalTypeAPI.Create(formData).then((res) => {
      emit("add:data", res);
    }).catch((err) => {
      console.error(err);
    })
  }
  else {
    await RenalTypeAPI.Update(formData).then((res) => {
      emit("updatedData", res);
    }).catch((err) => {
      console.error(err);
    })
  }
  emit('update:isDialogVisible', false)
}

const dialogVisibleUpdate = (val: boolean) => {
  emit('update:isDialogVisible', val)
}
</script>
<template>

  <IconSelectDialog v-model="formData.tablerIcon" v-model:color-value="formData.color"
    v-model:is-dialog-visible="isDialogVisibleIcon" />
  <VDialog :model-value="props.isDialogVisible" max-width="900" @update:model-value="dialogVisibleUpdate">
    <!-- 👉 dialog close btn -->
    <DialogCloseBtn size="small" @click="emit('update:isDialogVisible', false)" />
    <VCard class="create-app-dialog">
      <VCardText class="pa-5 pa-sm-10">
        <h5 class="text-h5 text-center mb-2">
          {{ props.data ? "Update" : "Create" }} App
        </h5>
        <p class="text-sm text-center mb-8">
          Provide data with this form to create your app.
        </p>

        <VAvatar :color="formData.color" variant="tonal" size="34" rounded class="cursor-pointer"
          @click="isDialogVisibleIcon = true">
          <VIcon :icon="'tabler-' + formData.tablerIcon" />
        </VAvatar>

        {{ formData.name }}

        <AppTextField v-model="formData.name" label="Application Name" />
      </VCardText>
      <VCardText class="d-flex align-center justify-center gap-2">
        <VBtn @click="submit" variant="elevated">
          Confirm
        </VBtn>

        <VBtn color="secondary" variant="tonal" @click="dialogVisibleUpdate(false)">
          Cancel
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.stepper-content .card-list {
  --v-card-list-gap: 24px;
}
</style>
