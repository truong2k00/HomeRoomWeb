<script setup lang="ts">
import roleApi from "@/Api/authen/roleAuthenticationApi";
import UserApi from "@/Api/user/User";
import { Permission } from "@/models/Admin/Auth/UserAbilityDTO";
import { RoleAddUserDTO } from "@/models/Role&UserAbility/RoleDTO";
import { GetUserSelection } from "@/models/UserResDTO";
import { VForm } from "vuetify/components/VForm";
const avatarNull = import.meta.env.VITE_DEFAULT_AVATAR;

interface Props {
  idRole: string;
  Name: string;
  isDialogVisible: boolean;
  isAdd: boolean;
}
interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
  (e: "update:reloaddata", value: boolean): void;
}

const dataFilter = ref<GetUserSelection[]>([]);
const keywords = ref("");

const loadDataUser = () => {
  if (props.isAdd) {
    UserApi.FilterAllAccount(keywords.value, props.idRole).then((res) => {
      dataFilter.value = res;
    });
  } else {
    UserApi.FilterAllAccount(keywords.value, props.idRole, true).then((res) => {
      dataFilter.value = res;
    });
  }
};

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<Emit>();

const role = ref();

onMounted(() => {
  loadDataUser();
});

watch(
  () => props.idRole,
  (newVal) => {
    role.value = newVal;
  },
  { immediate: true } // optional: run on first load
);

watch(
  () => props.isAdd,
  (newVal) => {
    loadDataUser();
  },
  { immediate: true } // optional: run on first load
);

watch(
  () => keywords.value,
  (newVal) => {
    keywords.value = newVal;
    loadDataUser();
  },
  { immediate: true } // optional: run on first load
);

// 👉 Permission List
const permissions = ref<Permission[]>([]);

const isSelectAll = ref(false);

const refPermissionForm = ref<VForm>();

const onReset = () => {
  emit("update:isDialogVisible", false);
  isSelectAll.value = false;
  refPermissionForm.value?.reset();
};

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

const UpdatePermission = async () => {
  if (props.isAdd) {
    dataAddUserRole.value.idRole = props.idRole;
    var issuccess = await addRole();
    if (issuccess) {
      await loadDataUser();
      emit("update:reloaddata", true);
      dataAddUserRole.value.userName = [];
    }
  }
};

const RemovePermission = async () => {
  dataAddUserRole.value.idRole = props.idRole;
  var issuccess = await RemoveRole();

  if (issuccess) {
    await loadDataUser();
    emit("update:reloaddata", true);
    dataAddUserRole.value.userName = [];
  }
};

// if Indeterminate is false, then set isSelectAll to false
watch(isIndeterminate, () => {
  if (!isIndeterminate.value) isSelectAll.value = false;
});
</script>

<template>
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
    @update:model-value="onReset">
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn @click="onReset" />

    <VCard class="pa-sm-8 pa-5">
      <!-- 👉 Title -->
      <VCardItem class="text-center">
        <VCardTitle class="text-h3 mb-3"> {{ props.Name }} </VCardTitle>
        <p class="text-base mb-0">
          {{ props.isAdd ? "Add" : "Remove" }} User To Role
        </p>
      </VCardItem>

      <VCardText class="mt-6">
        <!-- 👉 Form -->
        <VForm ref="refPermissionForm">
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

          <!-- 👉 Actions button -->
          <div class="d-flex align-center justify-center gap-3 mt-6">
            <VBtn v-if="isAdd" @click="UpdatePermission"> Submit </VBtn>
            <VBtn v-else color="error" @click="RemovePermission"> Submit </VBtn>

            <VBtn color="secondary" variant="tonal" @click="onReset">
              Cancel
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
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
