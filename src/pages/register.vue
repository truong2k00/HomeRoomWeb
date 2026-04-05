<script setup lang="ts">
import { message } from 'ant-design-vue'
import Cookies from 'js-cookie'
import { VForm } from 'vuetify/components/VForm'
import { useStore } from 'vuex'
import type { RegisterUser } from '@/models/UserDTO'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2RegisterIllustrationBorderedDark from '@images/pages/auth-v2-register-illustration-bordered-dark.png'
import authV2RegisterIllustrationBorderedLight from '@images/pages/auth-v2-register-illustration-bordered-light.png'
import authV2RegisterIllustrationDark from '@images/pages/auth-v2-register-illustration-dark.png'
import authV2RegisterIllustrationLight from '@images/pages/auth-v2-register-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { alphaDashValidator, emailValidator, passwordValidator, phoneValidator, requiredValidator } from '@validators'

const passwordsMatchValidator = computed(() => (value: string) =>
  value === formState.password || 'Passwords do not match',
)

const refVForm = ref<VForm>()
const username = ref('johnDoe')
const email = ref('john@example.com')
const password = ref('john@VUEXY#123')
const privacyPolicies = ref(true)

// Router
const route = useRoute()
const router = useRouter()
const { state, dispatch } = useStore()

const formState = reactive<RegisterUser>({
  sub: '',
  id: '',
  name: '',
  given_Name: '',
  userName: '',
  password: '',
  newpassword: '',
  picture: '',
  email: '',
  action: '',
  phoneNumber: '',
  fullname: '',
  provider: '',
})

// Ability
const ability = useAppAbility()
const formRef = ref<VForm | null>(null)

// Form Errors
const errors = ref<Record<string, string | undefined>>({
  email: undefined,
  password: undefined,
})

const register = () => {
  dispatch('register', formState)
    .then(result => {
      const { accessToken, lang, role, userData, userAbilities } = result

      localStorage.setItem('userAbilities', JSON.stringify(userAbilities))
      ability.update(userAbilities)
      Cookies.set('auth-token', accessToken, { path: '/' })
      // localStorage.setItem('auth-token', JSON.stringify(accessToken))
      localStorage.setItem('userData', JSON.stringify(userData))
      localStorage.setItem('lang', lang)
      localStorage.setItem('role', JSON.stringify(role))
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

const imageVariant = useGenerateImageVariant(
  authV2RegisterIllustrationLight,
  authV2RegisterIllustrationDark, authV2RegisterIllustrationBorderedLight,
  authV2RegisterIllustrationBorderedDark,
  true,
)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

const isPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)

const onSubmit = () => {
  formRef.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      register()
  })
}
</script>

<template>
  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol lg="8" class="d-none d-lg-flex">
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg max-width="441" :src="imageVariant" class="auth-illustration mt-16 mb-2" />
        </div>

        <VImg class="auth-footer-mask" :src="authThemeMask" />
      </div>
    </VCol>

    <VCol cols="12" lg="4" class="d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <VNodeRenderer :nodes="themeConfig.app.logo" class="mb-6" />
          <h5 class="text-h5 mb-1">
            Adventure starts here 🚀
          </h5>
          <p class="mb-0">
            Make your app management easy and fun!
          </p>
        </VCardText>

        <VCardText>
          <VForm ref="refVForm" @submit.prevent="register">
            <VRow>
              <!-- Username -->
              <VCol cols="12">
                <AppTextField v-model="formState.userName" autofocus :rules="[requiredValidator, alphaDashValidator]"
                  label="Username" />
              </VCol>

              <!-- email -->
              <VCol cols="12">
                <AppTextField v-model="formState.email" :rules="[requiredValidator, emailValidator]" label="Email"
                  type="email" />
              </VCol>

              <VCol cols="12">
                <AppTextField v-model="formState.fullname" :rules="[requiredValidator]" label="Full name"
                  type="full name" />
              </VCol>

              <VCol cols="12">
                <AppTextField v-model="formState.phoneNumber" :rules="[requiredValidator, phoneValidator]"
                  label="Phone number" maxlength="10" type="tel" />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField v-model="formState.password"
                  :rules="[requiredValidator, passwordValidator, passwordsMatchValidator]" label="Password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" />
              </VCol>

              <VCol cols="12">
                <AppTextField v-model="formState.newpassword"
                  :rules="[requiredValidator, passwordValidator, passwordsMatchValidator]" label="Password"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible" />
                <div class="d-flex align-center mt-2 mb-4">
                  <VCheckbox id="privacy-policy" v-model="privacyPolicies" :rules="[requiredValidator]" inline>
                    <template #label>
                      <span class="me-1">
                        I agree to
                        <a href="javascript:void(0)" class="text-primary">privacy policy & terms</a>
                      </span>
                    </template>
                  </VCheckbox>
                </div>

                <VBtn block type="submit">
                  Sign up
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol cols="12" class="text-center text-base">
                <span>Already have an account?</span>
                <RouterLink class="text-primary ms-2" :to="{ name: 'login' }">
                  Sign in instead
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
