<!-- eslint-disable vue/no-mutating-props -->
<script setup lang="ts">
import BusinessTypeApi from "@/Api/Business/BusinessType";
import { BusinessTypeResDTO } from "@/models/Admin/BusinessDTO";
import PayTypeApi from "@/Api/Business/PayTypeBusiness";
import {
  BusinessTypeEnum,
  TypeGet,
} from "../../../../Common/enum/BusinessType";
import {
  PayTypeBusinessDTO,
  PayTypeBusinessDTORes,
} from "@/models/PayTypeBusiness/PayTypeBusinessDTO";

interface Props {
  id: string;
  businessId: string;
  typeBusinessId: string[];
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{
  (e: "removeItem", value: string | null): void;
  (e: "updateId", value: string | null, newvalue: string | null): void;
  (e: "totalAmount", value: number | null): void;
}>();
const itemsOptions = ref<BusinessTypeResDTO[]>([]);

const getdataTypeBusiness = async () => {
  BusinessTypeApi.GetAll()
    .then((res) => {
      itemsOptions.value = res;
      if (props.id === "") {
        const idnew = itemsOptions.value.find(
          (x) => !props.typeBusinessId.includes(x.id)
        )?.id;
        if (idnew) {
          id.value = idnew;
        } else emit("removeItem", id.value);
      } else {
        id.value = props.id;
      }
    })
    .catch((err) => {});
};

const loadItemOptions = async () => {
  await BusinessTypeApi.GetAll()
    .then((res) => {
      itemsOptions.value = res;
      if (props.id === "") {
        const idnew = itemsOptions.value.find(
          (x) => !props.typeBusinessId.includes(x.id)
        )?.id;
        if (idnew) {
          id.value = idnew;
        } else emit("removeItem", id.value);
      } else {
        id.value = props.id;
      }
      updatedata();
    })
    .catch((err) => {});
};

const updatedata = () => {
  data.value = itemsOptions.value.find((x) => x.id === id.value);
};

const removeItem = () => {
  emit("removeItem", props.id);
};

const id = ref("");
const qty = ref(0);
const sumamount = ref(0);
const data = ref<BusinessTypeResDTO>();
const paytypeId = ref("");
const PayTypeData = ref<PayTypeBusinessDTORes>();

watch(
  () => id.value,
  (newId) => {
    updatedata();
  },
  { immediate: true }
); // { immediate: true } will run this logic right away

watch(
  () => paytypeId.value,
  async (newId) => {
    try {
      const res = await PayTypeApi.GetById(id.value, newId);
      PayTypeData.value = res;
    } catch (error) {
      console.error("Lỗi khi gọi PayTypeApi.GetById:", error);
    }
  },
  { immediate: true }
);

watch(
  () => [qty.value, PayTypeData.value?.price],
  ([newQty, newPrice]) => {
    if (qty.value <= 0) {
      qty.value = 0;
    }
    sumamount.value = (newQty || 0) * (newPrice || 0);
  },
  { immediate: true }
);

watch(
  () => props.id,
  (newId) => {
    updatedata();
  },
  { immediate: true }
); // { immediate: true } will run this logic right away

const updatemdvalue = (val: any) => {
  emit("updateId", props.id, id.value);
};

onMounted(() => {
  loadItemOptions();
});
</script>

<template>
  <div>
    <!-- eslint-disable vue/no-mutating-props -->

    <VCard flat border class="d-flex flex-row">
      <!-- 👉 Left Form -->
      <div class="pa-5 flex-grow-1">
        <VRow>
          <VCol cols="12" md="6">
            <AppSelectBusinessType
              v-model="id"
              :items="itemsOptions"
              item-title="name"
              item-value="id"
              label="Select Item"
              class="mb-3"
            />

            <AppTextarea
              rows="2"
              :v-model="data?.description || ''"
              label="Description"
              placeholder="Description"
            />
          </VCol>

          <VCol cols="12" md="2" sm="4">
            <AppSelectPayType
              v-model="paytypeId"
              :business-type-id="data?.id || ''"
              v-on:update:model-value="updatemdvalue"
              type="string"
              label="Pay Type"
            />

            <div class="text-body-2 text-no-wrap mt-4">
              <p class="mb-1">Discount</p>

              <span>0%</span>

              <span class="mx-2">
                0%
                <VTooltip activator="parent">Tax 1</VTooltip>
              </span>

              <span>
                0%
                <VTooltip activator="parent">Tax 2</VTooltip>
              </span>
              <br />
              <p class="mb-1">Discount</p>
              <span>0%</span>

              <span class="mx-2">
                0%
                <VTooltip activator="parent">Tax 1</VTooltip>
              </span>

              <span>
                0%
                <VTooltip activator="parent">Tax 2</VTooltip>
              </span>
            </div>
          </VCol>

          <VCol cols="12" md="2" sm="4">
            <AppTextField v-model="qty" type="number" label="Qty" />
            <div class="text-body-2 text-no-wrap mt-4">
              <p class="mb-1">Type</p>
              <span class="mx-2">
                <span class="text-body-1">
                  {{
                    TypeGet(data?.type || BusinessTypeEnum.renal).value
                  }}</span
                >
                <VTooltip activator="parent">{{
                  TypeGet(data?.type || BusinessTypeEnum.renal).value
                }}</VTooltip>
              </span>
            </div>
          </VCol>

          <VCol cols="12" md="2" sm="4" class="d-flex flex-column justify-end">
            <p class="my-2 text-truncate">
              <span class="d-inline d-md-none">Price: </span>
              <span class="text-body-1 text-truncate d-inline-block w-100">
                ${{ PayTypeData?.price || 0 }}
              </span>
              <VTooltip activator="parent">{{
                PayTypeData?.price || 0
              }}</VTooltip>
            </p>
            <p class="my-2 mt-auto d-flex text-truncate">
              <span class="d-inline d-md-block">Price: </span>
              <span class="text-body-1 text-truncate d-inline-block w-100">
                ${{ $formatCurrency(sumamount) }}
              </span>
              <VTooltip activator="parent">{{
                $formatCurrency(sumamount)
              }}</VTooltip>
            </p>
          </VCol>
        </VRow>
      </div>

      <!-- 👉 Item Actions -->
      <div class="d-flex flex-column justify-space-between border-s pa-1">
        <IconBtn @click="removeItem()">
          <VIcon color="error" size="20" icon="tabler-x" />
          <VTooltip activator="parent" location="top"> Delete </VTooltip>
        </IconBtn>
        <IconBtn hover="Save" @click="">
          <VIcon color="primary" size="20" icon="tabler-device-floppy" />
          <VTooltip activator="parent" location="top"> Save </VTooltip>
        </IconBtn>

        <IconBtn>
          <VIcon color="info" size="20" icon="tabler-settings" />
        </IconBtn>
      </div>
    </VCard>
  </div>
</template>
