<script setup lang="ts">
import TypeApi from '@/Api/Business/BusinessType'
import Api from '@/Api/Business/PayTypeBusiness'
import { getBusinessTypes } from '@/Common/enum/BusinessType'
import { PayCodeEnum, PayPackageEnum } from '@/Common/enum/Pay/PayCode'
import type { BusinessTypeDTO, BusinessTypeResDTO } from '@/models/Admin/BusinessDTO'
import type { PayTypeBusinessDTO, PayTypeBusinessDTORes } from '@/models/PayTypeBusiness/PayTypeBusinessDTO'
import InvoiceProductEdit from '@/views/apps/business/EditPayType/index.vue'

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'update:typeBusiness', value: BusinessTypeResDTO): void
}

const props = withDefaults(defineProps<Props>(), {
  typeBusiness: () => ({
    id: '',
    name: '',
    type: 0,
    description: '',
    createAt: new Date(),
  }),
})

const emit = defineEmits<Emit>()

const editor = ref(false)

interface Props {
  typeBusiness?: BusinessTypeResDTO
  isDialogVisible: boolean
}

const removeProduct = (id: string) => {
  Api.Delete(id)
    .then(res => {
      if (res)
        invoiceData.value = invoiceData.value.filter(x => x.id !== id)
    })
    .catch(err => {
      console.log(err)
    })
}

const addItem = () => {
  const datanew = {
    id: '',
    businessTypeId: props.typeBusiness.id,
    free: false,
    maximum: 10,
    package: PayPackageEnum.Basic,
    payCode: PayCodeEnum.Monthly,
    price: 0,
  } as PayTypeBusinessDTO

  Api.CreateOrUpdate(datanew)
    .then(res => {
      invoiceData.value.push(res)
    })
    .catch(err => {
      console.log(err)
    })
}

const loadData = (id: string) => {
  Api.GetAll(id)
    .then(res => {
      invoiceData.value = res
    })
}

const invoiceData = ref<PayTypeBusinessDTO[]>([])

const cardDetails = ref<BusinessTypeResDTO>(structuredClone(toRaw(props.typeBusiness)))
const createData = ref<BusinessTypeDTO>()

// Watch for changes in props and update cardDetails accordingly
watch(props, () => {
  cardDetails.value = structuredClone(toRaw(props?.typeBusiness))
  editor.value = !!cardDetails.value.name
  if (editor.value)
    loadData(cardDetails.value.id)
})

// Convert Date to yyyy-MM-dd format
const formattedCreateAt = computed({
  get() {
    let date = cardDetails.value.createAt

    // Nếu là string, parse thành Date
    if (typeof date === 'string')
      date = new Date(date)

    if (date instanceof Date && !isNaN(date.getTime()))
      return date.toISOString().split('T')[0] // yyyy-MM-dd

    return ''
  },
  set(value: string) {
    cardDetails.value.createAt = new Date(value)
  },
})

const formSubmit = () => {
  if (cardDetails.value.id) {
    emit('update:typeBusiness', cardDetails.value) // 👉 cập nhật
    resetCardDetails()
  }
  else {
    createData.value = {
      ...cardDetails.value,
    }
    TypeApi.Create(createData.value)
      .then(res => {
        cardDetails.value = res
        emit('update:typeBusiness', res)
        resetCardDetails()
      })
      .catch()
  }
  emit('update:isDialogVisible', false)
}

const resetCardDetails = () => {
  cardDetails.value = {
    id: '',
    name: '',
    type: 0,
    description: '',
    createAt: new Date(),
  }
  editor.value = false
}

const save = ($event: PayTypeBusinessDTORes) => {
  const query = { ...$event } as PayTypeBusinessDTO

  Api.CreateOrUpdate(query)
    .then(res => {
      invoiceData.value = invoiceData.value.filter(x => x.id !== query.id)
      invoiceData.value.push(res)
    })
}

const dialogModelValueUpdate = (val: boolean) => {
  emit('update:isDialogVisible', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 580"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-5 pa-sm-8">
      <!-- 👉 Title -->
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 font-weight-medium mb-3">
          {{ props.typeBusiness.id ? 'Edit Card' : 'Add New Card' }}
        </VCardTitle>
        <p class="mb-0">
          {{ props.typeBusiness.id ? 'Edit your saved card details' : 'Add your saved card details' }}
        </p>
      </VCardItem>

      <VCardText class="pt-6">
        <VForm @submit.prevent="formSubmit">
          <VRow>
            <!-- 👉 Name -->
            <VCol cols="12">
              <AppTextField
                v-model="cardDetails.name"
                label="Name"
                type="text"
              />
            </VCol>
            <!-- 👉 Description -->

            <VCol cols="12">
              <AppTextarea
                v-model="cardDetails.description"
                label="Description"
              />
            </VCol>

            <!-- 👉 Date -->
            <VCol cols="8">
              <AppTextField
                v-show="props.typeBusiness.id ? true : false"
                v-model="formattedCreateAt"
                type="date"
                label="Date"
                min="1900-01-01"
                max="2030-12-31"
                disabled
              />
            </VCol>
            <VCol cols="4">
              <AppSelect
                v-model="cardDetails.type"
                :items="getBusinessTypes()"
                item-title="value"
                item-value="key"
                label="Type"
              />
            </VCol>

            <!-- 👉 Actions -->
            <VCol
              cols="12"
              class="text-center"
            >
              <VBtn
                class="me-3"
                type="submit"
              >
                Submit
              </VBtn>
              <VBtn
                color="secondary"
                variant="tonal"
                @click="$emit('update:isDialogVisible', false)"
              >
                Cancel
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardText class="add-products-form">
        <div
          v-for="(product, index) in invoiceData"
          :key="product.businessTypeId"
          class="my-4 ma-sm-4"
        >
          <InvoiceProductEdit
            :id="index"
            business-type-id="ss"
            :data="product"
            @save="save"
            @remove-product="removeProduct"
          />
        </div>

        <div class="mt-4 ma-sm-4">
          <VBtn @click="addItem">
            Add Item
          </VBtn>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>
