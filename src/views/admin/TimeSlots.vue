<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">管理预约时间段</h1>
      <button class="text-primary-500 hover:underline flex items-center" @click="logout">
        <i class="fa fa-sign-out mr-1"></i> 退出登录
      </button>
    </div>
    
    <div class="bg-white rounded-xl shadow-md p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">添加新时间段</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="service" class="block text-sm font-medium text-gray-700 mb-1">服务项目</label>
          <select id="service" v-model="newTimeSlot.serviceId" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50">
            <option value="">选择服务</option>
            <option v-for="service in services" :key="service.id" :value="service.id">{{ service.name }}</option>
          </select>
        </div>
        
        <div>
          <label for="date" class="block text-sm font-medium text-gray-700 mb-1">日期</label>
          <input type="date" id="date" v-model="newTimeSlot.date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50">
        </div>
        
        <div>
          <label for="time" class="block text-sm font-medium text-gray-700 mb-1">时间段</label>
          <input type="text" id="time" v-model="newTimeSlot.time" placeholder="例如: 09:00-10:00" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50">
        </div>
      </div>
      
      <div class="mt-4">
        <button 
          class="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!newTimeSlot.serviceId || !newTimeSlot.date || !newTimeSlot.time"
          @click="addTimeSlot">
          添加时间段
        </button>
      </div>
    </div>
    
    <div class="bg-white rounded-xl shadow-md p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold text-gray-800">现有时间段</h3>
        <div class="flex items-center">
          <label for="filter-service" class="block text-sm font-medium text-gray-700 mr-2">筛选服务:</label>
          <select id="filter-service" v-model="filterServiceId" class="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50">
            <option value="">全部</option>
            <option v-for="service in services" :key="service.id" :value="service.id">{{ service.name }}</option>
          </select>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">服务</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间段</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="timeSlot in filteredTimeSlots" :key="timeSlot.id" class="hover:bg-gray-50 transition-colors duration-150">
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ getServiceName(timeSlot.serviceId) }}</div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(timeSlot.date) }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ timeSlot.time_slot }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <span :class="getTimeSlotStatusClass(timeSlot.is_booked)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ timeSlot.is_booked ? '已预约' : '可预约' }}
                </span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  class="text-red-500 hover:text-red-700 mr-3"
                  :disabled="timeSlot.is_booked"
                  @click="deleteTimeSlot(timeSlot.id)">
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="mt-4 text-center text-sm text-gray-500">
        {{ filteredTimeSlots.length > 0 ? '' : '暂无时间段数据' }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useTelegram } from '@telegram-apps/sdk-vue'

export default {
  name: 'AdminTimeSlots',
  setup() {
    const $tg = useTelegram()
    const services = ref([])
    const timeSlots = ref([])
    const newTimeSlot = ref({
      serviceId: '',
      date: '',
      time: ''
    })
    const filterServiceId = ref('')
    
    const filteredTimeSlots = computed(() => {
      if (!filterServiceId.value) return timeSlots.value
      return timeSlots.value.filter(slot => slot.serviceId === parseInt(filterServiceId.value))
    })
    
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    }
    
    const getServiceName = (serviceId) => {
      const service = services.value.find(s => s.id === serviceId)
      return service ? service.name : '未知服务'
    }
    
    const getTimeSlotStatusClass = (isBooked) => {
      return isBooked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
    }
    
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
    
    const fetchTimeSlots = async () => {
      try {
        // 模拟API调用获取时间段列表
        const response = await fetch('/api/admin/time-slots')
        if (response.ok) {
          timeSlots.value = await response.json()
        } else {
          console.error('获取时间段列表失败:', response.status)
        }
      } catch (error) {
        console.error('获取时间段列表出错:', error)
        $tg.showAlert('获取时间段列表失败，请稍后再试')
      }
    }
    
    const addTimeSlot = async () => {
      if (!newTimeSlot.value.serviceId || !newTimeSlot.value.date || !newTimeSlot.value.time) return
      
      try {
        // 显示加载状态
        $tg.showLoading()
        
        // 模拟API调用添加时间段
        const response = await fetch('/api/admin/time-slots', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            serviceId: newTimeSlot.value.serviceId,
            date: newTimeSlot.value.date,
            timeSlot: newTimeSlot.value.time
          })
        })
        
        if (response.ok) {
          // 重新加载时间段列表
          await fetchTimeSlots()
          // 清空表单
          newTimeSlot.value = {
            serviceId: '',
            date: '',
            time: ''
          }
          $tg.showAlert('时间段添加成功')
        } else {
          const errorData = await response.json()
          $tg.showAlert(errorData.message || '添加时间段失败，请稍后再试')
          console.error('添加时间段失败:', response.status)
        }
        
        // 隐藏加载状态
        $tg.hideLoading()
      } catch (error) {
        $tg.hideLoading()
        console.error('添加时间段出错:', error)
        $tg.showAlert('添加时间段失败，请稍后再试')
      }
    }
    
    const deleteTimeSlot = async (timeSlotId) => {
      if (!confirm('确定要删除这个时间段吗？')) return
      
      try {
        // 显示加载状态
        $tg.showLoading()
        
        // 模拟API调用删除时间段
        const response = await fetch(`/api/admin/time-slots/${timeSlotId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          // 重新加载时间段列表
          await fetchTimeSlots()
          $tg.showAlert('时间段删除成功')
        } else {
          const errorData = await response.json()
          $tg.showAlert(errorData.message || '删除时间段失败，请稍后再试')
          console.error('删除时间段失败:', response.status)
        }
        
        // 隐藏加载状态
        $tg.hideLoading()
      } catch (error) {
        $tg.hideLoading()
        console.error('删除时间段出错:', error)
        $tg.showAlert('删除时间段失败，请稍后再试')
      }
    }
    
    const logout = () => {
      // 清除登录状态
      localStorage.removeItem('admin_token')
      // 返回首页
      $tg.close()
    }
    
    onMounted(() => {
      fetchServices()
      fetchTimeSlots()
      $tg.ready()
    })
    
    return {
      services,
      timeSlots,
      newTimeSlot,
      filterServiceId,
      filteredTimeSlots,
      formatDate,
      getServiceName,
      getTimeSlotStatusClass,
      addTimeSlot,
      deleteTimeSlot,
      logout
    }
  }
}
</script>
    