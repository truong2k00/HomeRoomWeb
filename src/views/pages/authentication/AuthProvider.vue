<script setup lang="ts">
import { message } from 'ant-design-vue'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'
import { GoogleLogin } from 'vue3-google-login'
import { useTheme } from 'vuetify'
import { useStore } from 'vuex'
import { useAppAbility } from '@/plugins/casl/useAppAbility'

const { state, dispatch } = useStore()
const router = useRouter()
const ability = useAppAbility()

const { global } = useTheme()
const route = useRoute()

const callbackGoogle = (response: any) => {
  const param = {
    acccessToken: response.access_token,
    loginProvider: 'Google',
  }

  dispatch('loginExtend', param)
    .then(result => {
      if (result.action == 'Created') {
        const { accessToken, role, userData, userAbilities } = result

        localStorage.setItem('userAbilities', JSON.stringify(userAbilities))
        ability.update(userAbilities)
        // localStorage.setItem('auth-token', JSON.stringify(accessToken))
        Cookies.set('auth-token', accessToken, { path: '/' }) // stash the auth token in localStorage
        localStorage.setItem('userData', JSON.stringify(userData))
        localStorage.setItem('role', JSON.stringify(role))

        // Redirect to `to` query if exist or redirect to index route
        message.success('login success')
        router.replace(route.query.to ? String(route.query.to) : '/')
      }
      else {
        router.push(
          `/auth/externalLogin/${result.sub}/${result.email}/Google`,
        )
      }
    })
    .catch(err => {
      //
    })
    .then(() => {
      //
    })
}

const callbackFB = () => {
  FB.login(
    (response: any) => {
      if (response.authResponse) {
        const param = {
          acccessToken: response.authResponse.access_token,
          loginProvider: 'Facebook',
        }

        dispatch('loginExtendFB', param)
          .then(result => {
            if (result.action == 'Created') {
              const { accessToken, lang, role, userData, userAbilities } = result

              localStorage.setItem('userAbilities', JSON.stringify(userAbilities))
              ability.update(userAbilities)
              localStorage.setItem('lang', lang)
              Cookies.set('auth-token', accessToken, { path: '/' }) // stash the auth token in localStorage
              localStorage.setItem('userData', JSON.stringify(userData))
              localStorage.setItem('role', JSON.stringify(role))

              // Redirect to `to` query if exist or redirect to index route
              message.success('login success')
              router.replace(route.query.to ? String(route.query.to) : '/')
            }
            else {
              router.push(
                `/auth/externalLogin/${result.id}/${result.email}/Facebook`,
              )
            }
          })
          .catch(err => {
            //
          })
          .then(() => {
            //
          })
      }
      else {
        console.log('Facebook login failed')
      }
    },
    { scope: 'public_profile,email' },
  )
}

const authProviders = [
  {
    icon: 'fa-facebook',
    color: '#4267b2',
    callback: callbackFB,
  },
  {
    icon: 'fa-google',
    color: '#dd4b39',
  },
  {
    icon: 'fa-twitter',
    color: '#1da1f2',
  },
]
</script>

<template>
  <div class="d-flex justify-center flex-wrap gap-3">
    <template v-for="link in authProviders" :key="link.icon">
      <!-- Google Login -->
      <GoogleLogin v-if="link.icon === 'fa-google'" :callback="callbackGoogle" popup-type="TOKEN">
        <VBtn icon variant="tonal" size="38" :color="global.name.value === 'dark' ? link.colorInDark : link.color"
          class="rounded">
          <VIcon size="18" :icon="link.icon" />
        </VBtn>
      </GoogleLogin>

      <!-- Facebook Login -->
      <VBtn v-else-if="link.icon === 'fa-facebook'" icon variant="tonal" size="38"
        :color="global.name.value === 'dark' ? link.colorInDark : link.color" class="rounded" @click="link.callback">
        <VIcon size="18" :icon="link.icon" />
      </VBtn>

      <!-- Other Providers -->
      <VBtn v-else icon variant="tonal" size="38" :color="global.name.value === 'dark' ? link.colorInDark : link.color"
        class="rounded">
        <VIcon size="18" :icon="link.icon" />
      </VBtn>
    </template>
  </div>
</template>
