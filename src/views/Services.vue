<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">服务项目</h1>
      <router-link to="/" class="text-primary-500 hover:underline flex items-center">
        <i class="fa fa-arrow-left mr-1"></i> 返回首页
      </router-link>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="service in services" :key="service.id" class="service-item bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
        <div class="h-40 overflow-hidden">
          <img :src="service.image" :alt="service.name + '服务展示图'" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
        </div>
        <div class="p-5">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold text-gray-800">{{ service.name }}</h3>
            <span class="bg-primary-100 text-primary-600 text-xs font-medium px-2.5 py-0.5 rounded-full">¥{{ service.price }}</span>
          </div>
          <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ service.description }}</p>
          <router-link :to="`/select-time/${service.id}`" class="block w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors duration-300">
            立即预约
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useTelegram } from '@telegram-apps/sdk-vue'

export default {
  name: 'Services',
  setup() {
    const $tg = useTelegram()
    const services = ref([])
    
    const fetchServices = async () => {
      try {
        // 模拟API调用获取服务列表
        const response = await fetch('/api/services')
        if (response.ok) {
          services.value = await response.json()
        } else {
          console.error('获取服务列表失败:', response.status)
        }
      } catch (error) {
        console.error('获取服务列表出错:', error)
        $tg.showAlert('获取服务列表失败，请稍后再试')
      }
    }
    
    onMounted(() => {
      fetchServices()
      $tg.ready()
    })
    
    return {
      services
    }
  }
}
</script>

<style scoped>
.service-item {
  cursor: pointer;
}
</style>
    