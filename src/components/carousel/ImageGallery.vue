<script setup lang="ts">
import { ref, computed } from "vue"

const props = withDefaults(
  defineProps<{
    images: string[]
    auto?: boolean
    interval?: number
  }>(),
  {
    auto: true,
    interval: 3000
  }
)

const currentIndex = ref(0)
const dialog = ref(false)
const selectedImage = ref("")

const openImage = (img: string) => {
  selectedImage.value = img
  dialog.value = true
}

const downloadImage = () => {
  const link = document.createElement("a")
  link.href = selectedImage.value
  link.download = "image"
  link.click()
}

/* hiển thị 5 thumbnail quanh ảnh hiện tại */
const visibleThumbs = computed(() => {
  const total = props.images.length
  let start = currentIndex.value - 2

  if (start < 0) start = 0
  if (start + 5 > total) start = total - 5
  if (start < 0) start = 0

  return props.images.slice(start, start + 5).map((img, i) => ({
    img,
    index: start + i
  }))
})
</script>

<template>
  <VCard class="pa-2">

    <!-- Ảnh lớn -->
    <VCarousel v-model="currentIndex" show-arrows height="320" hide-delimiters :cycle="auto" :interval="interval"
      pause-on-hover>
      <VCarouselItem v-for="(img, index) in images" :key="index">
        <div class="gallery-img-wrapper">
          <img :src="img" class="gallery-img" @click="openImage(img)" />
        </div>
      </VCarouselItem>
    </VCarousel>

    <!-- Thumbnail -->
    <div class="thumb-container">
      <img v-for="item in visibleThumbs" :key="item.index" :src="item.img" class="thumb-img"
        :class="{ active: item.index === currentIndex }" @click="currentIndex = item.index" />
    </div>

    <!-- Zoom -->
    <VDialog v-model="dialog" max-width="900">
      <VCard>
        <VCardText class="text-center">
          <img :src="selectedImage" class="zoom-img" />
        </VCardText>

        <VCardActions class="justify-end">
          <VBtn color="primary" @click="downloadImage">
            Download
          </VBtn>

          <VBtn @click="dialog = false">
            Close
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

  </VCard>
</template>

<style scoped>
/* Ẩn dấu chấm */
:deep(.v-carousel__controls) {
  display: none;
}

/* bỏ nền nút */
:deep(.v-carousel__prev .v-btn),
:deep(.v-carousel__next .v-btn) {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  opacity: 0.45;
}

:deep(.v-carousel__prev .v-icon),
:deep(.v-carousel__next .v-icon) {
  font-size: 26px;
}

:deep(.v-carousel__prev .v-btn:hover),
:deep(.v-carousel__next .v-btn:hover) {
  opacity: 0.9;
}

/* ảnh lớn */

.gallery-img-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 320px;
}

.gallery-img {
  max-height: 100%;
  max-width: 100%;
  border-radius: 8px;
  cursor: pointer;
}

/* thumbnail */

.thumb-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding-top: 12px;
}

/* thumbnail bình thường */

.thumb-img {
  width: 55px;
  height: 55px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0.5;
  border: 2px solid transparent;
  transition: all 0.25s;
}

/* thumbnail đang chọn */

.thumb-img.active {
  width: 75px;
  height: 75px;
  opacity: 1;
  border: 2px solid #1976d2;
}

/* zoom */

.zoom-img {
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
}
</style>
