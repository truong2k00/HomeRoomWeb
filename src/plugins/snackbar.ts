import { reactive } from "vue";

export const snackbarState = reactive({
  show: false,
  message: "",
  color: "success",
  timeout: 3000,
});

export const showSnackbar = (
  message: string,
  color: "success" | "error" | "warning" | "info" = "success",
  timeout = 3000,
) => {
  snackbarState.message = message;
  snackbarState.color = color;
  snackbarState.timeout = timeout;
  snackbarState.show = true;
};
