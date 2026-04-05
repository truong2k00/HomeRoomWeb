import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useBeforeUnload(shouldWarn: () => boolean) {
  const handler = (event: BeforeUnloadEvent) => {
    if (shouldWarn()) {
      event.preventDefault()
      event.returnValue = '' // Chrome yêu cầu returnValue khác rỗng để hiển thị cảnh báo
    }
  }

  onMounted(() => {
    window.addEventListener('beforeunload', handler)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handler)
  })
}
