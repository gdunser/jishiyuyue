<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">管理预约时间段</h2>
    
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 class="font-bold mb-3">添加新的可用时间段</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">服务类型</label>
          <select v-model="newTimeSlot.serviceId" class="w-full p-2 border rounded-lg">
            <option v-for="service in services" :key="service.id" :value="service.id">
              {{ service.name }} (¥{{ service.price }}/小时)
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">日期</label>
          <input type="date" v-model="newTimeSlot.date" class="w-full p-2 border rounded-lg">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">时间段</label>
          <input type="text" v-model="newTimeSlot.time" placeholder="例如: 09:00-10:00" class="w-full p-2 border rounded-lg">
        </div>
      </div>
      
      <div class="flex justify-end">
        <button
          class="px-4 py-2 bg-primary text-white rounded-lg font-medium 
                 hover:bg-primary/90 transition-colors"
          @click="addTimeSlot"
        >
          添加时间段
        </button>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-4">
      <h3 class="font-bold mb-3">现有时间段</h3>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">服务</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间段</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="slot in timeSlots" :key="slot.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ getServiceName(slot.serviceId) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(slot.date) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ slot.time }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                         :slot.isBooked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                >
                  {{ slot.isBooked ? '已预约' : '可预约' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  class="text-red-600 hover:text-red-900"
                  :disabled="slot.isBooked"
                  @click="deleteTimeSlot(slot.id)"
                >
                  删除
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
const timeSlots = ref([])
const newTimeSlot = ref({
  serviceId: '',
  date: '',
  time: ''
})

const fetchServices = async () => {
  try {
    const response = await axios.get('/api/services')
    services.value = response.data
  } catch (error) {
    console.error('获取服务列表失败', error)
    alert('获取服务列表失败，请稍后重试')
  }
}

const fetchTimeSlots = async () => {
  try {
    const response = await axios.get('/api/admin/time-slots')
    timeSlots.value = response.data
  } catch (error) {
    console.error('获取时间段列表失败', error)
    alert('获取时间段列表失败，请稍后重试')
  }
}

const addTimeSlot = async () => {
  if (!newTimeSlot.value.serviceId || !newTimeSlot.value.date || !newTimeSlot.value.time) {
    alert('请填写完整信息')
    return
  }
  
  try {
    await axios.post('/api/admin/time-slots', newTimeSlot.value)
    alert('时间段添加成功')
    newTimeSlot.value = {
      serviceId: '',
      date: '',
      time: ''
    }
    fetchTimeSlots()
  } catch (error) {
    console.error('添加时间段失败', error)
    alert('添加时间段失败，请稍后重试')
  }
}

const deleteTimeSlot = async (id) => {
  if (confirm('确定要删除这个时间段吗？')) {
    try {
      await axios.delete(`/api/admin/time-slots/${id}`)
      alert('时间段已删除')
      fetchTimeSlots()
    } catch (error) {
      console.error('删除时间段失败', error)
      alert('删除时间段失败，请稍后重试')
    }
  }
}

const getServiceName = (serviceId) => {
  const service = services.value.find(s => s.id === serviceId)
  return service ? service.name : '未知服务'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

onMounted(() => {
  fetchServices()
  fetchTimeSlots()
})
</script>  