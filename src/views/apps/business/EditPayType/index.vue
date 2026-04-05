<!-- eslint-disable vue/no-mutating-props -->
<script setup lang="ts">
import { GetPayCode, GetPayPackage, PayCodeEnum, PayPackageEnum } from '@/Common/enum/Pay/PayCode'
import type { PayTypeBusinessDTORes } from '@/models/PayTypeBusiness/PayTypeBusinessDTO'

interface Emit {
  (e: 'removeProduct', value: string): void
  (e: 'totalAmount', value: number): void
  (e: 'save', value: PayTypeBusinessDTORes): void
}

interface Props {
  id: number
  businessTypeId: string
  data: PayTypeBusinessDTORes
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({
    id: '',
    businessTypeId: '',
    free: false,
    maximum: 10,
    package: PayPackageEnum.Basic,
    payCode: PayCodeEnum.Monthly,
    price: 0,
  }),
})

const emit = defineEmits<Emit>()

const itemsOptions: Props['data'][] = []
const selectedItemPayCode = ref(0)
const selectedItemPayPackage = ref(0)
const localProductData = ref(structuredClone(toRaw(props.data)))

watch(selectedItemPayCode, () => {
  const item = itemsOptions.filter(obj => {
    return obj.payCode === selectedItemPayCode.value
  })

  localProductData.value = item[0]
})

watch(selectedItemPayPackage, () => {
  const item = itemsOptions.filter(obj => {
    return obj.package === selectedItemPayPackage.value
  })

  localProductData.value = item[0]
})

const removeProduct = () => {
  emit('removeProduct', localProductData.value.id)
}

const save = () => {
  emit('save', localProductData.value)
}

const totalPrice = computed(() => Number(localProductData.value.price) * Number(localProductData.value.quantity))

watch(totalPrice, () => {
  emit('totalAmount', totalPrice.value)
}, { immediate: true })
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <!--
    <div class="add-products-header mb-4 d-none d-md-flex ps-5 pe-16">
    <VRow class="font-weight-medium">
    <VCol cols="12" md="6">
    <span class="text-base">
    Item
    </span>
    </VCol>

    <VCol cols="12" md="2">
    <span class="text-base">
    Cost
    </span>
    </VCol>

    <VCol cols="12" md="2">
    <span class="text-base">
    Qty
    </span>
    </VCol>

    <VCol cols="12" md="2">
    <span class="text-base">
    Price
    </span>
    </VCol>
    </VRow>
    </div>
  -->

  <VCard
    flat
    border
    class="d-flex flex-row"
  >
    <!-- 👉 Left Form -->
    <div class="pa-5 flex-grow-1">
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <AppSelect
            v-model="localProductData.payCode"
            :items="GetPayCode()"
            item-title="text"
            item-value="value"
            label="Select By"
            class="mb-3"
          />
          <AppTextField
            v-model="localProductData.price"
            type="number"
            label="Price"
          />
        </VCol>

        <VCol
          cols="12"
          md="6"
          sm="8"
        >
          <AppSelect
            v-model="localProductData.package"
            :items="GetPayPackage()"
            item-title="text"
            item-value="value"
            label="Select Package"
            class="mb-3"
          />
          <AppTextField
            v-model="localProductData.maximum"
            type="number"
            label="Maximum"
          />
        </VCol>
        <VSwitch
          v-model="localProductData.free"
          label="free"
          color="primary"
        />
      </VRow>
    </div>

    <!-- 👉 Item Actions -->
    <div class="d-flex flex-column justify-space-between border-s pa-1">
      <IconBtn @click="removeProduct">
        <VIcon
          color="error"
          size="20"
          icon="tabler-x"
        />
        <VTooltip
          activator="parent"
          location="top"
        >
          Delete
        </VTooltip>
      </IconBtn>
      <IconBtn
        hover="Save"
        @click="save"
      >
        <VIcon
          color="primary"
          size="20"
          icon="tabler-device-floppy"
        />
        <VTooltip
          activator="parent"
          location="top"
        >
          Save
        </VTooltip>
      </IconBtn>

      <IconBtn>
        <VIcon
          color="info"
          size="20"
          icon="tabler-settings"
        />
      </IconBtn>
    </div>
  </VCard>
</template>
