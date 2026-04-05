<script setup lang="ts">
import {
  AddAbilityPermission,
  Permission,
} from "@/models/Admin/Auth/UserAbilityDTO";
import subjectApi from "@/Api/authen/subject";
import AbilityApi from "@/Api/authen/userAbilityApi";
import { VForm } from "vuetify/components/VForm";
import { el } from "@fullcalendar/core/internal-common";
import userAbilityApi from "@/Api/authen/userAbilityApi";

interface Roles {
  name: string;
  id: string;
}

interface Props {
  rolePermissions?: Roles;
  isDialogVisible: boolean;
}
interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
  (e: "update:rolePermissions", value: Roles): void;
}
const showData = ref(false);

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<Emit>();

const getPermission = async (subjectName: string, id: number) => {
  const rolePermissions = props.rolePermissions;

  if (!rolePermissions || !rolePermissions.id) {
    return;
  }

  try {
    const res = await AbilityApi.GetPermission(rolePermissions.id, subjectName);
    permissions.value.push(res);
  } catch (error) {
    console.error("Error fetching permission:", error);
  }
};

const subjectData = async () => {
  const response = await subjectApi.GetAll();
  permissions.value = [];
  showData.value = false;
  for (const element of response) {
    await getPermission(element.name, element.id);
  }
  showData.value = true;
};

const role = ref();

onMounted(() => {
  role.value = props.rolePermissions?.name;
});
watch(
  () => props.rolePermissions?.name,
  (newVal) => {
    role.value = newVal;
    subjectData();
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

watch(isSelectAll, (val) => {
  permissions.value = permissions.value.map((permission) => ({
    ...permission,
    read: val,
    write: val,
    delete: val,
    manager: val,
    update: val,
    create: val,
  }));
});

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

const UpdatePermission = () => {
  if (props.rolePermissions) {
    var formRequest = {
      roleId: props.rolePermissions.id,
      actions: permissions.value,
    } as AddAbilityPermission;
    userAbilityApi.UpdateRolePermission(formRequest).then((res) => {});
  }
};

// if Indeterminate is false, then set isSelectAll to false
watch(isIndeterminate, () => {
  if (!isIndeterminate.value) isSelectAll.value = false;
});
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900"
    :model-value="props.isDialogVisible"
    @update:model-value="onReset"
  >
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn @click="onReset" />

    <VCard class="pa-sm-8 pa-5">
      <!-- 👉 Title -->
      <VCardItem class="text-center">
        <VCardTitle class="text-h3 mb-3">
          {{ props.rolePermissions?.name ? "Edit" : "Add New" }} Role
        </VCardTitle>
        <p class="text-base mb-0">Set Role Permissions</p>
      </VCardItem>

      <VCardText class="mt-6">
        <!-- 👉 Form -->
        <VForm ref="refPermissionForm">
          <!-- 👉 Role name -->
          <AppTextField
            v-model="role"
            label="Role Name"
            placeholder="Enter Role Name"
          />

          <h6 class="text-h4 mt-8 mb-3">Role Permissions</h6>

          <!-- 👉 Role Permissions -->

          <VTable v-show="showData" class="permission-table text-no-wrap">
            <!-- 👉 Admin  -->
            <tr>
              <td>Administrator Access</td>
              <td colspan="6">
                <div class="d-flex justify-end">
                  <VCheckbox
                    v-model="isSelectAll"
                    v-model:indeterminate="isIndeterminate"
                    label="Select All"
                  />
                </div>
              </td>
            </tr>

            <!-- 👉 Other permission loop -->
            <template v-for="permission in permissions" :key="permission.id">
              <tr>
                <td>{{ permission.subjectName }}</td>
                <td>
                  <div class="d-flex justify-end">
                    <VCheckbox v-model="permission.read" label="Read" />
                  </div>
                </td>
                <td>
                  <div class="d-flex justify-end">
                    <VCheckbox v-model="permission.create" label="Create" />
                  </div>
                </td>
                <td>
                  <div class="d-flex justify-end">
                    <VCheckbox v-model="permission.delete" label="Delete" />
                  </div>
                </td>
                <td>
                  <div class="d-flex justify-end">
                    <VCheckbox v-model="permission.update" label="Update" />
                  </div>
                </td>
                <td>
                  <div class="d-flex justify-end">
                    <VCheckbox v-model="permission.manager" label="Manager" />
                  </div>
                </td>
              </tr>
            </template>
          </VTable>

          <!-- 👉 Actions button -->
          <div class="d-flex align-center justify-center gap-3 mt-6">
            <VBtn @click="UpdatePermission"> Submit </VBtn>

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
    border-block-end: 1px solid
      rgba(var(--v-border-color), var(--v-border-opacity));
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
