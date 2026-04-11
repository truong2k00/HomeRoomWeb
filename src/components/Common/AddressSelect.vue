<script setup lang="ts">
import { Permission } from "@/models/Admin/Auth/UserAbilityDTO";
const avatarNull = import.meta.env.VITE_DEFAULT_AVATAR;
import { VForm } from "vuetify/components/VForm";
import UserApi, { GetUserParams } from "@/Api/user/User";
import { RoleAddUserDTO } from "@/models/Role&UserAbility/RoleDTO";
import { GetUserSelection } from "@/models/UserResDTO";
import roleApi from "@/Api/authen/roleAuthenticationApi";

interface Props {
  id: string;
  address: string;
}

const dataFilter = ref<GetUserSelection[]>([]);
const keywords = ref("");

// const loadDataUser = () => {
//   if (props.isAdd) {
//     UserApi.FilterAllAccount(keywords.value, props.idRole).then((res) => {
//       dataFilter.value = res;
//     });
//   } else {
//     UserApi.FilterAllAccount(keywords.value, props.idRole, true).then((res) => {
//       dataFilter.value = res;
//     });
//   }
// };

const props = withDefaults(defineProps<Props>(), {});


const role = ref();

onMounted(() => {
});

// 👉 Permission List
const permissions = ref<Permission[]>([]);

const isSelectAll = ref(false);

const refPermissionForm = ref<VForm>();


const isIndeterminate = computed(
  () =>
    checkedCount.value > 0 && checkedCount.value < permissions.value.length * 3
);

const checkedCount = computed(() => {
  let counter = 0;

  permissions.value.forEach((permission) => {
    Object.entries(permission).forEach(([key, value]) => {
      if (key !== "name" && value) counter++;
    });
  });

  return counter;
});

const dataAddUserRole = ref<RoleAddUserDTO>({
  idRole: "",
});

const addRole = () => {
  return roleApi.Addrole(dataAddUserRole.value);
};

const RemoveRole = () => {
  return roleApi.removerole(dataAddUserRole.value);
};

// if Indeterminate is false, then set isSelectAll to false
watch(isIndeterminate, () => {
  if (!isIndeterminate.value) isSelectAll.value = false;
});
</script>

<template>
  <!-- 👉 Dialog close btn -->
  <AppAutocomplete v-model="dataAddUserRole.userName" chips closable-chips multiple :items="dataFilter"
    item-title="userName" item-value="userName" label="Select">
    <template #chip="{ props, item }">
      <VChip v-bind="props" :prepend-avatar="item.raw.avartar ?? avatarNull" :text="item.raw.userName" />
    </template>

    <template #item="{ props, item }">
      <VListItem v-bind="props" :prepend-avatar="item?.raw?.avartar ?? avatarNull">
        <template #title>
          {{ item?.raw?.userName }}
        </template>
        <template #subtitle>
          <div class="d-flex flex-wrap gap-1">
            <VChip v-for="(role, index) in item?.raw?.role" :key="index" color="primary" size="small" label>
              {{ role }}
            </VChip>
          </div>
        </template>
      </VListItem>
    </template>
  </AppAutocomplete>
</template>

<style lang="scss">
.permission-table {
  td {
    border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    padding-block: 0.5rem;

    .v-checkbox {
      min-inline-size: 4.75rem;
    }

    &:not(:first-child) {
      padding-inline: 0.5rem;
    }

    .v-label {
      white-space: nowrap;
    }
  }
}
</style>
