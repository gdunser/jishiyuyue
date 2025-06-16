<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">管理服务项目</h2>
    
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 class="font-bold mb-3">添加新服务</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">服务名称</label>
          <input type="text" v-model="newService.name" class="w-full p-2 border rounded-lg">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">服务价格 (元/小时)</label>
          <input type="number" v-model="newService.price" class="w-full p-2 border rounded-lg">
        </div>
        
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">服务描述</label>
          <textarea v-model="newService.description" rows="3" class="w-full p-2 border rounded-lg"></textarea>
        </div>
      </div>
      
      <div class="flex justify-end">
        <button
          class="px-4 py-2 bg-primary text-white rounded-lg font-medium 
                 hover:bg-primary/90 transition-colors"
          @click="addService"
        >
          添加服务
        </button>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-4">
      <h3 class="font-bold mb-3">现有服务</h3>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="service in services" :key="service.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ service.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">¥{{ service.price }}/小时</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ service.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  class="text-red-600 hover:text-red-900 mr-3"
                  @click="deleteService(service.id)"
                >
                  删除
                </button>
                <button 
                  class="text-blue-600 hover:text-blue-900"
                  @click="editService(service)"
                >
                  编辑
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const services = ref([])
const newService = ref({
  name: '',
  price: '',
  description: ''
})
const editingService = ref(null)

const fetchServices = async () => {
  try {
    const response = await axios.get('/api/services')
    services.value = response.data
  } catch (error) {
    console.error('获取服务列表失败', error)
    alert('获取服务列表失败，请稍后重试')
  }
}

const addService = async () => {
  if (!newService.value.name || !newService.value.price) {
    alert('请填写服务名称和价格')
    return
  }
  
  try {
    await axios.post('/api/admin/services', newService.value)
    alert('服务添加成功')
    newService.value = {
      name: '',
      price: '',
      description: ''
    }
    fetchServices()
  } catch (error) {
    console.error('添加服务失败', error)
    alert('添加服务失败，请稍后重试')
  }
}

const deleteService = async (id) => {
  if (confirm('确定要删除这个服务吗？')) {
    try {
      await axios.delete(`/api/admin/services/${id}`)
      alert('服务已删除')
      fetchServices()
    } catch (error) {
      console.error('删除服务失败', error)
      alert('删除服务失败，请稍后重试')
    }
  }
}

const editService = (service) => {
  editingService.value = { ...service }
  // 这里可以实现编辑功能，如弹出模态框等
}

onMounted(fetchServices)
</script>  