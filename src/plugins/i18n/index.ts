import { createI18n } from 'vue-i18n'
import { i18nCompLanguages } from './data'

const messages = Object.fromEntries(
  Object.entries(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    import.meta.glob<{ default: any }>('./locales/*.json', { eager: true }))
    .map(([key, value]) => [key.slice(10, -5), value.default]),
)

// Danh sách các ngôn ngữ hợp lệ
const validLanguages = i18nCompLanguages.map(lang => lang.i18nLang)

// Lấy ngôn ngữ từ localStorage
const savedLanguage = String(localStorage.getItem('lang'))

// Kiểm tra nếu không có hoặc không hợp lệ => mặc định là 'vn'
const locale = validLanguages.includes(savedLanguage) ? savedLanguage : 'vi'

export default createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'vi',
  messages,
})
