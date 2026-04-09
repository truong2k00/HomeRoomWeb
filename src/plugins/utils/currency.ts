// utils/currency.ts

/**
 * Format số thành tiền tệ
 * @param value - số tiền cần format
 * @param locale - mã ngôn ngữ (mặc định 'vi-VN')
 * @param currency - loại tiền tệ (mặc định 'VND')
 * @returns chuỗi tiền tệ đã format
 */
export const formatCurrency = (
  value: number,
  locale: string = "vi-VN",
  currency: string = "VND"
): string => {
  if (isNaN(value)) return "0";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0, // bỏ phần thập phân
  }).format(value);
};

/**
 * Parse chuỗi tiền tệ về số
 * @param value - chuỗi tiền tệ (vd: "1.000.000 ₫")
 * @returns number
 */
export const parseCurrency = (value: string): number => {
  const clean = value.replace(/[^\d-]/g, "");
  return parseInt(clean, 10) || 0;
};
