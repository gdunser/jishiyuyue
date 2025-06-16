<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
      <div class="text-center mb-6">
        <i class="fa fa-telegram text-5xl text-blue-500 mb-3"></i>
        <h1 class="text-2xl font-bold text-gray-800">登录到预约系统</h1>
        <p class="text-gray-500 mt-2">请授权以继续使用预约服务</p>
      </div>
      
      <div class="mt-6">
        <button
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
          @click="loginWithTelegram"
        >
          <i class="fa fa-telegram mr-2"></i>
          使用 Telegram 登录
        </button>
      </div>
      
      <div class="mt-4 text-center text-sm text-gray-500">
        点击登录即表示您同意我们的<a href="#" class="text-blue-500 hover:underline">服务条款</a>和<a href="#" class="text-blue-500 hover:underline">隐私政策</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTelegram } from '@telegram-apps/sdk-vue'

const { tg } = useTelegram()
const loading = ref(false)

const loginWithTelegram = () => {
  loading.value = true
  
  try {
    tg.login({
      writeAccess: true,
      botUsername: 'your_bot_username' // 替换为您的机器人用户名
    }).then((user) => {
      if (user) {
        // 登录成功，保存用户信息
        localStorage.setItem('user', JSON.stringify(user))
        // 检查是否需要选择用户类型
        const userType = localStorage.getItem('userType')
        if (userType) {
          window.location.href = '/'
        } else {
          window.location.href = '/user-type'
        }
      } else {
        loading.value = false
        alert('登录失败，请重试')
      }
    }).catch((error) => {
      loading.value = false
      console.error('登录错误', error)
      alert('登录过程中发生错误，请重试')
    })
  } catch (error) {
    loading.value = false
    console.error('启动登录流程失败', error)
    alert('启动登录流程失败，请刷新页面重试')
  }
}

onMounted(() => {
  tg.ready()
})
</script>  