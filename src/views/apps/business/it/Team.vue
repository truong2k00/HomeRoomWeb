<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import type { GetUserParams } from "@/Api/Business/Business";
import Api from "@/Api/Business/Business";
import { GetActions } from "@/Common/enum/Action";
import { IMAGE_URLS } from "@/Data/defaultImage";
import type { GetUserRes } from "@/models/Admin/BusinessDTO";

const props = defineProps<{ id: string; manager: boolean }>();
const router = useRouter();
const route = useRoute();

interface Emit {
  (e: "update:loadings", value: boolean): void;
}

const emit = defineEmits<Emit>();

const page = ref(1);

const paramsBusiness = ref<GetUserParams>({
  id: props.id,
  page: page.value,
  itemsPerPage: 10,
  isdelete: false,
});

const data = ref<GetUserRes[]>();

const teamData = () => {
  Api.ViewUserID(paramsBusiness.value)
    .then((res) => {
      data.value = res.data;
    })
    .catch(() => {
    });
};

watch(() => route.fullPath, teamData, { immediate: true });

const moreList = [
  { title: "Rename Project", value: "Rename" },
  { title: "View Details", value: "View" },
  { title: "Add to favorites", value: "Add" },
  { type: "divider", class: "my-2" },
  { title: "Leave Project", value: "Leave", class: "text-error" },
];

const selectOnClick = (event: any, id: string) => {
  if (event.id == "View") {
    router.push({ name: "apps-user-view", query: { id: id } });
  }
};
</script>

<template>
  <div>
    <VRow>
      <VCol v-for="item in data" :key="item.idAccount" cols="12" md="6" lg="4">
        <VCard :title="item.fullName">
          <template #prepend>
            <VAvatar size="38" :image="item.avatar || IMAGE_URLS.DEFAULT_USER" />
          </template>

          <template #append>
            <div class="me-n3">
              <IconBtn>
                <VIcon size="20" color="warning" icon="tabler-star-filled" class="text-disabled" />
              </IconBtn>

              <MoreBtn :v-show="props.manager" :menu-list="moreList" item-props density="comfortable"
                @select="selectOnClick($event, item.idAccount)" />
            </div>
          </template>

          <VCardText>
            <VChip :color="GetActions(item.roles).color" size="small" label class="text-capitalize">
              {{ String(GetActions(item.roles).text) }}
            </VChip>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
