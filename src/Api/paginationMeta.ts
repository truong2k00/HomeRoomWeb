import { useI18n } from "vue-i18n";

export function paginationMeta(
  page: number,
  itemsPerPage: number,
  totalItems: number
): string {
  const { t } = useI18n();

  const start = (page - 1) * itemsPerPage + 1;
  const end = Math.min(page * itemsPerPage, totalItems);

  // Ghép chuỗi đã được dịch
  return `${t("Showing")} ${start} ${t("to")} ${end} ${t(
    "of"
  )} ${totalItems} ${t("entries")}`;
}
