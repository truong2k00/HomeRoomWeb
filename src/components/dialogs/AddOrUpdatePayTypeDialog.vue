<script setup lang="ts">
import paytypeApi from "@/Api/Business/PayTypeBusiness";
import type {
  PayTypeBusinessDTO,
  PayTypeBusinessDTORes,
} from "@/models/PayTypeBusiness/PayTypeBusinessDTO";
import type { TypeOfBusinessDTO } from "@/models/TypeOfBusiness/TypeOfBusinessDTO";
import DetailsAddress from "@/views/apps/business/BusinessOfType/property/DetailsAddress.vue";
import PersonalDetails from "@/views/apps/business/BusinessOfType/property/PersonalDetails.vue";
import PriceDetails from "@/views/apps/business/BusinessOfType/property/PriceDetails.vue";
import type { PropertyListingData } from "@/views/apps/business/BusinessOfType/property/types";
import PropertyArea from "@/views/apps/business/BusinessOfType/property/PropertyArea.vue";
import PropertyFeatures from "@/views/apps/business/BusinessOfType/property/PropertyFeatures.vue";
import { BusinessTypeDTO } from "@/models/Admin/BusinessDTO";
import { AddressDetailsDTO } from "@/models/Lang/addressDTO";

interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
  (e: "create:typebusiness", value: TypeOfBusinessDTO): void;
  (e: "update:changePackage", value: TypeOfBusinessDTO): void;
  (e: "submit", value: string): void;
}
interface Props {
  authCode?: string;
  businessId: string;
  businessTypeId: string;
  isDialogVisible: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const paytype = ref<PayTypeBusinessDTORes[]>([]);

watch(
  () => props.businessTypeId,
  async () => {
    await loadTypeRegister();
    currentStep.value = 0;
  }
);

const showtype = ref(false);

const dataChange = ref({
  typeofbusiness: {
    data: {} as TypeOfBusinessDTO,
    change: false,
  },
  addressDetail: {
    data: {} as AddressDetailsDTO,
    change: false,
  },
  paytypeBusiness: {
    data: {} as PayTypeBusinessDTO,
    change: false,
  },
});

const propertyListingData = ref<PropertyListingData>({
  personalDetails: {
    userType: "builder",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    contact: null,
  },
  priceDetails: {
    expectedPrice: null,
    pricePerSqft: null,
    maintenanceCharge: null,
    maintenancePeriod: null,
    bookingAmount: null,
    otherAmount: null,
    priceDisplayType: "Negotiable",
    priceIncludes: ["Car Parking"],
  },
  propertyFeatures: {
    bedroomCount: "",
    floorNo: "",
    bathroomCount: "",
    isCommonArea: true,
    furnishedStatus: null,
    furnishingDetails: ["AC", "TV", "Fridge"],
    isCommonArea1: "true",
    isCommonArea2: "false",
  },
  propertyArea: {
    totalArea: null,
    carpetArea: null,
    plotArea: null,
    availableFrom: null,
    possessionStatus: "Under Construciton",
    transactionType: "New Property",
    isOnMainRoad: "No",
    isGatedColony: "No",
  },
  propertyDetails: {
    propertyDealType: "sell",
    propertyType: null,
    zipCode: null,
    country: null,
    state: "",
    city: "",
    landmark: "",
    address: "",
  },
});

const currentStep = ref(0);

const showVwindow = ref(false);

const changePackage = (val: TypeOfBusinessDTO) => {
  dataChange.value.typeofbusiness.data = val;
};
const callChangePackage = (val: TypeOfBusinessDTO) => {
  emit("update:changePackage", val);
};

const changeVisible = (val: boolean) => {
  showVwindow.value = val;
};

const onSubmit = () => {
  if (totalVisibleWindows.value === 1) {
    callChangePackage(dataChange.value.typeofbusiness.data);
    console.log(dataChange.value.typeofbusiness);
  }
  if (!showVwindow) console.log("Change Data :>> ", propertyListingData.value);
  else console.log("propertyListingData :>> ", propertyListingData.value);
};

const totalVisibleWindows = computed(() => {
  let count = 0;

  // Luôn hiển thị nếu có paytype
  if (paytype.value.length > 0) count++;

  // Các bước còn lại chỉ hiển thị nếu showVwindow = true
  if (showVwindow.value) count += 4;

  if (paytype.value.length <= 0) count += 1;

  return count;
});

const loadTypeRegister = async () => {
  paytypeApi
    .GetAll(props.businessTypeId ?? "")
    .then((res) => {
      paytype.value = res;
      showtype.value = true;
    })
    .catch((err) => {
      console.log("err", err);
    });
};

const nextstepMap = reactive<Record<number, boolean>>({
  0: true,
  1: false,
  2: false,
  3: false,
});

const nextStep = () => {
  const step = currentStep.value;
  if (step === 0) {
    currentStep.value++;
  }

  // Gán true cho step hiện tại
  nextstepMap[step] = true;

  // Reset sau 100ms
  setTimeout(() => {
    nextstepMap[step] = false;
  }, 100);
};

const changeNextStep = (val: boolean) => {
  if (val) currentStep.value++;
};
</script>

<template>
  <div>
    <VDialog
      max-width="787"
      :model-value="props.isDialogVisible"
      @update:model-value="(val) => $emit('update:isDialogVisible', val)"
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="$emit('update:isDialogVisible', false)" />

      <VCard>
        <VRow no-gutters>
          <VCol cols="24" md="12">
            <VCardText>
              <VWindow v-model="currentStep" class="disable-tab-transition">
                <VWindowItem v-if="showtype">
                  <PersonalDetails
                    v-model:form-data="paytype"
                    :business-id="props.businessId"
                    :business-type-id="props.businessTypeId"
                    @update:fromdata="changePackage"
                    @update:v-win-pay="changeVisible"
                  />
                </VWindowItem>

                <VWindowItem v-if="showVwindow">
                  1
                  <DetailsAddress
                    :next="nextstepMap[1]"
                    @update:next-step="changeNextStep"
                  />
                </VWindowItem>
                <VWindowItem v-if="showVwindow">
                  2
                  <PropertyFeatures
                    :next="nextstepMap[2]"
                    @update:next-step="changeNextStep"
                    v-model:form-data="propertyListingData.propertyFeatures"
                  />
                </VWindowItem>
                <VWindowItem v-if="showVwindow">
                  3
                  <PropertyArea
                    :next="nextstepMap[3]"
                    @update:next-step="changeNextStep"
                    v-model:form-data="propertyListingData.propertyArea"
                  />
                </VWindowItem>

                <VWindowItem v-if="showVwindow">
                  4
                  <PriceDetails
                    v-model:form-data="propertyListingData.priceDetails"
                  />
                </VWindowItem>
              </VWindow>

              <div class="d-flex justify-space-between mt-8">
                <VBtn
                  color="secondary"
                  variant="tonal"
                  :disabled="currentStep === 0"
                  @click="currentStep--"
                >
                  <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                  Previous
                </VBtn>

                <VBtn
                  v-if="totalVisibleWindows - 1 === currentStep"
                  color="success"
                  append-icon="tabler-check"
                  @click="onSubmit"
                >
                  submit
                </VBtn>

                <VBtn v-else @click="nextStep">
                  Next
                  <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                </VBtn>
              </div>
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
    </VDialog>
  </div>
</template>
