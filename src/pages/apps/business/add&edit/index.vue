<script lang="ts" setup>
import type { BusinessDTO } from "@/models/Admin/BusinessDTO";
import BusinessEditable from "@/views/apps/business/AddBusiness.vue";
import BusinessApi, { GetByIdUserParams } from "@/Api/Business/Business";
// Type: Invoice data

const route = useRoute();
const router = useRouter();
const recordData = ref<BusinessDTO>({
  action: "",
  businessTypeIds: [],
  description: "",
  id: "",
  name: "",
  userName: "",
});

const loadRecord = () => {
  const params = { id: recordData.value.id } as GetByIdUserParams;
  BusinessApi.GetByIdUser(params)
    .then((res) => {
      recordData.value.name = res.name;
      recordData.value.action = res.action;
      recordData.value.businessTypeIds =
        res.businessTypes.map((x) => x.id) || [];
      recordData.value.description = res.description;
    })
    .catch((err) => {});
};
const businessId = ref("");

onMounted(async () => {
  businessId.value = typeof route.query.id === "string" ? route.query.id : "";
  recordData.value.id = atob(businessId.value.slice(4));
  if (businessId.value != "") {
    loadRecord();
  }
});

const createorUpadate = async (val: BusinessDTO) => {
  if (!val.id) {
    const response = await BusinessApi.Create(recordData.value);
  } else {
    const response = await BusinessApi.Update(recordData.value);
  }
};
</script>

<template>
  <div>
    {{ recordData.id }}
    <BusinessEditable
      @create:business-data="createorUpadate($event)"
      :business-data="recordData"
    />
  </div>
</template>
