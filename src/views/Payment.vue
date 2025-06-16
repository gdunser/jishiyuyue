<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">确认订单并支付</h1>
      <router-link to="/" class="text-primary-500 hover:underline flex items-center">
        <i class="fa fa-arrow-left mr-1"></i> 返回首页
      </router-link>
    </div>
    
    <div class="bg-white rounded-xl shadow-md p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200">订单信息</h3>
      
      <div class="space-y-4 mb-6">
        <div class="flex justify-between items-center">
          <span class="text-gray-600">服务项目</span>
          <span class="font-medium">{{ service.name }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">预约日期</span>
          <span class="font-medium">{{ formattedDate }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">预约时间</span>
          <span class="font-medium">{{ selectedTime }}</span>
        </div>
        <div class="flex justify-between items-center pt-3 border-t border-gray-100">
          <span class="text-gray-600">支付金额</span>
          <span class="font-semibold text-xl text-primary-500">¥{{ service.price }}</span>
        </div>
      </div>
      
      <h3 class="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200">支付方式</h3>
      
      <div class="space-y-3 mb-6">
        <div class="payment-method rounded-lg border border-gray-200 p-4 cursor-pointer transition-all duration-200 hover:border-primary-500 hover:bg-primary-50 {{ selectedPaymentMethod === 'wechat' ? 'bg-primary-50 border-primary-500' : '' }}">
          <div class="flex items-center">
            <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-3 {{ selectedPaymentMethod === 'wechat' ? 'border-primary-500' : '' }}">
              <div class="w-3 h-3 rounded-full bg-primary-500 {{ selectedPaymentMethod !== 'wechat' ? 'hidden' : '' }}"></div>
            </div>
            <i class="fa fa-weixin text-green-500 text-xl mr-2"></i>
            <span class="font-medium">微信支付</span>
          </div>
        </div>
        
        <div class="payment-method rounded-lg border border-gray-200 p-4 cursor-pointer transition-all duration-200 hover:border-primary-500 hover:bg-primary-50 {{ selectedPaymentMethod === 'alipay' ? 'bg-primary-50 border-primary-500' : '' }}">
          <div class="flex items-center">
            <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-3 {{ selectedPaymentMethod === 'alipay' ? 'border-primary-500' : '' }}">
              <div class="w-3 h-3 rounded-full bg-primary-500 {{ selectedPaymentMethod !== 'alipay' ? 'hidden' : '' }}"></div>
            </div>
            <i class="fa fa-credit-card text-blue-500 text-xl mr-2"></i>
            <span class="font-medium">支付宝</span>
          </div>
        </div>
      </div>
      
      <div class="flex items-start mb-6">
        <div class="flex items-center h-5">
          <input id="terms" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-primary-500" v-model="termsAgreed">
        </div>
        <label for="terms" class="ml-2 text-sm font-medium text-gray-600">
          我已阅读并同意<a href="#" class="text-primary-500 hover:underline">服务条款</a>和<a href="#" class="text-primary-500 hover:underline">隐私政策</a>
        </label>
      </div>
    </div>
    
    <button 
      class="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="!termsAgreed"
      @click="handlePayment">
      确认支付 ¥{{ service.price }}
    </button>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTelegram } from '@telegram-apps/sdk-vue'

export default {
  name: 'Payment',
  setup() {
    const $tg = useTelegram()
    const route = useRoute()
    const router = useRouter()
    const serviceId = route.params.serviceId
    const selectedDate = route.params.date
    const selectedTime = route.params.time
    const service = ref({})
    const selectedPaymentMethod = ref('wechat')
    const termsAgreed = ref(false)
    
    const formattedDate = computed(() => {
      if (!selectedDate) return ''
      const date = new Date(selectedDate)
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    })
    
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
    
    const handlePayment = async () => {
      if (!termsAgreed.value) return
      
      try {
        // 显示加载状态
        $tg.showLoading()
        
        // 模拟API调用创建订单
        const orderData = {
          serviceId,
          date: selectedDate,
          time: selectedTime,
          paymentMethod: selectedPaymentMethod.value
        }
        
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        })
        
        if (response.ok) {
          const order = await response.json()
          
          // 模拟支付流程
          // 实际应用中，这里应该调用支付API
          setTimeout(() => {
            $tg.hideLoading()
            // 跳转到支付成功页面
            router.push('/booking-success')
          }, 2000)
        } else {
          $tg.hideLoading()
          const errorData = await response.json()
          $tg.showAlert(errorData.message || '支付失败，请稍后再试')
          console.error('创建订单失败:', response.status)
        }
      } catch (error) {
        $tg.hideLoading()
        console.error('支付出错:', error)
        $tg.showAlert('支付过程中出现错误，请稍后再试')
      }
    }
    
    onMounted(() => {
      fetchService()
      $tg.ready()
    })
    
    return {
      service,
      selectedDate,
      selectedTime,
      formattedDate,
      selectedPaymentMethod,
      termsAgreed,
      handlePayment
    }
  }
}
</script>

<style scoped>
.payment-method {
  cursor: pointer;
}
</style>
    