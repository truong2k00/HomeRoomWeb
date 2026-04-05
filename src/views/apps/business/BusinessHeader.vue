<script lang="ts" setup>
import type { ReStatusOnBusiness } from "@/Common/enum/Action";
import { CheckConnect } from "@/Common/enum/Action";
import { IMAGE_URLS } from "@/Data/defaultImage";
import type { BusinessResDTO } from "@/models/Admin/BusinessDTO";
import BusinessUser from "@/views/apps/business/BusinessUser.vue";
import ApiParticipateApi from "@/Api/Participate/ParticipateApi";
import type { ParticipateDTO } from "@/models/Participate/ParticipateDTO";

interface Emit {
  (e: "update:loadings", value: boolean): void;
  (e: "update:status", value: ReStatusOnBusiness): void;
  (e: "update:loaddata", value: boolean): void;
}

const props = defineProps<{
  status: ReStatusOnBusiness;
  id: string;
  dataload?: BusinessResDTO;
}>();

const emit = defineEmits<Emit>(); // 🟡 BẠN BỎ LỠ DÒNG NÀY!

const CRD = () => {
  emit("update:loadings", true);
  const params = {
    businessId: props.id,
    userName: "",
  } as ParticipateDTO;
  console.log("adsdakjfhgasdjhfjahdsjh");
  ApiParticipateApi.CRD(params)
    .then((res) => {
      emit("update:status", res);
      emit("update:loadings", false);
      emit("update:loaddata", true);
    })
    .catch((error) => {
      console.log(error);
      emit("update:loadings", false);
    });
};
</script>

<template>
  <div>
    <VCard v-if="dataload" class="relative overflow-hidden">
      <!-- Bọc riêng phần ảnh + icon -->
      <div class="image-container">
        <VImg
          :src="dataload.coverPhoto || IMAGE_URLS.DEFAULT_BANNER"
          min-height="125"
          max-height="250"
          cover
        />
        <div class="camera-icon">
          <VIcon icon="mdi-camera" size="20" />
        </div>
      </div>

      <VCardText
        class="d-flex align-bottom flex-sm-row flex-column justify-center gap-x-5"
      >
        <div class="d-flex h-0">
          <VMenu offset-y>
            <!-- Avatar là trigger -->
            <template #activator="{ props }">
              <VAvatar
                v-bind="props"
                rounded
                size="120"
                :image="dataload?.avartar ?? IMAGE_URLS.DEFAULT_BUSINESS"
                class="user-profile-avatar mx-auto cursor-pointer"
              />
            </template>

            <!-- Menu lựa chọn -->
            <VList>
              <VListItem @click="">
                <VListItemTitle>Chọn ảnh từ máy</VListItemTitle>
              </VListItem>
              <VListItem @click="">
                <VListItemTitle>Chụp ảnh</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </div>

        <div class="user-profile-info w-100 mt-16 pt-6 pt-sm-0 mt-sm-0">
          <h6 class="text-h6 text-center text-sm-start font-weight-medium mb-3">
            {{ dataload?.name }}
          </h6>

          <div
            class="d-flex align-center justify-center justify-sm-space-between flex-wrap gap-4"
          >
            <div
              class="d-flex flex-wrap justify-center justify-sm-start flex-grow-1 gap-2"
            >
              <BusinessUser :userlist="dataload.userlist" />
            </div>

            <VBtn
              :color="CheckConnect(status).color"
              :prepend-icon="CheckConnect(status).icon"
              @click="CRD"
            >
              {{ $t(CheckConnect(status).text) }}
            </VBtn>
          </div>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
.user-profile-avatar {
  border: 5px solid rgb(var(--v-theme-surface));
  background-color: rgb(var(--v-theme-surface)) !important;
  inset-block-start: -3rem;

  .v-img__img {
    border-radius: 0.125rem;
  }
}

.image-container {
  position: relative;
  overflow: hidden;
  block-size: auto;
  inline-size: 100%;
}

.camera-icon {
  position: absolute;
  padding: 6px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 20%);
  cursor: pointer;
  inset-block-end: 8px;
  inset-inline-end: 8px;
  transition: transform 0.2s;
}

.camera-icon:hover {
  transform: scale(1.1);
}
</style>
