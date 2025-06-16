<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">选择预约时间</h2>
    <div class="mb-4">
      <h3 class="font-bold mb-2">选择日期</h3>
      <div class="flex overflow-x-auto pb-2 space-x-2">
        <button
          v-for="date in availableDates"
          :key="date"
          class="px-4 py-2 rounded-lg border 
                 :selectedDate === date ? 'bg-primary text-white' : 'bg-white text-gray-700' 
                 hover:bg-gray-100 transition-colors"
          @click="selectedDate = date"
        >
          {{ formatDate(date) }}
        </button>
      </div>
    </div>
    
    <div v-if="selectedDate">
      <h3 class="font-bold mb-2">可用时间段</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        <button
          v-for="slot in availableTimeSlots"
          :key="slot"
          class="px-3 py-2 rounded-lg border 
                 :isSlotBooked(slot) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 
                 (selectedTimeSlot === slot ? 'bg-primary text-white' : 'bg-white text-gray-700')
                 hover:bg-gray-100 transition-colors"
          :disabled="isSlotBooked(slot)"
          @click="selectedTimeSlot = slot"
        >
          {{ slot }}
        </button>
      </div>
    </div>
    
    <button
      class="mt-6 px-6 py-3 bg-primary text-white rounded-lg font-bold 
             hover:bg-primary/90 transition-colors w-full"
      :disabled="!selectedTimeSlot"
      @click="confirmBooking"
    >
      确认预约
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const serviceId = ref(route.params.serviceId)
const availableDates = ref([])
const selectedDate = ref('')
const availableTimeSlots = ref([])
const selectedTimeSlot = ref('')

// 生成未来7天的日期
const generateDates = () => {
  const dates = []
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    dates.push(date.toISOString().split('T')[0])
  }
  availableDates.value = dates
  selectedDate.value = dates[0]
}

const fetchTimeSlots = async () => {
  if (!selectedDate.value) return
  
  try {
    const response = await axios.get(`/api/time-slots/${serviceId.value}/${selectedDate.value}`)
    availableTimeSlots.value = response.data
  } catch (error) {
    console.error('获取时间段失败', error)
    alert('获取时间段失败，请稍后重试')
  }
}

const isSlotBooked = (slot) => {
  // 简单判断，实际应从API获取已预订状态
  return false
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`
}

const confirmBooking = () => {
  if (!selectedTimeSlot.value) {
    alert('请选择预约时间')
    return
  }
  
  router.push({ 
    name: 'Payment', 
    params: { 
      serviceId: serviceId.value,
      date: selectedDate.value,
      time: selectedTimeSlot.value
    } 
  })
}

onMounted(() => {
  generateDates()
})

watch(selectedDate, fetchTimeSlots)
</script>  