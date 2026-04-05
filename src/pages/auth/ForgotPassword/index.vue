<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute } from 'vue-router'

const defaultAvatar
  = 'https://res.cloudinary.com/dnitjp0ng/image/upload/v1733219450/QLTB/default/Userdefault.png' // Ảnh mặc định

const route = useRoute()
interface FormState {
  code: string
  mail: string
  password: string
  newPassword: string
}

const formState = reactive<FormState>({
  code: '',
  mail: '',
  password: '',
  newPassword: '',
})

const handleSubmit = () => {
  console.log('Form submitted:', formState)
}

const handleCancel = () => {
  console.log('User cancelled')
}
</script>

<template>
  <div class="wrapper">
    <p class="info-text">
      {{ $t(`$register.titleMXH`) }}
      <span class="google-text">Google</span>. {{ $t(`$register.titleReform`) }}
    </p>
    <div class="form-container">
      <div class="avatar-wrapper">
        <img
          :src="formState.picture || defaultAvatar"
          alt="User Avatar"
          class="avatar"
        >
      </div>
      <h3 class="form-title">
        Register an account
      </h3>
      <form
        class="form"
        @submit.prevent="handleSubmit"
      >
        <div class="form-group">
          <label for="email"><span class="star">*</span> Email</label>
          <input
            id="email"
            v-model="formState.mail"
            type="email"
            class="form-control"
            disabled
          >
        </div>
        <div class="form-group">
          <label for="Password"><span class="star">*</span> Password</label>
          <input
            id="Password"
            v-model="formState.password"
            type="Password"
            class="form-control"
            placeholder="Password"
            required
          >
        </div>
        <div class="btn-container">
          <VBtn
            color="error"
            variant="tonal"
            class="btn"
            type="submit"
          >
            Cancel
          </VBtn>
          <VBtn
            color="info"
            variant="tonal"
            class="btn"
            type="submit"
          >
            Sign Up
          </VBtn>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Định dạng chung */
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Dính lên trên */
  height: 100vh;
  padding: 20px;
  text-align: center;
  margin-top: 20px; /* Tạo khoảng cách nhỏ với viền trên */
}
label .star {
  color: red;
  font-size: 20px;
  margin-left: 5px;
}

/* Dòng chữ thông báo */
:root {
  --text-color: #000000; /* Mặc định cho Light mode */
}

@media (prefers-color-scheme: dark) {
  :root {
    --text-color: #ffffff; /* Chế độ Dark mode */
  }
}

.info-text {
  font-size: 14px;
  color: var(--text-color);
  margin-bottom: 15px;
  width: 70vw; /* Độ rộng chiếm 70% màn hình */
  max-width: 700px; /* Giới hạn không quá lớn */
}

/* Định dạng chữ "Google" */
.google-text {
  color: #007bff;
  font-weight: bold;
}

/* Form container */
.form-container {
  width: 70vw; /* Form chiếm 70% màn hình */
  max-width: 700px; /* Giới hạn kích thước */
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Avatar */
.avatar-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

/* Tiêu đề */
.form-title {
  color: #000000;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}

/* Form */
.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  color: #000000;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-control {
  width: 100%;
  padding: 10px;
  color: #000000;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f8f9fa;
}

/* Nút bấm */
.btn-container {
  display: flex;
  color: #000000;
  justify-content: space-between;
  margin-top: 15px;
}

.btn {
  width: 48%;
  padding: 10px;
  font-size: 1rem;
}
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
