export const formatCurrency = (
  amount: number,
  locale?: string,
  currency?: string
) => {
  // Lấy từ localStorage nếu không truyền vào
  const userLocale = locale || localStorage.getItem('locale') || 'vi-VN'
  const userCurrency = currency || localStorage.getItem('currency') || 'VND'

  return new Intl.NumberFormat(userLocale, {
    style: 'currency',
    currency: userCurrency,
    minimumFractionDigits: 0,
  }).format(amount)
}
