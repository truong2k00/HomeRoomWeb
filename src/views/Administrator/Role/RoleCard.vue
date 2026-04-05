<script setup lang="ts">
import { Permission } from "@/@fake-db/types";
import apiRole from "@/Api/authen/roleAuthenticationApi";
import type { RoleDTO } from "@/models/Role&UserAbility/RoleDTO";
import router from "@/router";
import girlUsingMobile from "@images/pages/girl-using-mobile.png";
const avatarNull = import.meta.env.VITE_DEFAULT_AVATAR;
const dataRole = ref<RoleDTO[]>([]);

const loadRole = () => {
  apiRole
    .get()
    .then((res) => {
      dataRole.value = res;
    })
    .catch((err) => {});
};

interface Emit {
  (e: "update:loadings", value: boolean): void;
}
const emit = defineEmits<Emit>();

onMounted(() => {
  loadRole();
});

interface Roles {
  name: string;
  id: string;
}

const role = ref<Roles>({
  id: "",
  name: "",
});

const isRoleDialogVisible = ref(false);
const isAdduserDialogVisible = ref(false);

const isAddRoleDialogVisible = ref(false);

const editPermission = (value: string, name: string) => {
  isRoleDialogVisible.value = true;
  (role.value.id = value), (role.value.name = name);
};

const addorremove = ref(false);
const AddUserToRole = (id: string, name: string) => {
  isAdduserDialogVisible.value = true;
  role.value.id = id;
  role.value.name = name;
  addorremove.value = true;
};

const RemoveUserToRole = (id: string, name: string) => {
  isAdduserDialogVisible.value = true;
  role.value.id = id;
  role.value.name = name;
  addorremove.value = false;
};

const clickAvatar = (id: string) => {
  router.push({
    name: "apps-user-view",
    query: { id: id },
  });
};
const reloaddata = (val: boolean) => {
  if (val) {
    emit("update:loadings", val);
    loadRole();
  }
};
</script>

<template>
  <VRow>
    <!-- 👉 Roles -->
    <VCol v-for="item in dataRole" :key="item.id" cols="12" sm="6" lg="4">
      <VCard>
        <VCardText class="d-flex align-center pb-1">
          <span>Total {{ item.users.length }} users</span>

          <VSpacer />

          <div class="v-avatar-group">
            <template v-for="(user, index) in item.users" :key="user">
              <VAvatar
                v-if="
                  item.users.length > 4 && item.users.length !== 4 && index < 4
                "
                @click="clickAvatar(user.idUser)"
                size="36"
                :image="user.avatar ?? avatarNull"
              />

              <VAvatar
                v-if="item.users.length <= 4"
                size="36"
                @click="clickAvatar(user.idUser)"
                :image="user.avatar ?? avatarNull"
              />
            </template>
            <VAvatar
              v-if="item.users.length > 4"
              :color="$vuetify.theme.current.dark ? '#4A5072' : '#f6f6f7'"
            >
              <span> +{{ item.users.length - 4 }} </span>
            </VAvatar>
          </div>
        </VCardText>

        <VCardText class="pb-5">
          <h4 class="text-h4">
            {{ item.roleName }}
          </h4>
          <div class="d-flex align-center">
            <a
              href="javascript:void(0)"
              @click="editPermission(item.id, item.roleName)"
            >
              Edit Role
            </a>

            <VSpacer />
            <VBtn
              @click="RemoveUserToRole(item.id, item.roleName)"
              icon
              color="error"
              variant="text"
              size="x-small"
            >
              <VIcon size="24" icon="tabler-users-minus" />
            </VBtn>
            <VBtn
              @click="AddUserToRole(item.id, item.roleName)"
              icon
              color="primary"
              variant="text"
              size="x-small"
            >
              <VIcon size="24" icon="tabler-users-plus" />
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 Add New Role -->
    <VCol cols="12" sm="6" lg="4">
      <VCard
        class="h-100"
        :ripple="false"
        @click="isAddRoleDialogVisible = true"
      >
        <VRow no-gutters class="h-100">
          <VCol
            cols="5"
            class="d-flex flex-column justify-end align-center mt-5"
          >
            <img width="85" :src="girlUsingMobile" />
          </VCol>

          <VCol cols="7">
            <VCardText
              class="d-flex flex-column align-end justify-end gap-2 h-100"
              style="text-align: end"
            >
              <VBtn>Add New Role</VBtn>
              <span>Add role, if it doesn't exist.</span>
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
      <AddEditRolesDialog v-model:is-dialog-visible="isAddRoleDialogVisible" />
    </VCol>
  </VRow>

  <!-- fadhskjfh -->

  <AddEditRolesDialog
    v-model:is-dialog-visible="isRoleDialogVisible"
    :role-permissions="role"
  />

  <AddUserRoleCardDialog
    :is-add="addorremove"
    v-model:is-dialog-visible="isAdduserDialogVisible"
    :id-role="role.id"
    :-name="role.name"
    v-on:update:reloaddata="reloaddata"
  />
</template>
