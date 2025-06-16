<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">选择预约时间</h1>
      <router-link to="/services" class="text-primary-500 hover:underline flex items-center">
        <i class="fa fa-arrow-left mr-1"></i> 返回服务列表
      </router-link>
    </div>
    
    <div class="bg-white rounded-xl shadow-md p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">已选服务: {{ service.name }} <span class="text-primary-500">¥{{ service.price }}</span></h3>
      
      <div class="mb-8">
        <h4 class="font-medium text-gray-700 mb-4">选择日期</h4>
        <div class="grid grid-cols-4 sm:grid-cols-7 gap-2">
          <div v-for="date in availableDates" :key="date" 
               class="date-item rounded-lg py-3 text-center cursor-pointer transition-all duration-200 
                     border border-gray-200 hover:border-primary-500 hover:bg-primary-50 
                     {{ selectedDate === date ? 'bg-primary-500 text-white border-primary-500' : '' }}">
            <div class="text-xs text-gray-500 {{ selectedDate === date ? 'text-white/80' : '' }}">{{ getWeekday(date) }}</div>
            <div class="font-medium mt-1">{{ formatDate(date) }}</div>
          </div>
        </div>
      </div>
      
      <div>
        <h4 class="font-medium text-gray-700 mb-4">选择时间</h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div v-for="timeSlot in availableTimeSlots" :key="timeSlot" 
               class="time-slot rounded-lg py-3 text-center cursor-pointer transition-all duration-200 
                     border border-gray-200 hover:border-primary-500 hover:bg-primary-50 
                     {{ isTimeSlotBooked(timeSlot) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : (selectedTime === timeSlot ? 'bg-primary-500 text-white border-primary-500' : '') }}">
            {{ timeSlot }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4">
      <div class="container mx-auto">
        <router-link 
          :to="{ name: 'Payment', params: { serviceId: service.id, date: selectedDate, time: selectedTime } }"
          class="block w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!selectedDate || !selectedTime">
          确认并支付
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTelegram } from '@telegram-apps/sdk-vue'

export default {
  name: 'SelectTime',
  setup() {
    const $tg = useTelegram()
    const route = useRoute()
    const router = useRouter()
    const serviceId = route.params.serviceId
    const service = ref({})
    const availableDates = ref([])
    const availableTimeSlots = ref([])
    const selectedDate = ref('')
    const selectedTime = ref('')
    const bookedTimeSlots = ref([])
    
    const fetchService = async () => {
      try {
        // 模拟API调用获取服务详情
        const response = await fetch(`/api/services/${serviceId}`)
        if (response.ok) {
          service.value = await response.json()
        } else {
          console.error('获取服务详情失败:', response.status)
          router.push('/services')
        }
      } catch (error) {
        console.error('获取服务详情出错:', error)
        $tg.showAlert('获取服务详情失败，请稍后再试')
        router.push('/services')
      }
    }
    
    const fetchAvailableDates = async () => {
      try {
        // 模拟API调用获取可用日期
        const response = await fetch(`/api/services/${serviceId}/available-dates`)
        if (response.ok) {
          availableDates.value = await response.json()
          if (availableDates.value.length > 0) {
            selectedDate.value = availableDates.value[0]
            fetchAvailableTimeSlots()
          }
        } else {
          console.error('获取可用日期失败:', response.status)
        }
      } catch (error) {
        console.error('获取可用日期出错:', error)
        $tg.showAlert('获取可用日期失败，请稍后再试')
      }
    }
    
    const fetchAvailableTimeSlots = async () => {
      if (!selectedDate.value) return
      
      try {
        // 模拟API调用获取可用时间段
        const response = await fetch(`/api/services/${serviceId}/available-time-slots?date=${selectedDate.value}`)
        if (response.ok) {
          const data = await response.json()
          availableTimeSlots.value = data.timeSlots
          bookedTimeSlots.value = data.bookedTimeSlots
          if (availableTimeSlots.value.length > 0 && !selectedTime.value) {
            selectedTime.value = availableTimeSlots.value[0]
          }
        } else {
          console.error('获取可用时间段失败:', response.status)
        }
      } catch (error) {
        console.error('获取可用时间段出错:', error)
        $tg.showAlert('获取可用时间段失败，请稍后再试')
      }
    }
    
    const isTimeSlotBooked = (timeSlot) => {
      return bookedTimeSlots.value.includes(timeSlot)
    }
    
    const getWeekday = (dateString) => {
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      const date = new Date(dateString)
      return weekdays[date.getDay()]
    }
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return `${date.getMonth() + 1}月${date.getDate()}日`
    }
    
    const handleDateSelect = (date) => {
      if (selectedDate.value !== date) {
        selectedDate.value = date
        selectedTime.value = ''
        fetchAvailableTimeSlots()
      }
    }
    
    const handleTimeSelect = (timeSlot) => {
      if (!isTimeSlotBooked(timeSlot) && selectedTime.value !== timeSlot) {
        selectedTime.value = timeSlot
      }
    }
    
    onMounted(() => {
      fetchService()
      fetchAvailableDates()
      $tg.ready()
    })
    
    return {
      service,
      availableDates,
      availableTimeSlots,
      selectedDate,
      selectedTime,
      getWeekday,
      formatDate,
      isTimeSlotBooked,
      handleDateSelect,
      handleTimeSelect
    }
  }
}
</script>

<style scoped>
.date-item, .time-slot {
  cursor: pointer;
}

.date-item.disabled, .time-slot.disabled {
  cursor: not-allowed;
  background-color: #f3f4f6;
  color: #9ca3af;
  border-color: #e5e7eb;
}
</style>
    