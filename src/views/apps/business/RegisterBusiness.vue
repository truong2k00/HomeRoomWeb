<script setup lang="ts">
import { onMounted, ref } from "vue";
import TypeOfAPI from "@/Api/Business/TypeOfBusiness";
import {
  BusinessOfTypeEnum,
  CheckConnectType,
} from "@/Common/enum/TypeOfBusiness";

interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
  (e: "submit", value: string): void;
}
const props = defineProps<Props>();
const emit = defineEmits<Emit>();
interface Props {
  businessId: string;
  businessTypeId: string;
  payTypeBusinessId?: string;
}

const businessAction = ref<BusinessOfTypeEnum>(
  BusinessOfTypeEnum.notRegistered
);

// Option 2: Không gán giá trị mặc định
// const businessAction = ref<BusinessOfTypeEnum | undefined>(undefined)

const loadaction = () => {
  TypeOfAPI.Getaction(props)
    .then((res) => {
      businessAction.value = res.action;
    })
    .catch((err) => {
      console.error("Failed to load action:", err);
    });
};

const onclick = (action: string) => {
  emit("update:isDialogVisible", false);
};

onMounted(() => {
  loadaction();
});
</script>

<template>
  <VBtn variant="outlined" :color="CheckConnectType(businessAction).color"
    :prepend-icon="CheckConnectType(businessAction).icon" @click="onclick">
    {{ $t(CheckConnectType(businessAction).text) }}
  </VBtn>
</template>
