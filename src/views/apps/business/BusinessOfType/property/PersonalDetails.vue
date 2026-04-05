<script setup lang="ts">
import type { PayTypeBusinessDTORes } from "@/models/PayTypeBusiness/PayTypeBusinessDTO";
import type { TypeOfBusinessDTO } from "@/models/TypeOfBusiness/TypeOfBusinessDTO";

const props = defineProps<{
  formData: PayTypeBusinessDTORes[];
  businessId: string;
  businessTypeId: string;
}>();

const emit = defineEmits<{
  (e: "update:v-win-pay", value: boolean): void;
  (e: "update:fromdata", value: TypeOfBusinessDTO): void;
}>();

const formquery = ref<TypeOfBusinessDTO>({
  businessId: "",
  businessTypeId: "",
  payTypeBusinessId: "",
});

onMounted(() => {
  formquery.value.businessId = props.businessId;
  formquery.value.businessTypeId = props.businessTypeId;
  formquery.value.payTypeBusinessId = props.formData[0].id;
  emit("update:fromdata", formquery.value);
});

const changeSubmit = (id: string) => {
  const record = props.formData.find((p) => p.id === id);
  if (record?.free === true) {
    emit("update:v-win-pay", false);
  } else {
    emit("update:v-win-pay", true);
  }
};
const updatePackage = (val: any) => {
  changeSubmit(val);
  formquery.value.businessId = props.businessId;
  formquery.value.payTypeBusinessId = val;
  formquery.value.businessTypeId = props.businessTypeId;
  emit("update:fromdata", formquery.value);
};

// watch(formData, () => {
//   emit('update:formData', formData.value)
// })
</script>

<template>
  <div>
    <VForm>
      <VRow>
        <VCol cols="12">
          <!-- 👉 User Type  -->
          <CustomRadiosWithIconPayType
            :model-value="null"
            :options="props.formData"
            :grid-column="{ cols: '12', sm: '4' }"
            @update:model-value="updatePackage"
          />
        </VCol>
      </VRow>
    </VForm>
  </div>
</template>
