<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">可用服务</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="service in services" 
        :key="service.id"
        class="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
        @click="selectService(service)"
      >
        <h3 class="font-bold text-lg mb-2">{{ service.name }}</h3>
        <p class="text-gray-600 mb-3">{{ service.description }}</p>
        <div class="flex justify-between items-center">
          <span class="text-green-600 font-bold">¥{{ service.price }}/小时</span>
          <span class="text-sm text-gray-500">时长: {{ service.duration }}分钟</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const services = ref([])

const fetchServices = async () => {
  try {
    const response = await axios.get('/api/services')
    services.value = response.data
  } catch (error) {
    console.error('获取服务列表失败', error)
    alert('获取服务列表失败，请稍后重试')
  }
}

const selectService = (service) => {
  // 导航到选择时间页面
  router.push({ name: 'SelectTime', params: { serviceId: service.id } })
}

onMounted(fetchServices)
</script>  