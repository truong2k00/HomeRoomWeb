<script setup lang="ts">
import { ref, onMounted } from "vue";
import { CountrysDTO } from "@/models/Lang/CountrysDTO";
import { requiredValidator } from "@/@core/utils/validators";
const avatarNull = import.meta.env.VITE_DEFAULT_AVATAR;

interface Props {
  country?: CountrysDTO;
  isDialogVisible: boolean;
}

interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
  (e: "update:countrys", value: CountrysDTO): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

function closeDialog() {
  emit("update:isDialogVisible", false);
}

const countrysDTO = ref<CountrysDTO>({
  areaCode: "",
  countryName: "",
  countryCode: "",
  id: 0,
  languageCode: "",
  languageName: "",
  vietnamesCountryName: "",
});

watch(
  () => props.country,
  (newCountry) => {
    if (newCountry) {
      countrysDTO.value = newCountry; // clone để tránh sửa trực tiếp props
    } else {
      countrysDTO.value = {
        areaCode: "",
        countryName: "",
        countryCode: "",
        id: 0,
        languageCode: "",
        languageName: "",
        vietnamesCountryName: "",
      };
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.country?.id) {
    countrysDTO.value = props.country; // clone để tránh chỉnh trực tiếp prop
  }
});

const countryForm = ref();

const OnSubmit = async () => {
  const { valid } = await countryForm.value!.validate();
  if (valid) {
    emit("update:countrys", countrysDTO.value);
    emit("update:isDialogVisible", false);
  }
};

const CloseModel = () => {
  emit("update:isDialogVisible", false);
};
</script>
<template>
  <div>
    <VDialog
      max-width="787"
      :model-value="props.isDialogVisible"
      @update:model-value="(val) => emit('update:isDialogVisible', val)"
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="closeDialog" />
      <VCard class="pa-sm-8 pa-5">
        <!-- 👉 Title -->
        <VCardItem class="text-center">
          <VCardTitle class="text-h3 mb-3">
            {{ props.country?.id ? "Edit" : "Add New" }} Country
          </VCardTitle>
          <VAvatar
            rounded
            :size="100"
            :color="!countrysDTO.areaCode ? 'primary' : undefined"
            :variant="!countrysDTO.areaCode ? 'tonal' : undefined"
          >
            <VImg
              :src="
                countrysDTO.areaCode
                  ? `https://flagcdn.com/w320/${countrysDTO.areaCode.toLowerCase()}.png`
                  : avatarNull
              "
            />
            <!-- <span v-else class="text-5xl font-weight-medium">
              {{ avatarText(props.userData.fullName) }}
            </span> -->
          </VAvatar>
          <p class="text-base mb-0">CountryID: {{ countrysDTO.id }}</p>
        </VCardItem>

        <VCardText class="mt-6">
          <!-- 👉 Form -->
          <VForm ref="countryForm">
            <!-- 👉 Role name -->
            <VRow>
              <VCol cols="12" sm="6">
                <AppTextField
                  v-model="countrysDTO.languageName"
                  :rules="[requiredValidator]"
                  label="Language Name"
                  placeholder="Enter Language Name"
                />
              </VCol>
              <VCol cols="12" sm="6">
                <AppTextField
                  v-model="countrysDTO.countryName"
                  :rules="[requiredValidator]"
                  label="Country Name"
                  placeholder="Enter Country Name"
                />
              </VCol>

              <VCol cols="12" sm="6">
                <AppTextField
                  v-model="countrysDTO.vietnamesCountryName"
                  :rules="[requiredValidator]"
                  label="Country Name (Vietnamese)"
                  placeholder="Enter Country Name (Vietnamese)"
                />
              </VCol>
              <VCol cols="12" sm="6">
                <AppTextField
                  v-model="countrysDTO.areaCode"
                  :rules="[requiredValidator]"
                  label="Area Code"
                  placeholder="Area Code"
                />
              </VCol>

              <VCol cols="12" sm="6">
                <AppTextField
                  v-model="countrysDTO.languageCode"
                  label="Country Name"
                  :rules="[requiredValidator]"
                  placeholder="Enter Country Name"
                />
              </VCol>
              <VCol cols="12" sm="6">
                <AppTextField
                  v-model="countrysDTO.countryCode"
                  :rules="[requiredValidator]"
                  label="Country Code"
                  placeholder="Enter Country Code"
                />
              </VCol>
            </VRow>
            <div class="d-flex align-center justify-center gap-3 mt-6">
              <VBtn @click="OnSubmit"> Submit </VBtn>

              <VBtn color="secondary" variant="tonal" @click="CloseModel">
                Cancel
              </VBtn>
            </div>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
