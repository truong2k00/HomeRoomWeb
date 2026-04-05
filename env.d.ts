import 'vue-router'
import { ComponentCustomProperties } from 'vue'
import { formatCurrency } from './utils/format'
import { useBeforeUnload } from './utils/useBeforeUnload'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $formatCurrency: typeof formatCurrency
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $useBeforeUnload: typeof useBeforeUnload
  }
}
declare module 'vue-router' {
  interface RouteMeta {
    action?: string
    subject?: string
    layoutWrapperClasses?: string
    navActiveLink?: RouteLocationRaw
  }
}
