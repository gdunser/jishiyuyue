<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-6 mb-6">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800">选择您的用户类型</h1>
        <p class="text-gray-500 mt-2">请选择您的角色以继续使用预约系统</p>
      </div>
      
      <div class="space-y-4">
        <button
          class="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          @click="selectUserType('user')"
        >
          <i class="fa fa-user-circle text-2xl mr-3"></i>
          <div class="text-left">
            <div class="font-semibold text-lg">预约用户</div>
            <div class="text-sm opacity-80">我想预约服务</div>
          </div>
        </button>
        
        <button
          class="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          @click="selectUserType('admin')"
        >
          <i class="fa fa-cog text-2xl mr-3"></i>
          <div class="text-left">
            <div class="font-semibold text-lg">管理员</div>
            <div class="text-sm opacity-80">我想管理服务和预约</div>
          </div>
        </button>
      </div>
    </div>
    
    <div class="text-center text-sm text-gray-500">
      如有疑问，请联系客服
    </div>
  </div>
</template>

<script setup>
import { useTelegram } from '@telegram-apps/sdk-vue'

const { tg } = useTelegram()

const selectUserType = async (userType) => {
  try {
    // 显示加载状态
    tg.showLoading()
    
    // 保存用户类型
    localStorage.setItem('userType', userType)
    
    // 如果是管理员，检查是否为授权管理员
    if (userType === 'admin') {
      const user = JSON.parse(localStorage.getItem('user'))
      
      const response = await fetch('/api/admin/authorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          telegramId: user.id,
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data.authorized) {
        // 管理员授权成功
        localStorage.setItem('isAdmin', 'true')
        tg.hideLoading()
        window.location.href = '/admin'
      } else {
        // 不是授权管理员
        localStorage.removeItem('userType')
        tg.hideLoading()
        tg.showAlert('您不是授权管理员，无法访问管理功能')
      }
    } else {
      // 普通用户，保存用户信息
      const user = JSON.parse(localStorage.getItem('user'))
      
      await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          telegramId: user.id,
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name
        })
      })
      
      tg.hideLoading()
      window.location.href = '/'
    }
  } catch (error) {
    tg.hideLoading()
    console.error('选择用户类型失败', error)
    alert('发生错误，请重试')
  }
}
</script>  