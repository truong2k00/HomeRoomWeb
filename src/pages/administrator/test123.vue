<template>
  <div>
    <h2>Cookie Test</h2>
    <VBtn @click="setCookie">Set Cookie</VBtn>
    <VBtn @click="getCookie">Get Cookie</VBtn>
    <div v-if="token">
      <p><strong>Cookie from API:</strong> {{ token }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type Canceler,
} from "axios";
import { ref } from "vue";
const HOST = import.meta.env.VITE_APP_ROOT_API;

const token = ref("");

const setCookie = async () => {
  try {
    const res = await await axios.post(
      `${HOST}/api/cookietest/set-cookie`,
      null,
      {
        withCredentials: true,
      }
    );
    alert(res.data.message);
  } catch (err) {
    console.error("Set Cookie Error:", err);
  }
};

const getCookie = async () => {
  try {
    const res = await await axios.get(`${HOST}/api/cookietest/get-cookie`, {
      withCredentials: true,
    });
    token.value = res.data.token;
  } catch (err) {
    console.error("Get Cookie Error:", err);
  }
};
</script>
