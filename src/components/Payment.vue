<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">确认订单</h2>
    
    <div class="bg-white rounded-lg shadow-md p-4 mb-4">
      <div class="flex items-start mb-3">
        <div class="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
          <i class="fa fa-scissors text-primary text-2xl"></i>
        </div>
        <div class="ml-3">
          <h3 class="font-bold">{{ service.name }}</h3>
          <p class="text-sm text-gray-500">¥{{ service.price }}/小时</p>
        </div>
      </div>
      
      <div class="border-t border-gray-200 pt-3">
        <div class="flex justify-between mb-2">
          <span class="text-gray-600">预约日期</span>
          <span class="font-medium">{{ formatDate(date) }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-600">预约时间</span>
          <span class="font-medium">{{ time }}</span>
        </div>
        <div class="flex justify-between pt-2 border-t border-gray-200">
          <span class="font-bold">订单金额</span>
          <span class="font-bold text-primary">¥{{ service.price }}</span>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 class="font-bold mb-3">选择支付方式</h3>
      <div class="space-y-2">
        <label class="flex items-center p-3 border rounded-lg cursor-pointer">
          <input type="radio" name="paymentMethod" value="wechat" checked class="mr-3">
          <i class="fa fa-weixin text-green-600 text-xl"></i>
          <span class="ml-2">微信支付</span>
        </label>
        <label class="flex items-center p-3 border rounded-lg cursor-pointer">
          <input type="radio" name="paymentMethod" value="alipay" class="mr-3">
          <i class="fa fa-credit-card text-blue-600 text-xl"></i>
          <span class="ml-2">支付宝</span>
        </label>
      </div>
    </div>
    
    <button
      class="px-6 py-3 bg-primary text-white rounded-lg font-bold 
             hover:bg-primary/90 transition-colors w-full"
      @click="processPayment"
    >
      确认支付
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { useTelegram } from '@telegram-apps/sdk-vue'

const route = useRoute()
const router = useRouter()
const { tg } = useTelegram()

const serviceId = ref(route.params.serviceId)
const date = ref(route.params.date)
const time = ref(route.params.time)
const service = ref({})

const fetchService = async () => {
  try {
    const response = await axios.get(`/api/services/${serviceId.value}`)
    service.value = response.data
  } catch (error) {
    console.error('获取服务信息失败', error)
    alert('获取服务信息失败，请稍后重试')
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

const processPayment = async () => {
  try {
    // 显示加载状态
    const paymentResult = await tg.showPopup({
      title: '支付处理中',
      message: '正在处理您的支付请求，请稍候...',
      buttons: [{ type: 'close', text: '取消' }]
    })
    
    if (paymentResult.button_id === 'close') {
      return
    }
    
    // 模拟支付API调用
    const response = await axios.post('/api/payments', {
      serviceId: serviceId.value,
      date: date.value,
      time: time.value,
      amount: service.value.price
    })
    
    if (response.data.success) {
      // 支付成功，通知用户
      tg.showAlert('支付成功！您的预约已确认。')
      router.push({ name: 'BookingSuccess' })
    } else {
      tg.showAlert('支付失败，请重试。')
    }
  } catch (error) {
    console.error('支付处理失败', error)
    tg.showAlert('支付处理失败，请稍后重试。')
  }
}

onMounted(fetchService)
</script>  