<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { CountrysDTO } from "@/models/Lang/CountrysDTO";
import { requiredValidator } from "@/@core/utils/validators";
import { CityDTO, CityResDTO } from "@/models/Lang/citysDTO";
import { useI18n } from "vue-i18n";
import City from "@/views/apps/Addreess/City.vue";
import { DistrictDTO, DistrictResDTO } from "@/models/Lang/DistrictDTO";
import TableDistrict from "@/views/apps/Addreess/District/TableDistrict.vue";
import { WardDTO, WardResDTO } from "@/models/Lang/WarDTO";
import TableWard from "@/views/apps/Addreess/ward/TableWard.vue";
import {
  getProvinceWard,
  getProvinceWardSelect,
} from "@/Common/enum/country/countryEnum";

const { t } = useI18n();

const { locale } = useI18n();
interface Props {
  district: DistrictResDTO;
  ward?: WardResDTO;
  citys?: CityResDTO;
  countrys?: CountrysDTO;
  isDialogVisible: boolean;
}

interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
  (e: "update:ward", value: WardDTO): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const avatarNull = import.meta.env.VITE_DEFAULT_AVATAR;

const wardDto = ref<WardDTO>({
  id: 0,
  districtId: 0,
  wardName: "",
  communeWardEnum: 1,
});

watch(
  [() => props.ward, () => props.district],
  ([newval]) => {
    if (newval) {
      wardDto.value.id = newval.id; // clone tránh sửa trực tiếp props
      wardDto.value.wardName = newval.wardName; // clone tránh sửa trực tiếp props
      wardDto.value.districtId = props.district?.id ?? 0; // clone tránh sửa trực tiếp props
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.ward && props.district) {
    wardDto.value.id = props.ward.id; // clone tránh sửa trực tiếp props
    wardDto.value.wardName = props.ward.wardName; // clone tránh sửa trực tiếp props
    wardDto.value.districtId = props.district.id; // clone tránh sửa trực tiếp props
  }
});

const cityForm = ref();

const OnSubmit = async () => {
  const { valid } = await cityForm.value!.validate();
  if (valid) {
    wardDto.value.districtId = props.district?.id ?? 0;
    if (props.ward) {
      wardDto.value.id = props.ward.id;
    } else wardDto.value.id = 0;

    emit("update:ward", wardDto.value);
    emit("update:isDialogVisible", false);
  }
};

const closeDialog = () => {
  emit("update:isDialogVisible", false);
};

const translatedTitle = (item: any) => {
  return t("App.Ward." + item.title, "none");
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
              v-model="wardDto.wardName"
              :rules="[requiredValidator]"
              :label="t('App.Wards')"
              :lang="locale"
              :placeholder="t('App.Ward.Name')"
            />
          </VRow>

          <VRow>
            <AppAutocomplete
              v-if="$can('manage', 'all')"
              v-model="wardDto.communeWardEnum"
              :items="getProvinceWardSelect()"
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
            <VChip
              v-else
              :color="getProvinceWard(wardDto.communeWardEnum).color"
              variant="outlined"
            >
              {{
                t("App.Ward." + getProvinceWard(wardDto.communeWardEnum).text)
              }}
            </VChip>
          </VRow>
          <VRow>
            <VCol cols="12">
              <TableWard
                :district-id="props.district?.id ?? 0"
                :keywords="wardDto.wardName"
                class="w-100"
              />
            </VCol>
          </VRow>
          <div class="d-flex align-center justify-center gap-3 mt-6">
            <VBtn
              :color="props.ward?.id ? 'warning' : undefined"
              @click="OnSubmit"
              >Submit</VBtn
            >
            <VBtn color="secondary" variant="tonal" @click="closeDialog">
              Cancel
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
