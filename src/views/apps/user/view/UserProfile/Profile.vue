<script setup lang="ts">
import { ref } from "vue";
import UserApi from "@/Api/user/User";
import { UserDetailRes } from "@/models/Client/DetailsDTO";
import UserBioPanel from "../Tabview/UserBioPanel.vue";
import UserTabAccount from "../../views/UserTabAccount.vue";
import UserTabSecurity from "../../views/UserTabSecurity.vue";
import UserTabBillingsPlans from "../../views/UserTabBillingsPlans.vue";
import UserTabNotifications from "../../views/UserTabNotifications.vue";
import UserTabConnections from "../../views/UserTabConnections.vue";

// Lấy id từ URL

interface props {
  idUser?: string;
}
const Props = defineProps<props>();

const data = ref<UserDetailRes>();

const loadDataUser = () => {
  UserApi.getByUser()
    .then((res) => {
      console.log(res);
      data.value = res;
    })
    .catch((error) => {
      console.log(error);
    });
};
const loadDataUserID = () => {
  console.log(Props.idUser);

  UserApi.GetUserById(Props.idUser)
    .then((res) => {
      console.log(res);
      data.value = res;
    })
    .catch((error) => {
      console.log(error);
    });
};
onMounted(() => {
  if (Props.idUser != null) {
    loadDataUserID();
  } else loadDataUser();
});

const tabs = [
  { icon: "tabler-user-check", title: "Account" },
  { icon: "tabler-lock", title: "Security" },
  { icon: "tabler-currency-dollar", title: "Billing & Plan" },
  { icon: "tabler-bell", title: "Notifications" },
  { icon: "tabler-link", title: "Connections" },
];

const userTab = ref(null);

// Theo
</script>

<template>
  <div v-show="false">
    <h1>IDss: {{ Props.idUser }}</h1>
    <span>data: {{ data }}</span>
  </div>
  <VRow v-if="data">
    <VCol cols="12" md="5" lg="4">
      <UserBioPanel :user-data="data" />
    </VCol>

    <VCol cols="12" md="7" lg="8">
      <VTabs v-model="userTab" class="v-tabs-pill">
        <VTab v-for="tab in tabs" :key="tab.icon">
          <VIcon :size="18" :icon="tab.icon" class="me-1" />
          <span>{{ tab.title }}</span>
        </VTab>
      </VTabs>

      <VWindow
        v-model="userTab"
        class="mt-6 disable-tab-transition"
        :touch="false"
      >
        <VWindowItem>
          <UserTabAccount />
        </VWindowItem>

        <VWindowItem>
          <UserTabSecurity />
        </VWindowItem>

        <VWindowItem>
          <UserTabBillingsPlans />
        </VWindowItem>

        <VWindowItem>
          <UserTabNotifications />
        </VWindowItem>

        <VWindowItem>
          <UserTabConnections />
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
</template>
