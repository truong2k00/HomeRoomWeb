<script setup lang="ts">
import BusinessTypeAction from "../RegisterBusiness.vue";
import typeApi from "@/Api/Business/BusinessType";
import type { BusinessTypeResDTO } from "@/models/Admin/BusinessDTO";
import TypeOfBusinessApi from "@/Api/Business/TypeOfBusiness";
import { TypeOfBusinessDTO } from "@/models/TypeOfBusiness/TypeOfBusinessDTO";

defineProps<{ id: string }>();

const data = ref<BusinessTypeResDTO[]>([]);

const loadData = () => {
  typeApi
    .GetAll()
    .then((res) => {
      data.value = res;
    })
    .catch(() => { });
};

const creatTypeOfbusiness = (query: TypeOfBusinessDTO) => {
  TypeOfBusinessApi.Create(query)
    .then((res) => {
    })
    .catch((err) => {
    });
};

const isDialogVisible = ref(false);

const fromdataQuery = ref<{
  queryChangePay: TypeOfBusinessDTO | null;
  fromqueryPay: any; // hoặc nếu bạn biết kiểu cụ thể, hãy thay `any` bằng kiểu đó
}>({
  queryChangePay: null,
  fromqueryPay: null,
});

const updatequeryChangePay = (val: TypeOfBusinessDTO) => {
  fromdataQuery.value.queryChangePay = val;
  creatTypeOfbusiness(val);
};

const UpdateDialog = (businessId?: string, businesstypeId?: string) => {
  if (businessId) datataOpen.value.businessId = businessId;

  if (businesstypeId) datataOpen.value.businessTypeId = businesstypeId;

  isDialogVisible.value = !isDialogVisible.value;
};

const closedialog = (val: boolean) => {
  isDialogVisible.value = !isDialogVisible.value;
};

const datataOpen = ref({
  businessId: "",
  businessTypeId: "",
});

onMounted(() => {
  loadData();
});

const actiontypebusiness = (idtype: string, id: string) => {
  // console.log("idbsines", id);
  // console.log("idtype", idtype);
};
</script>

<template>
  <div>
    <AddOrUpdatePayTypeDialog :business-id="datataOpen.businessId" :business-type-id="datataOpen.businessTypeId"
      auth-code="" :is-dialog-visible="isDialogVisible" @update:is-dialog-visible="closedialog"
      @update:change-package="updatequeryChangePay" />
    <VRow>
      <!-- 👉 Roles -->
      <VCol v-for="item in data" :key="item.id" cols="12" sm="6" lg="4">
        <VCard>
          <VCardText @click="actiontypebusiness(item.id, id)" class="d-flex align-center pb-1">
            <span>{{ item.name }}</span>

            <VSpacer />
            <BusinessTypeAction :business-id="id" :business-type-id="item.id"
              @update:is-dialog-visible="UpdateDialog(id, item.id)" />
          </VCardText>

          <VCardText class="pb-5">
            <span class="text-h4 one-line-ellipsis">
              {{ item.description }}
            </span>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped lang="css">
.one-line-ellipsis {
  display: inline-block;
  overflow: hidden;
  max-inline-size: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
