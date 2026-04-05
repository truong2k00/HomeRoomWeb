<script setup lang="ts">
import Api from '@/Api/Business/PayTypeBusiness'
import { PayCodeEnum, PayPackageEnum } from '@/Common/enum/Pay/PayCode'
import type { BusinessTypeResDTO } from '@/models/Admin/BusinessDTO'
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

// Watch for changes in props and update cardDetails accordingly
watch(props, () => {
  cardDetails.value = structuredClone(toRaw(props?.typeBusiness))
  editor.value = !!cardDetails.value.name
  if (editor.value)
    loadData(cardDetails.value.id)
})

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
  </VDialog>
</template>
