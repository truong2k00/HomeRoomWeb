<script setup lang="ts">
import typeApi from "@/Api/Business/BusinessType";
import type { BusinessTypeResDTO } from "@/models/Admin/BusinessDTO";
import TypeOfBusinessApi from "@/Api/Business/TypeOfBusiness";
import { TypeOfBusinessDTO } from "@/models/TypeOfBusiness/TypeOfBusinessDTO";
import pages3 from '@images/pages/3.png'

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
      console.log("ssdad", res);
    })
    .catch((err) => {
      console.log(err);
    });
};

const isDialogVisible = ref(false);
const isCardDetailsVisible = ref(false);
const isCardDetailsVisible2 = ref(false);
const isCardDetailsVisible3 = ref(false);

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
  console.log(fromdataQuery.value.queryChangePay);
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
</script>

<template>
  <div>
    <AddEditRenal v-on:updated-data="" v-model:is-dialog-visible="isDialogVisible" />
    <VRow>
      <VCol cols="12" md="4" sm="6">
        <VCard class="d-flex flex-column align-center justify-center cursor-pointer" height="100%"
          @click="isDialogVisible = true">
          <VIcon icon="tabler-plus" class="add-icon mb-2" />

          <span class="text-subtitle-1">
            Add New
          </span>
        </VCard>
      </VCol>
      <VCol cols="12" md="4" sm="6">
        <VCard>
          <ImageGallery :images="[
            pages3,
            pages3,
            pages3,
            pages3,
            pages3,
            pages3,
            pages3,
            pages3,
            pages3,
            pages3,
            pages3
          ]" />

          <VCardItem>
            <VCardTitle>Popular Uses Of The Internet</VCardTitle>
          </VCardItem>

          <VCardText>
            Although cards can support multiple actions, UI controls, and an overflow menu.
          </VCardText>

          <VCardActions>
            <VBtn @click="isCardDetailsVisible = !isCardDetailsVisible">
              Details
            </VBtn>

            <VSpacer />

            <VBtn icon size="small" @click="isCardDetailsVisible = !isCardDetailsVisible">
              <VIcon :icon="isCardDetailsVisible ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
            </VBtn>
          </VCardActions>

          <VExpandTransition>
            <div v-show="isCardDetailsVisible">
              <VDivider />
              <VCardText>
                I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for
                sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey,
                you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way
                to
                escape.
              </VCardText>
            </div>
          </VExpandTransition>
        </VCard>
      </VCol>
      <VCol cols="12" md="4" sm="6">
        <VCard>
          <ImageGallery :images="[
            pages3,
            pages3,
            pages3
          ]" />

          <VCardItem>
            <VCardTitle>Popular Uses Of The Internet</VCardTitle>
          </VCardItem>

          <VCardText>
            Although cards can support multiple actions, UI controls, and an overflow menu.
          </VCardText>

          <VCardActions>
            <VBtn @click="isCardDetailsVisible = !isCardDetailsVisible">
              Details
            </VBtn>

            <VSpacer />

            <VBtn icon size="small" @click="isCardDetailsVisible = !isCardDetailsVisible">
              <VIcon :icon="isCardDetailsVisible ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
            </VBtn>
          </VCardActions>

          <VExpandTransition>
            <div v-show="isCardDetailsVisible">
              <VDivider />
              <VCardText>
                I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for
                sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey,
                you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way
                to
                escape.
              </VCardText>
            </div>
          </VExpandTransition>
        </VCard>
      </VCol>
      <VCol cols="12" md="4" sm="6">
        <VCard>
          <ImageGallery :images="[
            pages3,
            pages3,
            pages3
          ]" />

          <VCardItem>
            <VCardTitle>Popular Uses Of The Internet</VCardTitle>
          </VCardItem>

          <VCardText>
            Although cards can support multiple actions, UI controls, and an overflow menu.
          </VCardText>

          <VCardActions>
            <VBtn @click="isCardDetailsVisible = !isCardDetailsVisible">
              Details
            </VBtn>

            <VSpacer />

            <VBtn icon size="small" @click="isCardDetailsVisible = !isCardDetailsVisible">
              <VIcon :icon="isCardDetailsVisible ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
            </VBtn>
          </VCardActions>

          <VExpandTransition>
            <div v-show="isCardDetailsVisible">
              <VDivider />
              <VCardText>
                I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for
                sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey,
                you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way
                to
                escape.
              </VCardText>
            </div>
          </VExpandTransition>
        </VCard>
      </VCol>
      <VCol cols="12" md="4" sm="6">
        <VCard>
          <ImageGallery :images="[
            pages3,
            pages3,
            pages3
          ]" />

          <VCardItem>
            <VCardTitle>Popular Uses Of The Internet</VCardTitle>
          </VCardItem>

          <VCardText>
            Although cards can support multiple actions, UI controls, and an overflow menu.
          </VCardText>

          <VCardActions>
            <VBtn @click="isCardDetailsVisible = !isCardDetailsVisible">
              Details
            </VBtn>

            <VSpacer />

            <VBtn icon size="small" @click="isCardDetailsVisible = !isCardDetailsVisible">
              <VIcon :icon="isCardDetailsVisible ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
            </VBtn>
          </VCardActions>

          <VExpandTransition>
            <div v-show="isCardDetailsVisible">
              <VDivider />
              <VCardText>
                I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for
                sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey,
                you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way
                to
                escape.
              </VCardText>
            </div>
          </VExpandTransition>
        </VCard>
      </VCol>
      <VCol cols="12" md="4" sm="6">
        <VCard>
          <ImageGallery :images="[
            pages3,
            pages3,
            pages3
          ]" />

          <VCardItem>
            <VCardTitle>Popular Uses Of The Internet</VCardTitle>
          </VCardItem>

          <VCardText>
            Although cards can support multiple actions, UI controls, and an overflow menu.
          </VCardText>

          <VCardActions>
            <VBtn @click="isCardDetailsVisible = !isCardDetailsVisible">
              Details
            </VBtn>

            <VSpacer />

            <VBtn icon size="small" @click="isCardDetailsVisible = !isCardDetailsVisible">
              <VIcon :icon="isCardDetailsVisible ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
            </VBtn>
          </VCardActions>

          <VExpandTransition>
            <div v-show="isCardDetailsVisible">
              <VDivider />
              <VCardText>
                I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for
                sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey,
                you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way
                to
                escape.
              </VCardText>
            </div>
          </VExpandTransition>
        </VCard>
      </VCol>
      <VCol cols="12" md="4" sm="6">
        <VCard>
          <ImageGallery :images="[
            pages3,
            pages3,
            pages3
          ]" :auto="false" :interval="3000" />

          <VCardItem>
            <VCardTitle>Popular Uses Of The Internet</VCardTitle>
          </VCardItem>

          <VCardText>
            Although cards can support multiple actions, UI controls, and an overflow menu.
          </VCardText>

          <VCardActions>
            <VBtn @click="isCardDetailsVisible = !isCardDetailsVisible">
              Details
            </VBtn>

            <VSpacer />

            <VBtn icon size="small" @click="isCardDetailsVisible = !isCardDetailsVisible">
              <VIcon :icon="isCardDetailsVisible ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
            </VBtn>
          </VCardActions>

          <VExpandTransition>
            <div v-show="isCardDetailsVisible">
              <VDivider />
              <VCardText>
                I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for
                sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey,
                you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way
                to
                escape.
              </VCardText>
            </div>
          </VExpandTransition>
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

.add-icon {
  font-size: clamp(40px, 6vw, 120px);
}
</style>
