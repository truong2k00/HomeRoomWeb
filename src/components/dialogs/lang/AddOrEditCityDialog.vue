<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { CountrysDTO } from "@/models/Lang/CountrysDTO";
import { requiredValidator } from "@/@core/utils/validators";
import { CityDTO, CityResDTO } from "@/models/Lang/citysDTO";
import { useI18n } from "vue-i18n";
import { getProvinceCitySelect } from "@/Common/enum/country/countryEnum";

const { t } = useI18n();

const { locale } = useI18n();
interface Props {
  citys?: CityResDTO;
  countrys?: CountrysDTO;
  isDialogVisible: boolean;
}

interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
  (e: "update:citys", value: CityDTO): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const avatarNull = import.meta.env.VITE_DEFAULT_AVATAR;

const CitysDTO = ref<CityDTO>({
  id: 0,
  countrysId: 0,
  cityName: "",
  provinceCityEnum: 1,
});

watch(
  [() => props.citys, () => props.countrys],
  ([newCity]) => {
    if (newCity) {
      CitysDTO.value.id = newCity.id; // clone tránh sửa trực tiếp props
      CitysDTO.value.cityName = newCity.cityName; // clone tránh sửa trực tiếp props
      CitysDTO.value.countrysId = props.countrys?.id ?? 0; // clone tránh sửa trực tiếp props
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.citys && props.countrys) {
    CitysDTO.value.id = props.citys.id; // clone tránh sửa trực tiếp props
    CitysDTO.value.cityName = props.citys.cityName; // clone tránh sửa trực tiếp props
    CitysDTO.value.countrysId = props.countrys.id; // clone tránh sửa trực tiếp props
  }
});

const cityForm = ref();

const OnSubmit = async () => {
  const { valid } = await cityForm.value!.validate();
  if (valid) {
    CitysDTO.value.countrysId = props.countrys?.id ?? 0;
    if (props.citys) {
      CitysDTO.value.id = props.citys.id;
    } else CitysDTO.value.id = 0;

    emit("update:citys", CitysDTO.value);
    editingMap.value = false;
    emit("update:isDialogVisible", false);
  }
};

const closeDialog = () => {
  editingMap.value = false;
  emit("update:isDialogVisible", false);
};

const translatedTitle = (item: any) => {
  return t("App.City." + item.title, "none");
};
const editingMap = ref<boolean>(false);

const toggleEdit = () => {
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
          {{ props.citys?.id ? "Edit" : "Add New" }} City
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
      </VCardItem>

      <VCardText class="mt-6">
        <VForm ref="cityForm">
          <VRow>
            <AppTextField
              :lang="locale"
              v-model="CitysDTO.cityName"
              :rules="[requiredValidator]"
              :label="t('App.Citys')"
              :placeholder="t('App.City.Name')"
            />
          </VRow>
          <VRow
            ><AppAutocomplete
              v-model="CitysDTO.provinceCityEnum"
              :items="getProvinceCitySelect()"
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
          <div class="d-flex align-center justify-center gap-3 mt-6">
            <VBtn
              :color="props.citys?.id ? 'warning' : undefined"
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
