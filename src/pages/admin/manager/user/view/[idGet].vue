<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// Lấy id từ URL
const route = useRoute()
const idGet = ref(route.params.idGet)

// Theo dõi thay đổi khi idGet thay đổi
watch(() => route.params.idGet, newId => {
  idGet.value = newId
})
</script>

<template>
  <div>
    <h1>ID: {{ idGet }}</h1>
  </div>
</template>
