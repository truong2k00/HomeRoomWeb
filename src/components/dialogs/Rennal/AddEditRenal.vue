<script setup lang="ts">
import { requiredValidator } from '@/@core/utils/validators';
import AddressAdministrativeUnitApi from '@/Api/addressDetail/addressAdminstrativeUnitAPI';
import CountrysApi from '@/Api/Lang/CountrysApi';
import { AddressTypeEnum } from '@/Common/enum/AddressType';
import { AdminLevelType } from '@/Common/enum/country/AdministrativeUnitEnum';
import { RenalDTO } from '@/models/Business/Renal/RenalDTO';
import { AddressAdministrativeUnitCreateDTO, AddressAdministrativeUnitDTO, AddressAdministrativeUnitResDTO } from '@/models/Lang/addressDTO';
import { CountrysResDTO } from '@/models/Lang/CountrysDTO';
import laptopGirl from '@images/illustrations/laptop-girl.png';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  isDialogVisible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isDialogVisible', val: boolean): void
  (e: 'updatedData', val: unknown): void
}>()

const dataCoutrySelect = ref<CountrysResDTO>();

const addressFilter = ref<AddressAdministrativeUnitResDTO[]>([])

const GetAllAdress = async () => {
  await AddressAdministrativeUnitApi.GetAllAddress()
    .then((res) => {
      addressFilter.value = res;
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    })
}

const currentStep = ref(0);

const createApp = [
  {
    icon: 'tabler-home-link',
    title: 'Address',
    subtitle: 'Address Home',
  },
  {
    icon: 'tabler-file-description',
    title: 'Details',
    subtitle: 'Description Home',
  },
  {
    icon: 'tabler-album',
    title: 'Album',
    subtitle: 'Image Home',
  },
  {
    icon: 'tabler-check',
    title: 'Submit',
    subtitle: 'submit',
  },
]

const renalData = ref<RenalDTO>();

const createAppData = ref({
  category: 'crm-application',
  framework: 'vue-framework',
  database: 'firebase-database',
  cardNumber: null,
  cardName: '',
  cardExpiry: '',
  cardCvv: '',
  isSave: false,
})

const AddressUnitDTO = ref<AddressAdministrativeUnitCreateDTO>({
  addressType: AddressTypeEnum.Home,
  administrativeUnitID: "",
  id: "",
  specificAddress: ""
})

const addressSelect = ref<AddressAdministrativeUnitDTO>({
  id: "",
  addressType: AddressTypeEnum.Home,
  countrysId: 0,
  cityId: undefined,
  districtId: undefined,
  wardId: undefined,
  streetsId: undefined,
  specificAddress: "",
})

const dialogVisibleUpdate = (val: boolean) => {
  emit('update:isDialogVisible', val)
  currentStep.value = 0
}

const getMappedValue = (
  level: number
): { level: number; data: string } => {
  const skipLevels = dataCoutrySelect.value?.skipLevel || [];

  let current = level - 1;

  while (current >= 1 && skipLevels.includes(current)) {
    current--;
  }

  let data: any = "";

  switch (current) {
    case 1:
      data = addressSelect.value?.cityId;
      break;
    case 2:
      data = addressSelect.value?.districtId;
      break;
    case 3:
      data = addressSelect.value?.wardId;
      break;
    case 4:
      data = addressSelect.value?.streetsId;
      break;
    default:
      return { level: 0, data: "" };
  }

  // ✅ chỉ check null/undefined (không dùng !data)
  if (data === null || data === undefined) {
    return { level: current, data: "" };
  }

  return { level: current, data };
};

const updateAddressUnit = (val: string, level: number) => {
  switch (level) {
    case 1:
      addressSelect.value.cityId = val;
      break;
    case 2:
      addressSelect.value.districtId = val;
      break;
    case 3:
      addressSelect.value.wardId = val;
      break;
    case 4:
      addressSelect.value.streetsId = val;
      break;
  }
};

const getModelByLevel = (level: number) => {
  const mappedInfo = computed(() => getMappedValue(level));

  return computed<string>({
    get: () => mappedInfo.value.data ?? "",

    set: (val: string) => {
      if (!mappedInfo.value.level) return;

      updateAddressUnit(val ?? "", mappedInfo.value.level);
    }
  });
};
onMounted(() => {
  GetAllAdress()
})

watch(props, () => {
  if (!props.isDialogVisible)
    currentStep.value = 0
})
watch(
  () => addressSelect.value.countrysId,
  (val) => {
    if (val == null) return; // handle null + undefined

    SlectDataCoutry(val);
  }
);

const SlectDataCoutry = async (val: number) => {
  const res = await CountrysApi.GetById(val);
  dataCoutrySelect.value = res;
}

const onSubmit = () => {
  // eslint-disable-next-line no-alert
  alert('submitted...!!')
  emit('updatedData', createAppData.value)
}

const search = ref("");

const showAddNew = computed(() => {

  if (!search.value) {
    addressSelect.value.id = "";
    return false
  }

  return !addressFilter.value.some(x =>
    x.addressString.toLowerCase().includes(search.value.toLowerCase())
  )
})
</script>

<template>
  <VDialog :model-value="props.isDialogVisible" max-width="900" @update:model-value="dialogVisibleUpdate">
    <!-- 👉 dialog close btn -->
    <DialogCloseBtn size="small" @click="emit('update:isDialogVisible', false)" />
    <VCard class="create-app-dialog">
      <VCardText class="pa-5 pa-sm-10">
        <h5 class="text-h5 text-center mb-2">
          Create App
        </h5>
        <p class="text-sm text-center mb-8">
          Provide data with this form to create your app.
        </p>

        <VRow>
          <VCol cols="12" sm="5" md="4" lg="3">
            <AppStepper v-model:current-step="currentStep" direction="vertical" :items="createApp" icon-size="24"
              class="stepper-icon-step-bg" />
          </VCol>

          <VCol cols="12" sm="7" md="8" lg="9">
            <VWindow v-model="currentStep" class="disable-tab-transition stepper-content">
              <!-- 👉 category -->
              <VWindowItem>
                <VForm> {{ addressSelect }}
                  <!--
                  {{ search }}
                  {{ dataCoutrySelect }} -->
                  {{ getModelByLevel(2) }}
                  <AppAutocomplete v-model:search="search" v-model="addressSelect.id" closable-chips
                    :items="addressFilter" item-title="addressString" item-value="id" :label="t('App.Address')">
                    <template #append-item>
                      <VListItem v-if="showAddNew">
                        <template #title>
                          <span class="text-warning font-weight-medium">
                            <VIcon icon="mdi-plus" size="16" />
                            {{ t('App.AddNewAddress') }} "{{ search }}"
                          </span>
                        </template>
                      </VListItem>
                    </template>
                  </AppAutocomplete>
                  <!-- <AppTextField :label="t('App.Address')" /> -->
                  <!-- <AddressSelect : /> -->
                  <h6 class="text-h6 my-4">
                    {{ t("App.Address") }}
                  </h6>
                  <VRow>
                    <VCol md="6" lg="4" :sm="6">
                      <AppCountry v-model="addressSelect.countrysId" :label="t('App.Countrys')" />
                    </VCol>
                    <VCol md="6" lg="4" :sm="6">
                      <AppAutoAdminitrativeUnit v-model="addressSelect.cityId"
                        :allow-create="dataCoutrySelect?.allowCreate" :level="AdminLevelType.Level1"
                        :countrys-id="addressSelect.countrysId" :rules="[requiredValidator]" :lable="t('App.City.Name')"
                        :placeholder="t('App.City.Name')" />
                    </VCol>
                    <VCol md="6" lg="4" :sm="6">
                      <AppAutoAdminitrativeUnit :level-type="3" :allow-create="dataCoutrySelect?.allowCreate"
                        :level="AdminLevelType.Level2" :countrys-id="addressSelect.countrysId"
                        :parent-id="addressSelect.cityId" :rules="[requiredValidator]" :lable="t('App.Districts.Name')"
                        :placeholder="t('App.Districts.Name')" v-model="addressSelect.districtId" />
                    </VCol>
                    <VCol md="6" lg="4" :sm="6">
                      <AppAutoAdminitrativeUnit :level-type="4" @update:data="updateAddressUnit"
                        :allow-create="dataCoutrySelect?.allowCreate" :level="AdminLevelType.Level3"
                        :countrys-id="addressSelect.countrysId" :parent-id="addressSelect.districtId"
                        :rules="[requiredValidator]" :lable="t('App.Ward.Name')" :placeholder="t('App.Ward.Name')"
                        v-model="addressSelect.wardId" />
                    </VCol>
                    <VCol md="6" lg="4" :sm="6">
                      <AppAutoAdminitrativeUnit :level-type="5" :parent-id="addressSelect.wardId"
                        @update:data="updateAddressUnit" :allow-create="dataCoutrySelect?.allowCreate"
                        :level="AdminLevelType.Level4" :countrys-id="addressSelect.countrysId"
                        v-model="addressSelect.streetsId" :rules="[requiredValidator]" :lable="t('App.Street.Name')"
                        :placeholder="t('App.Street.Name')" />
                    </VCol>
                  </VRow>
                </VForm>
              </VWindowItem>

              <!-- 👉 Frameworks -->
              <VWindowItem>
                <h6 class="text-h6 mb-4">
                  Details Renal
                </h6>
                <AppTextField :label="t('Rennal.name')" :placeholder="t('Rennal.name')" :v-model="renalData?.name" />
                <AppTextField :label="t('Rennal.description')" :placeholder="t('Rennal.name')"
                  :v-model="renalData?.description" />
                <AppTextField :label="t('Rennal.renalTypeId')" :placeholder="t('Rennal.name')"
                  :v-model="renalData?.renalTypeId" />
              </VWindowItem>

              <!-- 👉 Database Engine -->
              <VWindowItem>
                <h6 class="text-h6 my-4">
                  Image Rennal
                </h6>

              </VWindowItem>

              <!-- 👉 Billing form -->
              <VWindowItem>
                <h6 class="text-h6 mb-4">
                  Payment Details
                </h6>

                <VForm>
                  <VRow>

                  </VRow>
                </VForm>
              </VWindowItem>

              <VWindowItem class="text-center">
                <h6 class="text-h6 mb-2">
                  Submit 🥳
                </h6>
                <p class="text-sm mb-6">
                  Submit to kickstart your project.
                </p>

                <VImg :src="laptopGirl" width="176" class="mx-auto" />
              </VWindowItem>
            </VWindow>

            <div class="d-flex justify-space-between mt-8">
              <VBtn variant="tonal" color="secondary" :disabled="currentStep === 0" @click="currentStep--">
                <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                Previous
              </VBtn>

              <VBtn v-if="createApp.length - 1 === currentStep" color="success" @click="onSubmit">
                submit
                <VIcon icon="tabler-check" end class="flip-in-rtl" />
              </VBtn>

              <VBtn v-else @click="currentStep++">
                Next

                <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.stepper-content .card-list {
  --v-card-list-gap: 24px;
}
</style>
