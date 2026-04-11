<script setup lang="ts">
import { ref, watch, watchEffect, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import AdministrativeUnit from "@/views/apps/Addreess/AdministrativeUnit/index.vue";
import CommonStrative from "@/views/apps/Addreess/AdministrativeUnit/CommonStrative.vue";
import CountrysApi from "@/Api/Lang/CountrysApi";
import { CountrysDTO } from "@/models/Lang/CountrysDTO";
import {
  getProvinceCity,
  getProvinceDistrict,
  getProvinceWard,
} from "@/Common/enum/country/countryEnum";
import { AdministrativeUnitDTO } from "@/models/Lang/administrativeUnitDTO";
import { AdminLevelType, getListAdminLevelType, getProvincetypeInfo, getProvincetypeInfoLevel1, getProvincetypeInfoLevel2, getProvincetypeInfoLevel3, getProvincetypeInfoLevel4, keyTranslatedTitle } from "@/Common/enum/country/AdministrativeUnitEnum";
import { useSnackbarStore } from "@/plugins/utils/snackbar";

// ENV avatar fallback
const avatarNull = import.meta.env.VITE_DEFAULT_AVATAR;

// i18n
const { t } = useI18n();
const { locale } = useI18n();

// Router
const route = useRoute();
const router = useRouter();

// Country state
const countryId = ref(Number(route.query.id) || 0);
const countryData = ref<CountrysDTO>({
  id: 0,
  countryName: "",
  vietnamesCountryName: "",
  areaCode: "",
  skipLevel: [],
  countryCode: "",
  languageCode: "",
  languageName: "",
});

const loadDataCountry = async () => {
  await CountrysApi.GetById(countryId.value).then((res) => {
    countryData.value = res;
  }).catch((error) => { });
};

// Watch for country query id changes
watchEffect(() => {
  if (route.query.id) {
    countryId.value = Number(route.query.id);
  }
});


const fullAddressUnit = ref("");

const dataAddressUnit = ref({
  city: {} as AdministrativeUnitDTO,
  district: {} as AdministrativeUnitDTO,
  ward: {} as AdministrativeUnitDTO,
  street: {} as AdministrativeUnitDTO,
});



const UpdateCoutryLevelSkip = async (): Promise<boolean> => {
  try {
    await CountrysApi.UpdateSkipLevel(
      countryData.value.id,
      countryData.value.skipLevel
    );

    useSnackbarStore().show(t("Update successfully"), "success");

    // reset data
    dataAddressUnit.value = {
      city: {} as AdministrativeUnitDTO,
      district: {} as AdministrativeUnitDTO,
      ward: {} as AdministrativeUnitDTO,
      street: {} as AdministrativeUnitDTO,
    };

    return true;
  } catch (err) {
    useSnackbarStore().show(t("Update failed"), "error");
    return false;
  }
};

const buildFullAddressUnit = () => {
  fullAddressUnit.value = [
    dataAddressUnit.value.street.id
      ? t(
        "App.Street." +
        getProvincetypeInfoLevel4(dataAddressUnit.value.street.type).text,
        "none"
      ) +
      " " +
      dataAddressUnit.value.street.name
      : "",
    ,
    dataAddressUnit.value.ward.id
      ? t(
        "App.Ward." +
        getProvincetypeInfoLevel3(dataAddressUnit.value.ward.type).text,
        "none"
      ) +
      " " +
      dataAddressUnit.value.ward.name
      : "",
    dataAddressUnit.value.district.id
      ? t(
        "App.Districts." +
        getProvincetypeInfoLevel2(dataAddressUnit.value.district.type).text
      ) +
      " " +
      dataAddressUnit.value.district.name
      : "",
    dataAddressUnit.value.city.id
      ? t(
        "App.City." +
        getProvincetypeInfoLevel1(dataAddressUnit.value.city.type).text
      ) +
      " " +
      dataAddressUnit.value.city.name
      : "",
    countryData.value?.countryName,
  ]
    .filter((part) => part?.trim?.())
    .join(" - ");
};


// Address state
const dataAddress = ref({
  city: {} as AdministrativeUnitDTO,
  district: {} as AdministrativeUnitDTO,
  ward: {} as AdministrativeUnitDTO,
  street: {} as AdministrativeUnitDTO,
});


// Watch for address part changes
watch(
  [
    () => dataAddressUnit.value.city,
    () => dataAddressUnit.value.district,
    () => dataAddressUnit.value.ward,
    () => dataAddressUnit.value.street,
    () => dataAddressUnit.value.city.type,
    () => dataAddressUnit.value.district.type,
    () => dataAddressUnit.value.ward.type,
    () => dataAddressUnit.value.street.type,
    () => locale.value,
  ],
  () => {
    buildFullAddressUnit();
  }
);

watch(
  () => dataAddress.value.city,
  () => {
    dataAddress.value.district = {} as AdministrativeUnitDTO;
    dataAddress.value.ward = {} as AdministrativeUnitDTO;
    dataAddress.value.street = {} as AdministrativeUnitDTO;
  }
);

watch(
  () => dataAddress.value.district,
  () => {
    dataAddress.value.ward = {} as AdministrativeUnitDTO;
    dataAddress.value.street = {} as AdministrativeUnitDTO;
  }
);
watch(
  () => dataAddress.value.ward,
  () => {
    dataAddress.value.street = {} as AdministrativeUnitDTO;
  }
);

// React to query change of city (ex: when navigating)
watchEffect(() => {
  const cityId = router.currentRoute.value.query.city;
  if (cityId) {
    buildFullAddressUnit();
  }
});

// Called when user selects city
const updateAddressUnit = (val: AdministrativeUnitDTO) => {
  switch (val.level) {
    case 1:
      dataAddressUnit.value.city = val;
      break;
    case 2:
      dataAddressUnit.value.district = val;
      break;
    case 3:
      dataAddressUnit.value.ward = val;
      break;
    case 4:
      dataAddressUnit.value.street = val;
      break;
  }
};

const getMappedValue = (level: number): { level: number, data: AdministrativeUnitDTO } => {
  const skipLevels = countryData.value?.skipLevel || [];

  let current = level - 1;

  while (current >= 1 && skipLevels.includes(current)) {
    current--;
  }

  switch (current) {
    case 1:
      return { level: current, data: dataAddressUnit.value.city }; // Default fallback
    case 2:
      return { level: current, data: dataAddressUnit.value.district };
    case 3:
      return { level: current, data: dataAddressUnit.value.ward };
    case 4:
      return { level: current, data: dataAddressUnit.value.street };
    default:
      return { level: 0, data: {} as AdministrativeUnitDTO };
  }
};
// Navigate to view district
const viewDistrict = () => {
  router.replace({
    name: "administrator-address",
  });
};

// Initial load
onMounted(async () => {
  const id = Number(route.query.id);

  // Nếu id hợp lệ (ví dụ khác 0 và là số), mới gọi hàm
  if (id && !isNaN(id)) {
    await loadDataCountry();
    buildFullAddressUnit();
  } else viewDistrict();
});

watch(
  () => [...countryData.value.skipLevel],
  (newVal, oldVal) => {
    newVal.filter(x => !oldVal.includes(x));
    oldVal.filter(x => !newVal.includes(x));
  }
);

const getCheckboxModel = (level: AdminLevelType) => computed({
  get: () => !countryData.value.skipLevel.includes(level),
  set: async (val: boolean) => {
    const oldSkip = [...countryData.value.skipLevel]; // 🔥 backup

    // 👉 tạo state mới
    const newSkip = val
      ? oldSkip.filter(x => x !== level) // checked → remove khỏi skip
      : [...oldSkip, level];            // unchecked → thêm vào skip

    // 👉 update UI trước
    countryData.value.skipLevel = newSkip;

    const res = await UpdateCoutryLevelSkip();

    // ❌ rollback nếu fail
    if (!res) {
      countryData.value.skipLevel = oldSkip;
    }
  }
});
</script>

<template>
  <div>
    <VCard class="pa-sm-8 pa-5">
      <!-- 👉 Title -->
      <VRow>
        <VCol cols="12" sm="6">
          <VCardItem class="text-center">
            <VCardTitle class="text-h2 mb-">
              {{ t("App.Countrys") }}
            </VCardTitle>
            <VAvatar @click="viewDistrict" rounded :size="200" :color="!countryData?.areaCode ? 'primary' : undefined"
              :variant="!countryData?.areaCode ? 'tonal' : undefined">
              <VImg :src="countryData?.areaCode
                ? `https://flagcdn.com/w320/${countryData.areaCode.toLowerCase()}.png`
                : avatarNull
                " />
              <!-- <span v-else class="text-5xl font-weight-medium">
              {{ avatarText(props.userData.fullName) }}
            </span> -->
            </VAvatar>
            <p class="text-base mb-0">
              {{ countryData?.countryName }}/{{
                countryData?.vietnamesCountryName
              }}
            </p>
            <VSpacer />
            <p class="text-2xl mb-0">
              {{ fullAddressUnit }}
            </p>
            <VRow>
              <VCol v-for="item in getListAdminLevelType()" :key="item.value"
                :title="t('App.' + getProvincetypeInfo(item.value).text)" cols="6" md="3">
                <VCheckbox v-model="getCheckboxModel(item.value).value"
                  :label="t('App.' + getProvincetypeInfo(item.value).text)" />
              </VCol>
            </VRow>
          </VCardItem>
        </VCol>
        <VCol cols="12" sm="6">
          <VCardItem class="text-center">
            <VCardTitle class="text-h3 mb-3">
              {{ t("App.Citys") }}
            </VCardTitle>
            <AdministrativeUnit :level-type="1" @update:data="updateAddressUnit" :country="countryData" />
          </VCardItem>
        </VCol>
      </VRow>
    </VCard>
    <VRow>
      <VCol v-if="!(countryData.skipLevel?.includes(2) ?? false)" cols="12" sm="6">
        <VCardItem class="text-center">
          <VCardTitle class="text-h3 mb-3">
            {{ t("App.District") }} :
            {{
              dataAddress.city.id
                ? t(
                  keyTranslatedTitle(2) +
                  getProvincetypeInfoLevel1(getMappedValue(1).data.type).text
                )
                : ""
            }}
            {{ dataAddress.city.name }}
          </VCardTitle>


          <CommonStrative :data="getMappedValue(2).data" :parent-id="getMappedValue(2).data.id" :level-type="2"
            @update:data="updateAddressUnit" :country="countryData" />
          <!-- <CommonStrative :typeLevel="2" :parent-id="dataAddressUnit.city.id" @update:data="updateCity"
            :country="countryData" /> -->
        </VCardItem>
      </VCol>
      <VCol v-if="!(countryData.skipLevel?.includes(3) ?? false)" cols="12" sm="6">
        <VCardItem class="text-center">
          <VCardTitle class="text-h3 mb-3">
            {{ t("App.Wards") }}:
            {{
              dataAddress.district.id
                ? t(
                  keyTranslatedTitle(2) +
                  getProvincetypeInfoLevel2(
                    getMappedValue(3).data.type
                  ).text
                )
                : ""
            }}
            {{ getMappedValue(3).data.name }}
          </VCardTitle>
          <CommonStrative :data="getMappedValue(3).data" :parent-id="getMappedValue(3).data.id" :level-type="3"
            @update:data="updateAddressUnit" :country="countryData" />
        </VCardItem>
      </VCol>
      <VCol v-if="!(countryData.skipLevel?.includes(4) ?? false)" cols="12" sm="6">
        <VCardItem class="text-center">
          <VCardTitle class="text-h3 mb-3">
            {{ t("App.Streets") }}:
            {{
              dataAddress.ward.id
                ? t(
                  "App.Ward." +
                  getProvinceWard(getMappedValue(4).data.type).text
                )
                : ""
            }}
            {{ getMappedValue(4).data.name }}
          </VCardTitle>

          <CommonStrative :data="getMappedValue(4).data" :parent-id="getMappedValue(4).data.id" :level-type="4"
            @update:data="updateAddressUnit" :country="countryData" />
        </VCardItem>
      </VCol>
    </VRow>
  </div>
</template>
<route lang="yaml">
meta:
  action: create
  subject: Auth
</route>
