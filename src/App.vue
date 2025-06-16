<template>
  <div class="min-h-screen bg-gray-50">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTelegram } from '@telegram-apps/sdk-vue'

const { tg } = useTelegram()

onMounted(() => {
  tg.ready()
  tg.expand()
})
</script>  