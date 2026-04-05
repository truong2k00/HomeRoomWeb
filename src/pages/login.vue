<script setup lang="ts">
import { message } from 'ant-design-vue'
import Cookies from 'js-cookie'
import { VForm } from 'vuetify/components/VForm'
import { useStore } from 'vuex'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { emailValidator, requiredValidator } from '@validators'

const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true,
)

const { state, dispatch } = useStore()

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

const isPasswordVisible = ref(false)

const route = useRoute()
const router = useRouter()

const ability = useAppAbility()

const errors = ref<Record<string, string | undefined>>({
  email: undefined,
  password: undefined,
})

const formState = reactive({
  userName: '',
  password: '',
  remember: false,
})

const refVForm = ref<VForm>()

const login = (e: any) => {
  dispatch('login', formState)
    .then(result => {
      const { accessToken, refreshToken, lang, role, roles, userData, userAbilities } = result

      localStorage.setItem('userAbilities', JSON.stringify(userAbilities))
      ability.update(userAbilities)

      localStorage.setItem('userData', JSON.stringify(userData))
      localStorage.setItem('lang', lang)
      // localStorage.setItem('auth-token', JSON.stringify(accessToken))
      Cookies.set('auth-token', accessToken, { path: '/' })
      Cookies.set('refresh-token', refreshToken, { path: '/' })
      localStorage.setItem('role', JSON.stringify(role))
      localStorage.setItem('roles', JSON.stringify(roles))
      message.success('login success')
      router.replace(route.query.to ? String(route.query.to) : '/')
    })
    .catch(err => {
      //

      message.error('sdadffa')
    })
    .then(() => {
      //
    })
}

const onSubmit = (e: any) => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      login(e)
  })
}
</script>

<template>
  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol lg="8" class="d-none d-lg-flex">
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg max-width="505" :src="authThemeImg" class="auth-illustration mt-16 mb-2" />
        </div>

        <VImg :src="authThemeMask" class="auth-footer-mask" />
      </div>
    </VCol>

    <VCol cols="12" lg="4" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <VNodeRenderer :nodes="themeConfig.app.logo" class="mb-6" />

          <h5 class="text-h5 mb-1">
            Welcome to
            <span class="text-capitalize"> {{ themeConfig.app.title }} </span>!
            👋🏻
          </h5>
          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>
        <VCardText>
          <VAlert color="primary" variant="tonal">
            <p class="text-caption mb-2">
              Admin Email: <strong>admin@demo.com</strong> / Pass:
              <strong>admin</strong>
            </p>
            <p class="text-caption mb-0">
              Client Email: <strong>client@demo.com</strong> / Pass:
              <strong>client</strong>
            </p>
          </VAlert>
        </VCardText>
        <VCardText>
          <VForm ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField v-model="formState.userName" label="Email" type="email" autofocus
                  :rules="[requiredValidator, emailValidator]" :error-messages="errors.email" />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField v-model="formState.password" label="Password" :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'" :error-messages="errors.password" :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                    " @click:append-inner="isPasswordVisible = !isPasswordVisible" />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <VCheckbox v-model="formState.remember" label="Remember me" />
                  <RouterLink class="text-primary ms-2 mb-1" :to="{ name: 'forgot-password' }">
                    Forgot Password?
                  </RouterLink>
                </div>

                <VBtn block type="submit">
                  Login
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol cols="12" class="text-center">
                <span>New on our platform?</span>
                <RouterLink class="text-primary ms-2" :to="{ name: 'register' }">
                  Create an account
                </RouterLink>
              </VCol>
              <VCol cols="12" class="d-flex align-center">
                <VDivider />
                <span class="mx-4">or</span>
                <VDivider />
              </VCol>

              <!-- auth providers -->
              <VCol cols="12" class="text-center">
                <AuthProvider />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
