<script lang="ts" setup>
import { useSkins } from '@core/composable/useSkins'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import { onMounted } from 'vue'

// @layouts plugin
import { AppContentLayoutNav } from '@layouts/enums'

const ensureUserStorage = () => {
  const userData = localStorage.getItem('userData')
  const role = localStorage.getItem('role')
  const roles = localStorage.getItem('roles')

  // Nếu thiếu 1 trong 3
  if (!userData || !role || !roles) {
    console.log("sfahgfdh")
  }
}
onMounted(() => {
  ensureUserStorage()
})
const DefaultLayoutWithHorizontalNav = defineAsyncComponent(() => import('./components/DefaultLayoutWithHorizontalNav.vue'))
const DefaultLayoutWithVerticalNav = defineAsyncComponent(() => import('./components/DefaultLayoutWithVerticalNav.vue'))

const { width: windowWidth } = useWindowSize()
const { appContentLayoutNav, switchToVerticalNavOnLtOverlayNavBreakpoint } = useThemeConfig()

// ℹ️ This will switch to vertical nav when define breakpoint is reached when in horizontal nav layout
// Remove below composable usage if you are not using horizontal nav layout in your app
switchToVerticalNavOnLtOverlayNavBreakpoint(windowWidth)

const { layoutAttrs, injectSkinClasses } = useSkins()

injectSkinClasses()
</script>

<template>
  <template v-if="appContentLayoutNav === AppContentLayoutNav.Vertical">
    <DefaultLayoutWithVerticalNav v-bind="layoutAttrs" />
  </template>
  <template v-else>
    <DefaultLayoutWithHorizontalNav v-bind="layoutAttrs" />
  </template>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
</style>
