<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">管理仪表盘</h1>
      <button class="text-primary-500 hover:underline flex items-center" @click="logout">
        <i class="fa fa-sign-out mr-1"></i> 退出登录
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">今日预约</p>
            <h3 class="text-3xl font-bold text-gray-800 mt-1">{{ todayBookings }}</h3>
          </div>
          <div class="bg-primary-100 p-3 rounded-lg">
            <i class="fa fa-calendar text-primary-500 text-xl"></i>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-500 flex items-center">
            <i class="fa fa-arrow-up mr-1"></i> 12%
          </span>
          <span class="text-gray-500 ml-2">较昨日</span>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">本周预约</p>
            <h3 class="text-3xl font-bold text-gray-800 mt-1">{{ weeklyBookings }}</h3>
          </div>
          <div class="bg-blue-100 p-3 rounded-lg">
            <i class="fa fa-calendar-check-o text-blue-500 text-xl"></i>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-500 flex items-center">
            <i class="fa fa-arrow-up mr-1"></i> 8%
          </span>
          <span class="text-gray-500 ml-2">较上周</span>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">本月收入</p>
            <h3 class="text-3xl font-bold text-gray-800 mt-1">¥{{ monthlyRevenue }}</h3>
          </div>
          <div class="bg-green-100 p-3 rounded-lg">
            <i class="fa fa-money text-green-500 text-xl"></i>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-500 flex items-center">
            <i class="fa fa-arrow-up mr-1"></i> 15%
          </span>
          <span class="text-gray-500 ml-2">较上月</span>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold text-gray-800">最近预约</h3>
          <router-link to="/admin/time-slots" class="text-primary-500 hover:underline text-sm">
            查看全部
          </router-link>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">客户</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">服务</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="booking in recentBookings" :key="booking.id" class="hover:bg-gray-50 transition-colors duration-150">
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img class="h-10 w-10 rounded-full" :src="booking.userAvatar" alt="用户头像">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ booking.userName }}</div>
                      <div class="text-sm text-gray-500">{{ booking.userPhone }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ booking.serviceName }}</div>
                  <div class="text-sm text-gray-500">¥{{ booking.price }}</div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(booking.date) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ booking.time }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(booking.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {{ booking.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold text-gray-800">服务统计</h3>
          <div class="text-sm text-gray-500">本月</div>
        </div>
        
        <div class="space-y-6">
          <div v-for="service in serviceStatistics" :key="service.id">
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm font-medium text-gray-700">{{ service.name }}</span>
              <span class="text-sm font-medium text-gray-900">{{ service.percentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div :style="{ width: `${service.percentage}%` }" class="bg-primary-500 h-2 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useTelegram } from '@telegram-apps/sdk-vue'

export default {
  name: 'AdminDashboard',
  setup() {
    const $tg = useTelegram()
    const todayBookings = ref(0)
    const weeklyBookings = ref(0)
    const monthlyRevenue = ref(0)
    const recentBookings = ref([])
    const serviceStatistics = ref([])
    
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    }
    
    const getStatusClass = (status) => {
      switch(status) {
        case '已完成':
          return 'bg-green-100 text-green-800'
        case '待服务':
          return 'bg-blue-100 text-blue-800'
        case '已取消':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    
    const fetchDashboardData = async () => {
      try {
        // 模拟API调用获取仪表盘数据
        const response = await fetch('/api/admin/dashboard')
        if (response.ok) {
          const data = await response.json()
          todayBookings.value = data.todayBookings
          weeklyBookings.value = data.weeklyBookings
          monthlyRevenue.value = data.monthlyRevenue
          recentBookings.value = data.recentBookings
          serviceStatistics.value = data.serviceStatistics
        } else {
          console.error('获取仪表盘数据失败:', response.status)
        }
      } catch (error) {
        console.error('获取仪表盘数据出错:', error)
        $tg.showAlert('获取数据失败，请稍后再试')
      }
    }
    
    const logout = () => {
      // 清除登录状态
      localStorage.removeItem('admin_token')
      // 返回首页
      $tg.close()
    }
    
    onMounted(() => {
      fetchDashboardData()
      $tg.ready()
    })
    
    return {
      todayBookings,
      weeklyBookings,
      monthlyRevenue,
      recentBookings,
      serviceStatistics,
      formatDate,
      getStatusClass,
      logout
    }
  }
}
</script>
    