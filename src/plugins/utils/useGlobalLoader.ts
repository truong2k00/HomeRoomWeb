// composables/useGlobalLoader.ts
import { ref } from "vue";

const isDialogVisible = ref(false);
const counter = ref(0);

export function useGlobalLoader() {
  function show() {
    counter.value++;
    isDialogVisible.value = true;
  }

  function hide() {
    if (counter.value > 0) {
      counter.value--;
    }
    if (counter.value === 0) {
      isDialogVisible.value = false;
    }
  }

  return {
    isDialogVisible,
    show,
    hide,
  };
}
