<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { CountrysDTO } from "@/models/Lang/CountrysDTO";
import { requiredValidator } from "@/@core/utils/validators";
import { CityDTO, CityResDTO } from "@/models/Lang/citysDTO";
import { useI18n } from "vue-i18n";
import City from "@/views/apps/Addreess/City.vue";
import { DistrictDTO, DistrictResDTO } from "@/models/Lang/DistrictDTO";
import TableDistrict from "@/views/apps/Addreess/District/TableDistrict.vue";
import { getProvinceDistrictSelect } from "@/Common/enum/country/countryEnum";

const { t } = useI18n();

interface Props {
  district?: DistrictResDTO;
  citys?: CityResDTO;
  countrys?: CountrysDTO;
  isDialogVisible: boolean;
}

interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
  (e: "update:district", value: DistrictDTO): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const avatarNull = import.meta.env.VITE_DEFAULT_AVATAR;

const districtDTO = ref<DistrictDTO>({
  id: 0,
  cityId: 0,
  districtName: "",
  countyDistrictEnum: 2,
});

watch(
  [() => props.district, () => props.citys],
  ([newval]) => {
    if (newval) {
      districtDTO.value.id = newval.id; // clone tránh sửa trực tiếp props
      districtDTO.value.districtName = newval.districtName; // clone tránh sửa trực tiếp props
      districtDTO.value.cityId = props.citys?.id ?? 0; // clone tránh sửa trực tiếp props
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.district && props.citys) {
    districtDTO.value.id = props.district.id; // clone tránh sửa trực tiếp props
    districtDTO.value.districtName = props.district.districtName; // clone tránh sửa trực tiếp props
    districtDTO.value.cityId = props.citys.id; // clone tránh sửa trực tiếp props
  }
});

const cityForm = ref();

const OnSubmit = async () => {
  const { valid } = await cityForm.value!.validate();
  if (valid) {
    districtDTO.value.cityId = props.citys?.id ?? 0;
    if (props.district) {
      districtDTO.value.id = props.district.id;
    } else districtDTO.value.id = 0;

    emit("update:district", districtDTO.value);
    editingMap.value = false;
    emit("update:isDialogVisible", false);
  }
};

const closeDialog = () => {
  editingMap.value = false;
  emit("update:isDialogVisible", false);
};

//
const translatedTitle = (item: any) => {
  return t("App.Districts." + item.title, "none");
};
const editingMap = ref<boolean>(false);

const toggleEdit = (val: DistrictResDTO) => {
  editingMap.value = !editingMap.value;
};
</script>

<template>
  <VDialog
    max-width="787"
    :model-value="props.isDialogVisible"
    @update:model-value="(val) => emit('update:isDialogVisible', val)"
  >
    <DialogCloseBtn @click="closeDialog" />
    <VCard class="pa-sm-8 pa-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h3 mb-3">
          {{ props.district?.id ? "Edit" : "Add New" }} District
        </VCardTitle>

        <VAvatar
          rounded
          :size="100"
          :color="!props.countrys?.areaCode ? 'primary' : undefined"
          :variant="!props.countrys?.areaCode ? 'tonal' : undefined"
        >
          <VImg
            :src="
              props.countrys?.areaCode
                ? `https://flagcdn.com/w320/${props.countrys.areaCode.toLowerCase()}.png`
                : avatarNull
            "
          />
        </VAvatar>
        <p class="text-base mb-0">
          {{ props.countrys?.countryName }}/{{
            props.countrys?.vietnamesCountryName
          }}
        </p>
        <p class="text-2xl mb-0">
          {{ props.district?.districtName ?? "" }}
          {{ props.district ? "/" : "" }} {{ props.citys?.cityName ?? "" }} /
          {{ props.countrys?.countryName }}
        </p>
      </VCardItem>

      <VCardText class="mt-6">
        <VForm ref="cityForm">
          <VRow>
            <AppTextField
              v-model="districtDTO.districtName"
              :rules="[requiredValidator]"
              :label="t('App.District')"
              :placeholder="t('App.Districts.Name')"
            />
          </VRow>
          <VRow>
            <AppAutocomplete
              v-model="districtDTO.countyDistrictEnum"
              :items="getProvinceDistrictSelect()"
              :item-title="translatedTitle"
              item-value="value"
              :readonly="!editingMap"
              persistent-hint
              :menu-props="{ maxHeight: '200px' }"
              :label="`State — ${editingMap ? 'Editable' : 'Readonly'}`"
              prepend-icon="tabler-building"
            >
              <!-- Dropdown items -->
              <template #append>
                <VSlideXReverseTransition mode="out-in">
                  <VIcon
                    :key="`icon-${editingMap}`"
                    :color="editingMap ? 'success' : 'info'"
                    :icon="editingMap ? 'tabler-checks' : 'tabler-edit-circle'"
                    @click="toggleEdit"
                  />
                </VSlideXReverseTransition>
              </template>
            </AppAutocomplete>
          </VRow>
          <VRow>
            <VCol cols="12">
              <TableDistrict
                :city-id="props.citys?.id ?? 0"
                :keywords="districtDTO.districtName"
                class="w-100"
              />
            </VCol>
          </VRow>
          <div class="d-flex align-center justify-center gap-3 mt-6">
            <VBtn
              :color="props.district?.id ? 'warning' : undefined"
              @click="OnSubmit"
              >{{ t("Submit") }}</VBtn
            >
            <VBtn color="secondary" variant="tonal" @click="closeDialog">
              {{ t("Cancel") }}
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
