<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { CountrysDTO } from "@/models/Lang/CountrysDTO";
import { requiredValidator } from "@/@core/utils/validators";
import { useI18n } from "vue-i18n";
import { AdministrativeUnitDTO, CreateAdministrativeUnitDTO } from "@/models/Lang/administrativeUnitDTO";
import { getTypeLevelSelect, keyTranslatedTitle } from "@/Common/enum/country/AdministrativeUnitEnum";
import AddressUnitApi from "@/Api/addressDetail/AdministrativeUnitAPI";
import { useSnackbarStore } from "@/plugins/utils/snackbar";

const { t } = useI18n();

const { locale } = useI18n();
interface Props {
  countrys?: CountrysDTO;
  parentId?: string;
  leveltype: number;
  isDialogVisible: boolean;
}

interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
  (e: "update:data", value: AdministrativeUnitDTO): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const avatarNull = import.meta.env.VITE_DEFAULT_AVATAR;

const createDTO = ref<CreateAdministrativeUnitDTO>({
  countryId: props.countrys?.id || 0,
  parentId: props.parentId,
  name: "",
  type: getTypeLevelSelect(props.leveltype)[0].value,
});

// watch(
//   [() => props.citys, () => props.countrys],
//   ([newCity]) => {
//     if (newCity) {
//       CitysDTO.value.id = newCity.id; // clone tránh sửa trực tiếp props
//       CitysDTO.value.cityName = newCity.cityName; // clone tránh sửa trực tiếp props
//       CitysDTO.value.countrysId = props.countrys?.id ?? 0; // clone tránh sửa trực tiếp props
//     }
//   },
//   { immediate: true }
// );

onMounted(() => {
  createDTO.value.countryId = props.countrys?.id || 0;
  createDTO.value.parentId = props.parentId;
});



const OnSubmit = async () => {
  createDTO.value.countryId = props.countrys?.id || 0;
  createDTO.value.parentId = props.parentId;
  AddressUnitApi.Create(createDTO.value)
    .then((res) => {
      emit("update:data", res);
      emit("update:isDialogVisible", false);
    })
    .catch((error) => {
      useSnackbarStore().show(t("Error") + ": " + error.response.data.errors.name, "error");
    });
};

const closeDialog = () => {
  editingMap.value = false;
  emit("update:isDialogVisible", false);
};

const translatedTitle = (item: any) => {
  return t(keyTranslatedTitle(props.leveltype) + item.title, "none");
};
const editingMap = ref<boolean>(false);

const toggleEdit = () => {
  editingMap.value = !editingMap.value;
};
</script>

<template>
  <VDialog max-width="787" :model-value="props.isDialogVisible"
    @update:model-value="(val) => emit('update:isDialogVisible', val)">
    <DialogCloseBtn @click="closeDialog" />
    <VCard class="pa-sm-8 pa-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h3 mb-3">
          {{ t("Create") }} {{ t("new") }}
        </VCardTitle>

        <VAvatar rounded :size="100" :color="!props.countrys?.areaCode ? 'primary' : undefined"
          :variant="!props.countrys?.areaCode ? 'tonal' : undefined">
          <VImg :src="props.countrys?.areaCode
            ? `https://flagcdn.com/w320/${props.countrys.areaCode.toLowerCase()}.png`
            : avatarNull
            " />
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
            <AppTextField :lang="locale" v-model="createDTO.name" :rules="[requiredValidator]" :label="t('App.Citys')"
              :placeholder="t('App.City.Name')" />
          </VRow>
          <VRow>
            <AppAutocomplete v-model="createDTO.type" :items="getTypeLevelSelect(props.leveltype)"
              :item-title="translatedTitle" item-value="value" :readonly="!editingMap" persistent-hint
              :menu-props="{ maxHeight: '200px' }" :label="`State — ${editingMap ? 'Editable' : 'Readonly'}`"
              prepend-icon="tabler-building">
              <!-- Dropdown items -->
              <template #append>
                <VSlideXReverseTransition mode="out-in">
                  <VIcon :key="`icon-${editingMap}`" :color="editingMap ? 'success' : 'info'"
                    :icon="editingMap ? 'tabler-checks' : 'tabler-edit-circle'" @click="toggleEdit" />
                </VSlideXReverseTransition>
              </template>
            </AppAutocomplete>
          </VRow>
          <div class="d-flex align-center justify-center gap-3 mt-6">
            <VBtn :color="'warning'" @click="OnSubmit">Submit</VBtn>
            <VBtn color="secondary" variant="tonal" @click="closeDialog">
              Cancel
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
