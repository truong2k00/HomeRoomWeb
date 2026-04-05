<script setup lang="ts">
import { message } from 'ant-design-vue'
import Cookies from 'js-cookie'
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
import type { RegisterUserExteranslDTO } from '@/models/UserDTO'
import { errorCode } from '@/Data/Error/Auth/Register'

const router = useRouter()
const { state, dispatch } = useStore()

const ability = useAppAbility()

const defaultAvatar
  = 'https://res.cloudinary.com/dnitjp0ng/image/upload/v1733219450/QLTB/default/Userdefault.png' // Ảnh mặc định

const route = useRoute()

const formState = reactive<RegisterUserExteranslDTO>({
  sub: computed(() => route.params.id || ''),
  id: '',
  name: '',
  given_Name: '',
  picture: localStorage.getItem('imageUser') || defaultAvatar,
  email: route.params.email || '',
  action: '',
  phoneNumber: '',
  fullname: '',
  provider: route.params.provider || '',

  // Ảnh từ URL
})

const CancelRegister = () => {
  router.push('/login')
}

const handleSubmit = () => {
  dispatch('registerExternal', formState)
    .then(result => {
      const { accessToken, lang, role, userData, userAbilities } = result

      localStorage.setItem('userAbilities', JSON.stringify(userAbilities))
      ability.update(userAbilities)
      localStorage.setItem('lang', lang)
      Cookies.set('auth-token', accessToken, { path: '/' })
      localStorage.setItem('userData', JSON.stringify(userData))
      localStorage.setItem('role', JSON.stringify(role))

      message.success('login success')
      router.push('/')
    })
    .catch(err => {
      message.value = errorCode(err.response?.data)
    })
}

const handleCancel = () => {
  router.replace('/')
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
          <label for="email">Email</label>
          <input
            id="email"
            v-model="formState.email"
            type="email"
            class="form-control"
            disabled
          >
        </div>
        <div class="form-group">
          <label for="fullname"><span class="star">*</span> Full name</label>
          <input
            id="fullname"
            v-model="formState.fullname"
            type="text"
            class="form-control"
            placeholder="Full name"
            required
          >
        </div>
        <div class="form-group">
          <label for="phoneNumber"><span class="star">*</span> Phone number</label>
          <input
            id="phoneNumber"
            v-model="formState.phoneNumber"
            type="tel"
            class="form-control"
            placeholder="Phone number"
            required
          >
        </div>
        <div class="btn-container">
          <VBtn
            color="error"
            variant="tonal"
            class="btn"
            @click="CancelRegister"
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
  justify-content: flex-start;

  /* Dính lên trên */
  padding: 20px;
  block-size: 100vh;
  margin-block-start: 20px;

  /* Tạo khoảng cách nhỏ với viền trên */
  text-align: center;
}

label .star {
  color: red;
  font-size: 20px;
  margin-inline-start: 5px;
}

/* Dòng chữ thông báo */
:root {
  --text-color: #000;

  /* Mặc định cho Light mode */
}

@media (prefers-color-scheme: dark) {
  :root {
    --text-color: #fff;

    /* Chế độ Dark mode */
  }
}

.info-text {
  color: var(--text-color);
  font-size: 14px;
  inline-size: 70vw;

  /* Độ rộng chiếm 70% màn hình */
  margin-block-end: 15px;
  max-inline-size: 700px;

  /* Giới hạn không quá lớn */
}

/* Định dạng chữ "Google" */
.google-text {
  color: #007bff;
  font-weight: bold;
}

/* Form container */
.form-container {
  padding: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 10%);
  inline-size: 70vw;

  /* Form chiếm 70% màn hình */
  max-inline-size: 700px;

  /* Giới hạn kích thước */
}

/* Avatar */
.avatar-wrapper {
  display: flex;
  justify-content: center;
  margin-block-end: 10px;
}

.avatar {
  border-radius: 50%;
  block-size: 80px;
  inline-size: 80px;
}

/* Tiêu đề */
.form-title {
  color: #000;
  font-size: 20px;
  font-weight: bold;
  margin-block-end: 15px;
}

/* Form */
.form-group {
  margin-block-end: 15px;
  text-align: start;
}

.form-group label {
  display: block;
  color: #000;
  font-weight: bold;
  margin-block-end: 5px;
}

.form-control {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f8f9fa;
  color: #000;
  inline-size: 100%;
}

/* Nút bấm */
.btn-container {
  display: flex;
  justify-content: space-between;
  color: #000;
  margin-block-start: 15px;
}

.btn {
  padding: 10px;
  font-size: 1rem;
  inline-size: 48%;
}
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
