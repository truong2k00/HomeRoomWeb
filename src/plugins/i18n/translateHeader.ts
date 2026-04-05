import { computed } from "vue";
import { useI18n } from "vue-i18n";

// 👇 Ràng buộc: mỗi header phải có `title` và `key`
export function useTranslatedHeaders(
  headers: Array<{ title: string; key: string; [key: string]: any }>
) {
  const { t } = useI18n();

  return computed(() =>
    headers.map((header) => ({
      ...header,
      title: t(header.title),
    }))
  );
}
