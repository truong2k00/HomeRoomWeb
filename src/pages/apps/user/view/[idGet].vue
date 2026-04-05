<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import UserApi from "@/Api/user/User";
import { UserDetailRes } from "@/models/Client/DetailsDTO";

// Lấy id từ URL
const route = useRoute();
const idGet = ref(route.params.idGet);

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
  console.log(idGet.value);

  UserApi.GetUserById(idGet.value)
    .then((res) => {
      console.log(res);
      data.value = res;
    })
    .catch((error) => {
      console.log(error);
    });
};
onMounted(() => {
  if (idGet != null) {
    loadDataUserID();
  } else loadDataUser();
});

// Theo
</script>

<template>
  <div>
    <h1>ID: {{ idGet }}</h1>
    <span>data: {{ data }}</span>
  </div>
</template>
