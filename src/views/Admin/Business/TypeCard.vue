<script setup lang="ts">
import typeApi from '@/Api/Business/BusinessType'
import type { BusinessTypeResDTO } from '@/models/Admin/BusinessDTO'
import girlUsingMobile from '@images/pages/girl-using-mobile.png'

const isTypeDialogVisible = ref(false)

const typeBusiness = ref<BusinessTypeResDTO>()

const data = ref<BusinessTypeResDTO[]>([])
const loadings = ref(false)

const loadData = () => {
  loadings.value = true
  typeApi.GetAll()
    .then(res => {
      data.value = res
      loadings.value = false
    })
    .catch(() => {
      loadings.value = false
    })
}

onMounted(() => {
  loadData()
})

const updateData = (updateData: BusinessTypeResDTO) => {
  const index = data.value.findIndex(x => x.id === updateData.id)
  if (index !== -1) {
    // ✅ Nếu tồn tại id → cập nhật
    typeApi.Update(updateData)
      .then(res => {
        if (res === 200) {
          data.value[index] = updateData
          content.value = 'Update successfully.'
          isSnackbarVisible.value = true
        }
        else {
          isSnackbarVisible.value = true
        }
      })
  }
  else {
    // ❌ Nếu không có → thêm mới
    data.value.push(updateData)
  }
}

const isSnackbarVisible = ref(false)
const content = ref('Failure')

const deleteData = (id: string) => {
  typeApi.Delete(id)
    .then(res => {
      if (res === 200) {
        const index = data.value.findIndex(x => x.id === id)
        if (index !== -1) {
          // ✅ Nếu tồn tại id → cập nhật
          data.value = data.value.filter(item => item.id !== id)
        }
        content.value = 'Deleted successfully.'
        isSnackbarVisible.value = true
      }
      else {
        isSnackbarVisible.value = true
      }
    })
}

const isAddRoleDialogVisible = ref(false)

const editPermission = (val: any) => {
  isTypeDialogVisible.value = true
  typeBusiness.value = val
}
</script>

<template>
  <VSnackbar
    v-model="isSnackbarVisible"
    vertical
  >
    {{ content }}
    <template #actions>
      <VBtn
        color="error"
        @click="isSnackbarVisible = false"
      >
        Close
      </VBtn>
    </template>
  </VSnackbar>
  <VProgressLinear
    v-show="loadings"
    indeterminate
    color="primary"
  />
  <VRow>
    <!-- 👉 Roles -->
    <VCol
      v-for="item in data"
      :key="item.id"
      cols="12"
      sm="6"
      lg="4"
    >
      <VCard>
        <VCardText class="d-flex align-center pb-1">
          <span>{{ item.name }}</span>

          <VSpacer />
          <VAvatar
            color="warning"
            icon="tabler-eye-search"
            variant="tonal"
            @click="editPermission(item)"
          />
          <VAvatar
            color="error"
            icon="tabler-trash-off"
            variant="tonal"
            @click="deleteData(item.id)"
          />
        </VCardText>

        <VCardText class="pb-5">
          <span class="text-h4 one-line-ellipsis">
            {{ item.description }}
          </span>
          <div class="d-flex align-center">
            <VSpacer />
            <a
              href="javascript:void(0)"
              @click="editPermission(item)"
            >
              Edit Type
            </a>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 Add New Role -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <VCard
        class="h-100"
        :ripple="false"
        @click="isAddRoleDialogVisible = true"
      >
        <VRow
          no-gutters
          class="h-100"
        >
          <VCol
            cols="5"
            class="d-flex flex-column justify-end align-center mt-5"
          >
            <img
              width="85"
              :src="girlUsingMobile"
            >
          </VCol>

          <VCol cols="7">
            <VCardText
              class="d-flex flex-column align-end justify-end gap-2 h-100"
              style="text-align: end;"
            >
              <VBtn>Add New Type</VBtn>
              <span>Add Type, if it doesn't exist.</span>
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
      <AddEditBusinessType
        v-model:is-dialog-visible="isAddRoleDialogVisible"
        @update:type-business="updateData"
      />
    </VCol>
  </VRow>

  <AddEditBusinessType
    v-model:is-dialog-visible="isTypeDialogVisible"
    v-model:type-business="typeBusiness"
    @update:type-business="updateData"
  />
</template>

<style scoped lang="css">
.one-line-ellipsis {
  display: inline-block;
  overflow: hidden;
  max-inline-size: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
