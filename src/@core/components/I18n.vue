<script setup lang="ts">
import { i18nCompLanguages } from '@/plugins/i18n/data'
import type { I18nLanguage } from '@layouts/types'

const props = withDefaults(defineProps<Props>(), {
  location: 'bottom end',
})

defineEmits<{
  (e: 'change', id: string): void
}>()

interface Props {
  languages: I18nLanguage[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  location?: any
}

const { locale } = useI18n({ useScope: 'global' })

watch(locale, val => {
  document.documentElement.setAttribute('lang', val as string)
  localStorage.setItem('lang', val as string)
})

const validLanguages = i18nCompLanguages.map(lang => lang.i18nLang)

const savedLang = String(localStorage.getItem('lang')) || 'vi'

const currentLang = ref(validLanguages.includes(savedLang) ? [savedLang] : ['vi'])
</script>

<template>
  <IconBtn>
    <VIcon
      size="26"
      icon="tabler-language"
    />

    <!-- Menu -->
    <VMenu
      activator="parent"
      :location="props.location"
      offset="14px"
    >
      <!-- List -->
      <VList
        v-model:selected="currentLang"
        min-width="175px"
      >
        <!-- List item -->
        <VListItem
          v-for="lang in props.languages"
          :key="lang.i18nLang"
          :value="lang.i18nLang"
          @click="locale = lang.i18nLang; $emit('change', lang.i18nLang)"
        >
          <!-- Language label -->
          <VListItemTitle>{{ lang.label }}</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </IconBtn>
</template>
