<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { CountrysDTO } from "@/models/Lang/CountrysDTO";
import { requiredValidator } from "@/@core/utils/validators";
import { CityResDTO } from "@/models/Lang/citysDTO";
import { useI18n } from "vue-i18n";
import { WardResDTO } from "@/models/Lang/WarDTO";
import { getProvinceStreetSelect } from "@/Common/enum/country/countryEnum";
import { StreetsDTO, StreetsResDTO } from "@/models/Lang/StreetDTO";
import TableStreet from "@/views/apps/Addreess/street/TableStreet.vue";

const { t } = useI18n();

const { locale } = useI18n();
interface Props {
  ward: WardResDTO;
  citys: CityResDTO;
  countrys?: CountrysDTO;
  street?: StreetsResDTO;
  isDialogVisible: boolean;
}

interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
  (e: "update:Street", value: StreetsDTO): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const avatarNull = import.meta.env.VITE_DEFAULT_AVATAR;

const streetDto = ref<StreetsDTO>({
  id: "",
  wardId: 0,
  street: "",
  streetRoadEnum: 1,
});

watch(
  [() => props.street, () => props.ward],
  ([newval]) => {
    if (newval) {
      streetDto.value.id = newval.id; // clone tránh sửa trực tiếp props
      streetDto.value.street = newval.street; // clone tránh sửa trực tiếp props
      streetDto.value.wardId = props.ward?.id ?? 0; // clone tránh sửa trực tiếp props
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.ward && props.ward) {
    streetDto.value.id = props.street?.id ?? ""; // clone tránh sửa trực tiếp props
    streetDto.value.street = props.street?.street ?? ""; // clone tránh sửa trực tiếp props
    streetDto.value.wardId = props.ward.id; // clone tránh sửa trực tiếp props
  }
});

const cityForm = ref();

const OnSubmit = async () => {
  const { valid } = await cityForm.value!.validate();
  if (valid) {
    streetDto.value.wardId = props.ward?.id ?? 0;
    if (props.ward) {
      streetDto.value.id = props.street?.id ?? "";
    } else streetDto.value.id = "";

    emit("update:Street", streetDto.value);
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

const toggleEdit = (val: WardResDTO) => {
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
          {{ props.street?.id ? "Edit" : "Add New" }} street
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
          {{ props.ward?.wardName ?? "" }}
          {{ props.ward ? "/" : "" }} {{ props.citys?.cityName ?? "" }} /
          {{ props.countrys?.countryName }}
        </p>
      </VCardItem>

      <VCardText class="mt-6">
        <VForm ref="cityForm">
          <VRow>
            <AppTextField
              v-model="streetDto.street"
              :rules="[requiredValidator]"
              :label="t('App.Wards')"
              :lang="locale"
              :placeholder="t('App.Ward.Name')"
            />
          </VRow>

          <VRow>
            <AppAutocomplete
              v-model="streetDto.streetRoadEnum"
              :items="getProvinceStreetSelect()"
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
              <TableStreet
                :ward-id="props.ward?.id ?? 0"
                :keywords="streetDto.street"
                class="w-100"
              />
            </VCol>
          </VRow>
          <div class="d-flex align-center justify-center gap-3 mt-6">
            <VBtn
              :color="props.street?.id ? 'warning' : undefined"
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
