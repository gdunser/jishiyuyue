<template>
  <div class="container mx-auto px-4 py-8 text-center">
    <div class="success-icon w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <i class="fa fa-check text-3xl text-green-500"></i>
    </div>
    
    <h1 class="text-2xl font-bold text-gray-800 mb-2">预约成功</h1>
    <p class="text-gray-600 mb-8">您的预约已提交成功，我们将尽快与您确认</p>
    
    <div class="bg-white rounded-xl shadow-md p-6 mb-8 max-w-md mx-auto">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200 text-left">预约详情</h3>
      
      <div class="space-y-4 text-left">
        <div class="flex justify-between items-center">
          <span class="text-gray-600">服务项目</span>
          <span class="font-medium">{{ serviceName }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">预约日期</span>
          <span class="font-medium">{{ formattedDate }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">预约时间</span>
          <span class="font-medium">{{ formattedTime }}</span>
        </div>
        <div class="flex justify-between items-center pt-3 border-t border-gray-100">
          <span class="text-gray-600">支付金额</span>
          <span class="font-semibold text-primary-500">¥{{ servicePrice }}</span>
        </div>
      </div>
    </div>
    
    <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
      <router-link to="/" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg text-center transition-colors duration-300">
        返回首页
      </router-link>
      <router-link to="/services" class="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors duration-300">
        继续预约
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useTelegram } from '@telegram-apps/sdk-vue'

export default {
  name: 'BookingSuccess',
  setup() {
    const $tg = useTelegram()
    const serviceName = ref('')
    const servicePrice = ref('')
    const bookingDate = ref('')
    const bookingTime = ref('')
    
    const formattedDate = computed(() => {
      if (!bookingDate.value) return ''
      const date = new Date(bookingDate.value)
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    })
    
    const formattedTime = computed(() => {
      return bookingTime.value || ''
    })
    
    const fetchBookingDetails = async () => {
      try {
        // 模拟API调用获取最新预约详情
        const response = await fetch('/api/latest-booking')
        if (response.ok) {
          const booking = await response.json()
          serviceName.value = booking.serviceName
          servicePrice.value = booking.price
          bookingDate.value = booking.date
          bookingTime.value = booking.time
        } else {
          console.error('获取预约详情失败:', response.status)
        }
      } catch (error) {
        console.error('获取预约详情出错:', error)
      }
    }
    
    onMounted(() => {
      fetchBookingDetails()
      $tg.ready()
      
      // 自动通知管理员
      setTimeout(() => {
        notifyAdmin()
      }, 1000)
    })
    
    const notifyAdmin = async () => {
      try {
        // 模拟API调用通知管理员
        await fetch('/api/notify-admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            serviceName: serviceName.value,
            date: bookingDate.value,
            time: bookingTime.value
          })
        })
      } catch (error) {
        console.error('通知管理员失败:', error)
        // 可以选择不显示错误，因为这不会影响用户体验
      }
    }
    
    return {
      serviceName,
      servicePrice,
      bookingDate,
      bookingTime,
      formattedDate,
      formattedTime
    }
  }
}
</script>
    