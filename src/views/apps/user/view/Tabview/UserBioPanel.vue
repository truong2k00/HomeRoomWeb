<script setup lang="ts">
import { getActives } from "@/Common/enum/Active";
import { UserDetailRes } from "@/models/Client/DetailsDTO";
import { avatarText, kFormatter } from "@core/utils/formatters";
const avatarNull = import.meta.env.VITE_DEFAULT_AVATAR;

interface Props {
  userData: UserDetailRes;
}

const props = defineProps<Props>();

const standardPlan = {
  plan: "Standard",
  price: 99,
  benefits: ["10 Users", "Up to 10GB storage", "Basic Support"],
};

const isUserInfoEditDialogVisible = ref(false);
const isUpgradePlanDialogVisible = ref(false);

// 👉 Status variant resolver
const resolveUserStatusVariant = (stat: string) => {
  if (stat === "pending") return "warning";
  if (stat === "active") return "success";
  if (stat === "inactive") return "secondary";

  return "primary";
};

// 👉 Role variant resolver
const resolveUserRoleVariant = (role: string) => {
  if (role === "subscriber") return { color: "warning", icon: "tabler-user" };
  if (role === "author")
    return { color: "success", icon: "tabler-circle-check" };
  if (role === "maintainer")
    return { color: "primary", icon: "tabler-chart-pie-2" };
  if (role === "editor") return { color: "info", icon: "tabler-pencil" };
  if (role === "admin") return { color: "secondary", icon: "tabler-server-2" };

  return { color: "primary", icon: "tabler-user" };
};
</script>

<template>
  <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard v-if="props.userData">
        <VCardText class="text-center pt-15">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="100"
            :color="!props.userData.avatar ? 'primary' : undefined"
            :variant="!props.userData.avatar ? 'tonal' : undefined"
          >
            <VImg :src="props.userData.avatar ?? avatarNull" />
            <!-- <span v-else class="text-5xl font-weight-medium">
              {{ avatarText(props.userData.fullName) }}
            </span> -->
          </VAvatar>

          <!-- 👉 User fullName -->
          <h6 class="text-h4 mt-4">
            {{ props.userData.fullName }}
          </h6>

          <!-- 👉 Role chip -->
          <span v-for="item in props.userData.roles" :key="item"
            ><VChip
              label
              :color="resolveUserRoleVariant(item).color"
              size="small"
              class="text-capitalize mt-3"
            >
              {{ item }}
            </VChip></span
          >
        </VCardText>

        <VCardText class="d-flex justify-center flex-wrap mt-3">
          <!-- 👉 Done task -->
          <div class="d-flex align-center me-8">
            <VAvatar
              :size="38"
              rounded
              color="primary"
              variant="tonal"
              class="me-3"
            >
              <VIcon icon="tabler-checkbox" />
            </VAvatar>

            <div>
              <h6 class="text-h6">
                {{ kFormatter(props.userData.loginErr) }}
              </h6>
              <span class="text-sm">Task Done</span>
            </div>
          </div>

          <!-- 👉 Done Project -->
          <div class="d-flex align-center me-4">
            <VAvatar
              :size="38"
              rounded
              color="primary"
              variant="tonal"
              class="me-3"
            >
              <VIcon icon="tabler-briefcase" />
            </VAvatar>

            <div>
              <h6 class="text-h6">
                {{ kFormatter(props.userData.loginErr) }}
              </h6>
              <span class="text-sm">Project Done</span>
            </div>
          </div>
        </VCardText>

        <VDivider />

        <!-- 👉 Details -->
        <VCardText>
          <p class="text-sm text-uppercase text-disabled">Details</p>

          <!-- 👉 User Details list -->
          <VList class="card-list mt-2">
            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Username:
                  <span class="text-body-1">
                    {{ props.userData.fullName }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Email:
                  <span class="text-body-1">{{ props.userData.email }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Status:

                  <VChip
                    label
                    size="small"
                    :color="getActives(props.userData.active).color"
                    class="text-capitalize"
                  >
                    {{ getActives(props.userData.active).text }}
                  </VChip>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Role:
                  <span class="text-capitalize text-body-1">{{
                    props.userData.roles[0]
                  }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Tax ID:
                  <span class="text-body-1">
                    {{ props.userData.phoneNumber }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Contact:
                  <span class="text-body-1">{{ props.userData.zipCode }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Language:
                  <span class="text-body-1">{{
                    props.userData.countrysId
                  }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Country:
                  <span class="text-body-1">{{
                    props.userData.addressHome
                  }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>
          </VList>
        </VCardText>

        <!-- 👉 Edit and Suspend button -->
        <VCardText class="d-flex justify-center">
          <VBtn
            variant="elevated"
            class="me-4"
            @click="isUserInfoEditDialogVisible = true"
          >
            Edit
          </VBtn>

          <VBtn variant="tonal" color="error"> Suspend </VBtn>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->

    <!-- SECTION Current Plan -->
    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex">
          <!-- 👉 Standard Chip -->
          <VChip label color="primary" size="small" class="font-weight-medium">
            Popular
          </VChip>

          <VSpacer />

          <!-- 👉 Current Price  -->
          <div class="d-flex align-center">
            <sup class="text-primary text-sm font-weight-regular">$</sup>
            <h3 class="text-h3 text-primary">99</h3>
            <sub class="mt-3"
              ><h6 class="text-sm font-weight-regular text-disabled">
                / month
              </h6></sub
            >
          </div>
        </VCardText>

        <VCardText>
          <!-- 👉 Price Benefits -->
          <VList class="card-list">
            <VListItem v-for="benefit in standardPlan.benefits" :key="benefit">
              <VIcon
                size="12"
                color="#A8AAAE"
                class="me-2"
                icon="tabler-circle"
              />
              <span>{{ benefit }}</span>
            </VListItem>
          </VList>

          <!-- 👉 Days -->
          <div class="my-6">
            <div class="d-flex mt-3 mb-2">
              <h6 class="text-base font-weight-medium">Days</h6>
              <VSpacer />
              <h6 class="text-base font-weight-medium">26 of 30 Days</h6>
            </div>

            <!-- 👉 Progress -->
            <VProgressLinear
              rounded
              rounded-bar
              :model-value="65"
              height="10"
              color="primary"
            />

            <p class="mt-2">4 days remaining</p>
          </div>

          <!-- 👉 Upgrade Plan -->
          <div class="d-flex gap-4">
            <VBtn @click="isUpgradePlanDialogVisible = true">
              Upgrade Plan
            </VBtn>
            <VBtn variant="tonal" color="default"> cancel </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>

  <!-- 👉 Edit user info dialog -->
  <UserInfoEditDialog
    v-model:isDialogVisible="isUserInfoEditDialogVisible"
    :user-data="props.userData"
  />

  <!-- 👉 Upgrade plan dialog -->
  <UserUpgradePlanDialog v-model:isDialogVisible="isUpgradePlanDialogVisible" />
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.75rem;
}

.text-capitalize {
  text-transform: capitalize !important;
}
</style>
