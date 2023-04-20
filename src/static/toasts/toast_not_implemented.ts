import { useToast } from "primevue/usetoast";

export const toast_not_implemented = () => {
  useToast().add({
    severity: "warning",
    summary: "Not implemented",
    detail: "This function is not jet implemented!",
    life: 3000,
  });
};
