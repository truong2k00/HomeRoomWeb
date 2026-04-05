<script setup lang="ts">
import { ref, watch, watchEffect, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import AdministrativeUnit from "@/views/apps/Addreess/AdministrativeUnit/index.vue";
import CommonStrative from "@/views/apps/Addreess/AdministrativeUnit/CommonStrative.vue";

import District from "@/views/apps/Addreess/District.vue";
import Street from "@/views/apps/Addreess/Streets.vue";

import CountrysApi from "@/Api/Lang/CountrysApi";
import { CountrysDTO } from "@/models/Lang/CountrysDTO";
import { CityResDTO } from "@/models/Lang/citysDTO";
import { DistrictResDTO } from "@/models/Lang/DistrictDTO";
import { WardResDTO } from "@/models/Lang/WarDTO";
import Ward from "@/views/apps/Addreess/Ward.vue";
import {
  getProvinceCity,
  getProvinceDistrict,
  getProvinceStreet,
  getProvinceWard,
} from "@/Common/enum/country/countryEnum";
import { StreetsResDTO } from "@/models/Lang/StreetDTO";
import { AdministrativeUnitDTO } from "@/models/Lang/administrativeUnitDTO";
import { getProvincetypeInfoLevel1, getProvincetypeInfoLevel2, getProvincetypeInfoLevel3, getProvincetypeInfoLevel4 } from "@/Common/enum/country/AdministrativeUnitEnum";

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
const countryData = ref<CountrysDTO>();

const loadDataCountry = async () => {
  try {
    const res = await CountrysApi.GetById(countryId.value);
    countryData.value = res;
  } catch (error) {
    console.error("Failed to load country data:", error);
  }
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
const updateCity = (val: AdministrativeUnitDTO) => {
  console.log("City selected:", val);
  dataAddressUnit.value.city = val;
};
const updatedistrict = (val: AdministrativeUnitDTO) => {
  dataAddress.value.district = val;
};

const updateWard = (val: AdministrativeUnitDTO) => {
  dataAddress.value.ward = val;
};

const updateStreet = (val: AdministrativeUnitDTO) => {
  dataAddress.value.street = val;
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
          </VCardItem>
        </VCol>
        <VCol cols="12" sm="6">
          <VCardItem class="text-center">
            <VCardTitle class="text-h3 mb-3">
              {{ t("App.Citys") }}
            </VCardTitle>
            <AdministrativeUnit :level-type="1" @update:data="updateCity" :country="countryData" />
          </VCardItem>
        </VCol>
      </VRow>
    </VCard>
    <VRow>
      <VCol v-if="(countryData?.skipLevels?.includes(2) ?? false)" cols="12" sm="6">
        <VCardItem class="text-center">
          <VCardTitle class="text-h3 mb-3">
            {{ t("App.District") }} :
            {{
              dataAddress.city.id
                ? t(
                  "App.City." +
                  getProvinceCity(dataAddress.city.type).text
                )
                : ""
            }}
            {{ dataAddress.city.countryName }}
          </VCardTitle>

          <CommonStrative :parent-id="dataAddress.city.id" :level-type="2" @update:data="updateCity"
            :country="countryData" />
          <!-- <CommonStrative :typeLevel="2" :parent-id="dataAddressUnit.city.id" @update:data="updateCity"
            :country="countryData" /> -->
        </VCardItem>
      </VCol>
      <VCol cols="12" sm="6">
        <VCardItem class="text-center">
          <VCardTitle class="text-h3 mb-3">
            {{ t("App.Wards") }}:
            {{
              dataAddress.district.id
                ? t(
                  "App.Districts." +
                  getProvinceDistrict(
                    dataAddress.district.type
                  ).text
                )
                : ""
            }}
            {{ dataAddress.district.name }}
          </VCardTitle>
          <CommonStrative :parent-id="dataAddress.district.id" :level-type="3" @update:data="updateWard"
            :country="countryData" />
        </VCardItem>
      </VCol>
      <VCol cols="12" sm="6">
        <VCardItem class="text-center">
          <VCardTitle class="text-h3 mb-3">
            {{ t("App.Streets") }}:
            {{
              dataAddress.ward.id
                ? t(
                  "App.Ward." +
                  getProvinceWard(dataAddress.ward.type).text
                )
                : ""
            }}
            {{ dataAddress.ward.name }}
          </VCardTitle>

          <CommonStrative :parent-id="dataAddress.district.id" :level-type="4" @update:data="updateStreet"
            :country="countryData" />
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
