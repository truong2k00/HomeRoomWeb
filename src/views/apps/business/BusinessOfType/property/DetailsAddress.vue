<script setup lang="ts">
import { requiredValidator } from "@/@core/utils/validators";
import AddressDetailsApi from "@/Api/addressDetail/addressDetail";
import CountrysApi from "@/Api/Lang/CountrysApi";
import { AddressTypeEnum } from "@/Common/enum/AddressType";
import { AdminLevelType } from "@/Common/enum/country/AdministrativeUnitEnum";
import { AddressAdministrativeUnitDTO } from "@/models/Lang/addressDTO";
import { CountrysDTO } from "@/models/Lang/CountrysDTO";
import { useI18n } from "vue-i18n";

const { t: baseT } = useI18n();

const t = (key: string) => baseT(`App.${key}`);

const props = defineProps<{
  next: boolean;
}>();

const emit = defineEmits<{
  (e: "update:formData", value: AddressAdministrativeUnitDTO): void;
  (e: "update:next-step", value: boolean): void;
}>();

const address = ref<AddressAdministrativeUnitDTO>({
  id: "",
  addressType: AddressTypeEnum.Home,
  countrysId: 0,
  cityId: undefined,
  districtId: undefined,
  wardId: undefined,
  streetsId: undefined,
  specificAddress: "",
});

const loadDataAddress = async () => {
  const response = await AddressDetailsApi.GetAddressByUser();
  if (response !== null) {
    // address.value = { ...response };
  }
};

onMounted(async () => {
  await loadDataAddress();
});

const Detailaddress = ref();

const nextStep = async () => {
  const { valid } = await Detailaddress.value!.validate();
  if (valid) {
    emit("update:next-step", true);
  }
};

watch(
  () => props.next,
  (val) => {
    if (val) {
      console.log(address.value);

      // validate hoặc hành động khi parent trigger next
      nextStep(); // ví dụ
    }
  }
);

watch(address, () => {
  emit("update:formData", address.value);
});

const countrysData = ref<CountrysDTO>()
const countrys = async () => {
  await CountrysApi.GetById(address.value.countrysId).then((res) => {
    countrysData.value = res;
  }).catch((err) => { })
}
watch(() => address.value.countrysId, (val) => {
  countrys();
});


</script>

<template>
  <VForm ref="Detailaddress">
    <VRow>
      <VCol cols="12">
        <!-- 👉 Property Deal Type  -->
        <CustomRadiosWithIconAddressType v-model:selected-radio="address.addressType"
          :grid-column="{ cols: '12', sm: '6' }" />
      </VCol>
      <VCol cols="12" sm="6">
        <!-- 👉 Country -->
        <AppCountry v-model="address.countrysId" :label="t('Countrys')" />
      </VCol>
      <VCol cols="12" sm="6">
        <!-- 👉 City -->
        <AppAdministrativeUnit :level="AdminLevelType.Level1" :countrys-id="address.countrysId"
          :rules="[requiredValidator]" :label="t('Citys')" :placeholder="t('Citys')" v-model="address.cityId" />
        <!-- <AppCity :countrys-id="address.countrysId ?? 0" v-model="address.cityId" :rules="[requiredValidator]"
          :label="t('Citys')" :placeholder="t('Citys')" /> -->
      </VCol>

      <VCol cols="12" sm="6">
        <!-- 👉 Landmark -->
        <AppAdministrativeUnit :level="AdminLevelType.Level2" :countrys-id="address.countrysId"
          :parent-id="address.cityId" :rules="[requiredValidator]" :label="t('District')" :placeholder="t('District')"
          v-model="address.districtId" />
        <!-- <AppDistrict :city-id="address.cityId ?? 0" v-model="address.districtId" :rules="[requiredValidator]"
          :label="t('District')" :placeholder="t('District')" /> -->
      </VCol>

      <VCol cols="12" sm="6">

        <AppAdministrativeUnit :level="AdminLevelType.Level3" :countrys-id="address.countrysId"
          :parent-id="address.districtId" :rules="[requiredValidator]" :label="t('Wards')" :placeholder="t('Wards')"
          v-model="address.wardId" />
        <!-- 👉 Landmark -->
        <!-- <AppWard :district-id="address.districtId ?? 0" v-model="address.wardId" :rules="[requiredValidator]"
          :label="t('Wards')" :placeholder="t('Wards')" /> -->
      </VCol>

      <VCol cols="12" sm="6">

        <AppAdministrativeUnit :level="AdminLevelType.Level4" :countrys-id="address.countrysId"
          :parent-id="address.wardId" :rules="[requiredValidator]" :label="t('Streets')" :placeholder="t('Streets')"
          v-model="address.streetsId" />
        <!-- 👉 Zip Code -->
        <!-- <AppStreet :ward-id="address.wardId ?? 0" v-model="address.streetsId" :rules="[requiredValidator]"
          :label="t('Streets')" :placeholder="t('Streets')" /> -->
      </VCol>

      <VCol>
        <!-- 👉 Address -->
        <AppTextarea v-model="address.specificAddress" :label="t('Address')" :rules="[requiredValidator]" rows="2" />
      </VCol>
    </VRow>
  </VForm>
</template>
