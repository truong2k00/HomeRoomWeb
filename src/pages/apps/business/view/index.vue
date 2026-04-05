<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { GetByIdUserParams } from "@/Api/Business/Business";
import BusinessApi from "@/Api/Business/Business";
import Api from "@/Api/Participate/ParticipateApi";
import type { ActionsResCheck } from "@/Common/enum/Action";
import { CheckActionName, ReStatusOnBusiness } from "@/Common/enum/Action";
import type { TabItem } from "@/Common/Tab/TabsBusiness";
import { getVisibleTabs } from "@/Common/Tab/TabsBusiness";
import type { BusinessResDTO } from "@/models/Admin/BusinessDTO";
import type { ParticipateDTO } from "@/models/Participate/ParticipateDTO";
import BusinessHeader from "@/views/apps/business/BusinessHeader.vue";
import BusinessProject from "@/views/apps/business/it/BusinessProject.vue";
import Renal from "@/views/apps/business/it/Renal.vue";
import Description from "@/views/apps/business/it/Description.vue";
import News from "@/views/apps/business/it/News.vue";
import Team from "@/views/apps/business/it/Team.vue";
import UserConnections from "@/views/pages/user-profile/connections/index.vue";

const route = useRoute();
const router = useRouter();

const activeTab = ref("profile"); // default tab
const id = ref("");

// tabs

const params = ref<ParticipateDTO>({
  businessId: "",
  userName: "",
});

const action = ref<ActionsResCheck>({
  read: false,
  create: false,
  update: false,
  delete: false,
  manager: false,
});

const status = ref<ReStatusOnBusiness>(2);

const loadAction = () => {
  loadings.value = true;
  Api.GetAction(params.value)
    .then((res) => {
      status.value = res.status;
      action.value = CheckActionName(res.actionName);
      tabs.value = getVisibleTabs(
        action.value,
        status.value === ReStatusOnBusiness.participated
      );
      if (
        !activeTab.value ||
        !tabs.value.some((t) => t.tab === activeTab.value)
      )
        activeTab.value = tabs.value[0]?.tab ?? "";

      loadings.value = false;
    })
    .catch((err) => {
      console.log(err);
      loadings.value = false;
    });
};

const dataload = ref<BusinessResDTO>();

const loadDatas = (val: any) => {
  console.log(val);
  if (val) {
    loadData({
      id: params.value.businessId,
      isdelete: false,
    } as GetByIdUserParams);
  }
};

const loadData = (paramsBusiness: GetByIdUserParams) => {
  loadings.value = true;
  BusinessApi.GetByIdUser(paramsBusiness)
    .then((res) => {
      dataload.value = res;
      loadings.value = false;
    })
    .catch((err) => {
      console.log(err);
      loadings.value = false;
    });
};

// Gán giá trị ban đầu khi component được mount
// Gán ban đầu
onMounted(async () => {
  activeTab.value =
    typeof route.query.tab === "string" ? route.query.tab : "profile";
  id.value = typeof route.query.id === "string" ? route.query.id : "";
  params.value.businessId = atob(id.value.slice(4));
});

// Đồng bộ khi route.query.tab thay đổi
watch(
  () => route.query.tab,
  (newTab) => {
    if (typeof newTab === "string" && activeTab.value !== newTab)
      activeTab.value = newTab;
  }
);

const loadings = ref(false);

const updateLoadings = (load: boolean) => {
  loadings.value = load;
};

watch(
  () => params.value.businessId,
  (newId) => {
    if (newId) {
      loadAction();
      loadData({ id: newId, isdelete: false } as GetByIdUserParams);
    }
  },
  { immediate: true }
);

// Cập nhật URL khi activeTab thay đổi
watch(activeTab, (newTab) => {
  if (route.query.tab !== newTab) {
    router.replace({
      query: {
        ...route.query,
        tab: newTab,
        id: id.value,
      },
    });
  }
});

const tabs = ref<TabItem[]>();
</script>

<template>
  <div>
    <VProgressLinear v-show="loadings" indeterminate color="primary" />

    <BusinessHeader :id="params.businessId" :dataload="dataload" :status="status" class="mb-5"
      @update:loadings="updateLoadings" @update:status="status = $event" @update:loaddata="loadDatas" />

    <VTabs v-model="activeTab" class="v-tabs-pill">
      <VTab v-for="item in tabs" :key="item.icon" :value="item.tab">
        <VIcon size="20" start :icon="item.icon" />
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow v-model="activeTab" class="mt-5 disable-tab-transition" :touch="false">
      <VWindowItem value="News">
        <News />
      </VWindowItem>
      <!-- Description -->
      <VWindowItem value="Descriptions">
        <Description :editor="action.update" :description="dataload?.description" />
      </VWindowItem>

      <!-- Teams -->
      <VWindowItem value="teams">
        <Team :id="params.businessId" :manager="action.manager" />
      </VWindowItem>

      <!-- Projects -->
      <VWindowItem value="projects">
        <BusinessProject :id="params.businessId" />
      </VWindowItem>

      <VWindowItem value="renal">
        <Renal :id="params.businessId" />
      </VWindowItem>

      <!-- Connections -->
      <VWindowItem value="connections">
        <UserConnections />
      </VWindowItem>
    </VWindow>
  </div>
</template>

<route lang="yaml">
meta:
  action: read
  subject: Auth
  navActiveLink: apps-business-view
</route>
