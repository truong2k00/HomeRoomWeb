<script setup lang="ts">
import { ref, watch, watchEffect, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import City from "@/views/apps/Addreess/City.vue";
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

// Address state
const dataAddress = ref({
  city: {} as CityResDTO,
  district: {} as DistrictResDTO,
  ward: {} as WardResDTO,
  street: {} as StreetsResDTO,
});

// Full address builder
const fullAddress = ref("");

const buildFullAddress = () => {
  fullAddress.value = [
    dataAddress.value.street.id
      ? t(
          "App.Street." +
            getProvinceStreet(dataAddress.value.street.streetRoadEnum).text,
          "none"
        ) +
        " " +
        dataAddress.value.street.street
      : "",
    ,
    dataAddress.value.ward.id
      ? t(
          "App.Ward." +
            getProvinceWard(dataAddress.value.ward.communeWardEnum).text,
          "none"
        ) +
        " " +
        dataAddress.value.ward.wardName
      : "",
    dataAddress.value.district.id
      ? t(
          "App.Districts." +
            getProvinceDistrict(dataAddress.value.district.countyDistrictEnum)
              .text
        ) +
        " " +
        dataAddress.value.district.districtName
      : "",
    dataAddress.value.city.cityName
      ? t(
          "App.City." +
            getProvinceCity(dataAddress.value.city.provinceCityEnum).text
        ) +
        " " +
        dataAddress.value.city.cityName
      : "",
    countryData.value?.countryName,
  ]
    .filter((part) => part?.trim?.())
    .join(" - ");
};

// Watch for address part changes
watch(
  [
    () => dataAddress.value.city,
    () => dataAddress.value.district,
    () => dataAddress.value.ward,
    () => dataAddress.value.street,
    () => dataAddress.value.city.provinceCityEnum,
    () => dataAddress.value.district.countyDistrictEnum,
    () => dataAddress.value.ward.communeWardEnum,
    () => locale.value,
  ],
  () => {
    buildFullAddress();
  }
);

watch(
  () => dataAddress.value.city,
  () => {
    dataAddress.value.district = {} as DistrictResDTO;
    dataAddress.value.ward = {} as WardResDTO;
    dataAddress.value.street = {} as StreetsResDTO;
  }
);

watch(
  () => dataAddress.value.district,
  () => {
    dataAddress.value.ward = {} as WardResDTO;
    dataAddress.value.street = {} as StreetsResDTO;
  }
);
watch(
  () => dataAddress.value.ward,
  () => {
    dataAddress.value.street = {} as StreetsResDTO;
  }
);

// React to query change of city (ex: when navigating)
watchEffect(() => {
  const cityId = router.currentRoute.value.query.city;
  if (cityId) {
    buildFullAddress();
  }
});

// Called when user selects city
const updateCity = (val: CityResDTO) => {
  dataAddress.value.city = val;
};
const updatedistrict = (val: DistrictResDTO) => {
  dataAddress.value.district = val;
};

const updateWard = (val: WardResDTO) => {
  dataAddress.value.ward = val;
};

const updatestreet = (val: StreetsResDTO) => {
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
    buildFullAddress();
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
            <VAvatar
              @click="viewDistrict"
              rounded
              :size="200"
              :color="!countryData?.areaCode ? 'primary' : undefined"
              :variant="!countryData?.areaCode ? 'tonal' : undefined"
            >
              <VImg
                :src="
                  countryData?.areaCode
                    ? `https://flagcdn.com/w320/${countryData.areaCode.toLowerCase()}.png`
                    : avatarNull
                "
              />
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
              {{ fullAddress }}
            </p>
          </VCardItem>
        </VCol>
        <VCol cols="12" sm="6">
          <VCardItem class="text-center"
            ><VCardTitle class="text-h3 mb-3">
              {{ t("App.Citys") }}
            </VCardTitle>
            <City
              @update:citys="updateCity"
              :country="countryData"
            /> </VCardItem
        ></VCol>
      </VRow>
    </VCard>
    <VRow>
      <VCol cols="12" sm="6">
        <VCardItem class="text-center"
          ><VCardTitle class="text-h3 mb-3">
            {{ t("App.District") }} :
            {{
              dataAddress.city.id
                ? t(
                    "App.City." +
                      getProvinceCity(dataAddress.city.provinceCityEnum).text
                  )
                : ""
            }}
            {{ dataAddress.city.cityName }}
          </VCardTitle>
          <District
            @update:district="updatedistrict"
            :city="dataAddress.city"
            :country="countryData" /></VCardItem
      ></VCol>
      <VCol cols="12" sm="6">
        <VCardItem class="text-center">
          <VCardTitle class="text-h3 mb-3">
            {{ t("App.Wards") }}:
            {{
              dataAddress.district.id
                ? t(
                    "App.Districts." +
                      getProvinceDistrict(
                        dataAddress.district.countyDistrictEnum
                      ).text
                  )
                : ""
            }}
            {{ dataAddress.district.districtName }}
          </VCardTitle>
          <Ward
            @update:ward="updateWard"
            :district="dataAddress.district"
            :city="dataAddress.city"
            :country="countryData" /></VCardItem
      ></VCol>
    </VRow>
    <VRow>
      <VCol cols="12" sm="6">
        <VCardItem class="text-center">
          <VCardTitle class="text-h3 mb-3">
            {{ t("App.Streets") }}:
            {{
              dataAddress.ward.id
                ? t(
                    "App.Ward." +
                      getProvinceWard(dataAddress.ward.communeWardEnum).text
                  )
                : ""
            }}
            {{ dataAddress.ward.wardName }}
          </VCardTitle>
          <Street
            @update:street="updatestreet"
            :district="dataAddress.district"
            :city="dataAddress.city"
            :ward="dataAddress.ward"
            :country="countryData" /></VCardItem
      ></VCol>
    </VRow>
  </div>
</template>
<route lang="yaml">
meta:
  action: create
  subject: Auth
</route>
