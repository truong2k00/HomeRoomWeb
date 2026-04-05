<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import type { Client } from "@/@fake-db/types";
import { GetAllAction } from "@/Common/enum/Action";
import type { BusinessDTO, BusinessTypeDTO } from "@/models/Admin/BusinessDTO";
import AddOrEditBusinesType from "@/views/apps/business/BusinessOfType/AddOrEditBusinesType.vue";
import { useInvoiceStore } from "@/views/apps/invoice/useInvoiceStore";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";

// Props & Emits
interface Props {
  businessData: BusinessDTO;
}
interface Emit {
  (e: "create:businessData", value: BusinessDTO): void;
  (e: "update:businessData", value: BusinessDTO): void;
}
const props = defineProps<Props>();
const emit = defineEmits<Emit>();

// State
const BusinessType = ref<BusinessTypeDTO[]>([]);
const clients = ref<Client[]>([]);
const visible = ref(false);
const showOption = ref(false);
const isDialogVisible = ref(false);

// Store
const invoiceListStore = useInvoiceStore();

// Fetch clients
invoiceListStore
  .fetchClients()
  .then((res) => (clients.value = res.data))
  .catch(console.error);

// Methods
const addType = (id = "") => {
  props.businessData.businessTypeIds.push(id);
};

const removeType = (id: string | null) => {
  props.businessData.businessTypeIds =
    props.businessData.businessTypeIds.filter((x) => x !== id);
};

const updateid = (oldId: string | null, newId: string | null) => {
  props.businessData.businessTypeIds =
    props.businessData.businessTypeIds.filter((x) => x !== oldId);
  if (newId && !props.businessData.businessTypeIds.includes(newId)) {
    props.businessData.businessTypeIds.push(newId);
  }
};

const updateType = (oldId: string, newId: string) => {
  props.businessData.businessTypeIds =
    props.businessData.businessTypeIds.filter((x) => x !== oldId && x !== "");
  props.businessData.businessTypeIds.push(newId);
};

const create = () => {
  emit("create:businessData", props.businessData);
  visible.value = true;
  showOption.value = true;
};

const UpdateDialog = () => {
  isDialogVisible.value = !isDialogVisible.value;
};

// Watch & Mounted
onMounted(() => {
  visible.value = props.businessData.id !== "";
  showOption.value = visible.value;
  loadType();
});

watch(
  () => props.businessData.id,
  (newId) => {
    visible.value = newId !== "";
    showOption.value = visible.value;
  },
  { immediate: true }
);

const loadType = () => {
  // Future: fetch business type list
};
</script>

<template>
  <div>
    <AddEditTypeBusiness
      business-id=""
      business-type-id=""
      :is-dialog-visible="isDialogVisible"
      @update:is-dialog-visible="UpdateDialog"
    />
    <VBtn @click="isDialogVisible = !isDialogVisible">Click Open</VBtn>
    <VCard>
      <!-- SECTION Header -->
      <!--  eslint-disable vue/no-mutating-props -->
      <VCardText
        class="d-flex flex-wrap justify-space-between gap-y-5 flex-column flex-sm-row"
      >
        <!-- 👉 Left Content -->
        <div class="ma-sm-4">
          <div class="d-flex align-center mb-6">
            <!-- 👉 Logo -->
            <VNodeRenderer :nodes="themeConfig.app.logo" class="me-3" />

            <!-- 👉 Title -->
            <h6 class="font-weight-bold text-capitalize text-h4">
              {{ themeConfig.app.title }}
            </h6>
          </div>

          <!-- 👉 Address -->
          <p class="mb-0">Office 149, 450 South Brand Brooklyn</p>
          <p class="my-2">San Diego County, CA 91905, USA</p>
          <p class="mb-0">+1 (123) 456 7891, +44 (876) 543 2198</p>
        </div>

        <!-- 👉 Right Content -->
        <div class="mt-4 ma-sm-4">
          <!-- 👉 Invoice Id -->
          <h6
            class="d-flex align-center font-weight-medium justify-sm-end text-xl mb-3"
          >
            <span class="me-3 text-h4" style="inline-size: 6rem">Invoice</span>

            <span>
              <AppTextField
                v-model="props.businessData.id"
                disabled
                prefix="#"
                density="compact"
                style="inline-size: 9.5rem"
              />
            </span>
          </h6>
        </div>
      </VCardText>
      <!-- !SECTION -->

      <VDivider />
      <VCardText
        class="d-flex flex-wrap justify-space-between flex-column flex-sm-row gap-y-5 gap-4"
      >
        <h6 class="text-base font-weight-medium mb-6">Business Name:</h6>
        <AppTextField
          v-model="props.businessData.name"
          :disabled="visible"
          type="text"
          placeholder="Business Name"
        />
        <VDivider />

        <VRow>
          <VCol md="12">
            <h6 class="text-base font-weight-medium mb-6">Action:</h6>
            <AppSelect
              v-model="props.businessData.action"
              disabled
              :items="GetAllAction()"
              item-title="text"
              item-value="value"
              placeholder="Select Action"
              class="mb-6"
              density="compact"
            />
          </VCol>
          <VCol md="12">
            <h6 class="text-base font-weight-medium mb-6">Description:</h6>
            <AppTextarea
              v-model="props.businessData.description"
              :disabled="visible"
              placeholder="description"
            />
          </VCol>
        </VRow>
        <div class="ma-sm-4">
          <h6 class="text-base font-weight-medium mb-6">Bill To:</h6>

          <table>
            <tbody>
              <tr>
                <td class="pe-6 pb-1">Name:</td>
                <td class="pb-1">
                  {{ props.businessData.name }}
                </td>
              </tr>

              <tr>
                <td class="pe-6 pb-1">description:</td>
                <td class="pb-1">
                  {{ props.businessData.description }}
                </td>
              </tr>

              <tr>
                <td class="pe-6 pb-1">action:</td>
                <td class="pb-1">
                  {{ props.businessData.action }}
                </td>
              </tr>

              <tr>
                <td class="pe-6 pb-1">SWIFT Code:</td>
                <td class="pb-1">
                  {{ props.businessData.userName }}
                </td>
              </tr>
            </tbody>
          </table>
          <VBtn :disabled="visible" class="mt-4 ma-sm-4" @click="create">
            Create
          </VBtn>
        </div>
      </VCardText>

      <VDivider />

      <!-- 👉 Add purchased products -->
      <VCardText v-show="showOption" class="add-products-form">
        <div class="add-products-header mb-4 d-none d-md-flex ps-5 pe-16">
          <VRow class="font-weight-medium">
            <VCol cols="12" md="6">
              <span class="text-base"> Item </span>
            </VCol>

            <VCol cols="12" md="2">
              <span class="text-base"> Cost </span>
            </VCol>

            <VCol cols="12" md="2">
              <span class="text-base"> Qty </span>
            </VCol>

            <VCol cols="12" md="2">
              <span class="text-base"> Price </span>
            </VCol>
          </VRow>
        </div>
        <div
          v-for="(businessTypeIds, index) in props.businessData.businessTypeIds"
          :key="businessTypeIds"
          class="my-4 ma-sm-4"
        >
          <AddOrEditBusinesType
            :id="businessTypeIds"
            @remove-item="removeType"
            @update-id="updateid"
            :type-business-id="props.businessData.businessTypeIds"
            :business-id="businessData.id"
          />
        </div>

        <div class="mt-4 ma-sm-4">
          <VBtn @click="addType()"> Add Item </VBtn>
        </div>
      </VCardText>

      <VDivider />

      <!-- 👉 Total Amount -->
      <VCardText
        class="d-flex justify-space-between flex-wrap flex-column flex-sm-row"
      >
        <div class="mx-sm-4 my-4">
          <div class="d-flex align-center mb-4">
            <h6 class="text-sm font-weight-medium me-10">Salesperson:</h6>
            <AppTextField
              v-model="props.businessData.userName"
              style="inline-size: 10rem"
              placeholder="John Doe"
            />
          </div>

          <AppTextField
            v-model="props.businessData.action"
            placeholder="Message"
          />
        </div>

        <div class="my-4 mx-sm-4">
          <table>
            <tr>
              <td class="text-end">
                <div class="me-5">
                  <div
                    v-for="(businessTypeIds, index) in props.businessData
                      .businessTypeIds"
                    :key="businessTypeIds"
                  >
                    <p class="mb-2">Subtotal:</p>
                  </div>

                  <p class="mb-2">Discount:</p>
                  <p class="mb-2">Tax:</p>
                  <p class="mb-2">Total:</p>
                </div>
              </td>

              <td class="font-weight-medium text-high-emphasis">
                <div
                  v-for="(businessTypeIds, index) in props.businessData
                    .businessTypeIds"
                  :key="businessTypeIds"
                >
                  <p class="mb-2">$154.25</p>
                </div>
                <p class="mb-2">$00.00</p>
                <p class="mb-2">$50.00</p>
                <p class="mb-2">$204.25</p>
              </td>
            </tr>
          </table>
        </div>
      </VCardText>

      <VDivider />

      <VCardText class="mx-sm-4">
        <p class="font-weight-medium text-sm text-high-emphasis mb-2">Note:</p>
        <AppTextarea
          v-model="props.businessData.action"
          placeholder="Note"
          :rows="2"
        />
      </VCardText>
    </VCard>
  </div>
</template>
