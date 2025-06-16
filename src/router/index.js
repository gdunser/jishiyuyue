import { createRouter, createWebHashHistory } from 'vue-router'
import { useTelegram } from '@telegram-apps/sdk-vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/services',
    name: 'Services',
    component: () => import('../views/Services.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/select-time/:serviceId',
    name: 'SelectTime',
    component: () => import('../views/SelectTime.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/payment/:serviceId/:date/:time',
    name: 'Payment',
    component: () => import('../views/Payment.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/booking-success',
    name: 'BookingSuccess',
    component: () => import('../views/BookingSuccess.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/time-slots',
    name: 'AdminTimeSlots',
    component: () => import('../views/admin/TimeSlots.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/services',
    name: 'AdminServices',
    component: () => import('../views/admin/Services.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Auth.vue')
  },
  {
    path: '/user-type',
    name: 'UserType',
    component: () => import('../views/UserType.vue'),
    meta: { requiresAuth: true, noUserType: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const { tg } = useTelegram()
  
  // 获取用户信息
  const user = tg.initDataUnsafe?.user
  
  if (!user) {
    // 没有用户信息，尝试重新获取
    try {
      const updatedData = await tg.updateInitData()
      const updatedUser = updatedData?.user
      
      if (!updatedUser) {
        // 仍然没有用户信息，重定向到认证页面
        return next({ name: 'Auth' })
      }
      
      // 保存用户信息
      localStorage.setItem('user', JSON.stringify(updatedUser))
      next()
    } catch (error) {
      console.error('获取用户信息失败', error)
      next({ name: 'Auth' })
    }
    return
  }
  
  // 保存用户信息
  localStorage.setItem('user', JSON.stringify(user))
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    // 检查是否已设置用户类型
    const userType = localStorage.getItem('userType')
    
    if (!userType && !to.meta.noUserType) {
      // 没有用户类型，重定向到选择用户类型页面
      return next({ name: 'UserType' })
    }
    
    // 检查是否需要管理员权限
    if (to.meta.requiresAdmin) {
      // 验证用户是否为管理员
      try {
        const response = await fetch('/api/admin/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ telegramId: user.id })
        })
        
        const data = await response.json()
        
        if (response.ok && data.isAdmin) {
          next()
        } else {
          next({ name: 'Home', query: { error: '权限不足' } })
        }
      } catch (error) {
        console.error('验证管理员权限失败', error)
        next({ name: 'Home', query: { error: '权限验证失败' } })
      }
      return
    }
    
    next()
  } else {
    next()
  }
})

export default router  