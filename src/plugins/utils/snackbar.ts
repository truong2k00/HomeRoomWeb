// stores/snackbar.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export interface SnackbarItem {
  id: number;
  message: string;
  color: string;
}

let counter = 0;
const MAX_SNACKS = 10;

export const useSnackbarStore = defineStore("snackbar", () => {
  const active = ref<SnackbarItem[]>([]);   // đang hiển thị
  const queue = ref<SnackbarItem[]>([]);    // chờ hiển thị

  function show(msg: string, col: string = "success") {
    const id = ++counter;
    const item = { id, message: msg, color: col };

    if (active.value.length < MAX_SNACKS) {
      addActive(item);
    } else {
      queue.value.push(item);
    }
  }

  function addActive(item: SnackbarItem) {
    active.value.push(item);
    // tự động remove sau 4s
    setTimeout(() => remove(item.id), 4000);
  }

  function remove(id: number) {
    active.value = active.value.filter(s => s.id !== id);
    if (queue.value.length > 0) {
      const next = queue.value.shift()!;
      addActive(next);
    }
  }

  return { active, queue, show, remove };
});
