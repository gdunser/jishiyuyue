<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">管理服务项目</h1>
      <button class="text-primary-500 hover:underline flex items-center" @click="logout">
        <i class="fa fa-sign-out mr-1"></i> 退出登录
      </button>
    </div>
    
    <div class="bg-white rounded-xl shadow-md p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">添加新服务</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label for="service-name" class="block text-sm font-medium text-gray-700 mb-1">服务名称</label>
          <input type="text" id="service-name" v-model="newService.name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50">
        </div>
        
        <div>
          <label for="service-price" class="block text-sm font-medium text-gray-700 mb-1">服务价格</label>
          <input type="number" id="service-price" v-model="newService.price" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50">
        </div>
        
        <div class="md:col-span-2">
          <label for="service-description" class="block text-sm font-medium text-gray-700 mb-1">服务描述</label>
          <textarea id="service-description" v-model="newService.description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"></textarea>
        </div>
      </div>
      
      <div class="mt-4">
        <button 
          class="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!newService.name || !newService.price"
          @click="addService">
          添加服务
        </button>
      </div>
    </div>
    
    <div class="bg-white rounded-xl shadow-md p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-6">现有服务</h3>
      
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="service in services" :key="service.id" class="hover:bg-gray-50 transition-colors duration-150">
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ service.id }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ service.name }}</div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                ¥{{ service.price }}
              </td>
              <td class="px-4 py-4 text-sm text-gray-500">
                {{ service.description }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-blue-500 hover:text-blue-700 mr-3" @click="editService(service)">
                  编辑
                </button>
                <button class="text-red-500 hover:text-red-700" @click="deleteService(service.id)">
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="mt-4 text-center text-sm text-gray-500">
        {{ services.length > 0 ? '' : '暂无服务数据' }}
      </div>
    </div>
    
    <!-- 编辑服务模态框 -->
    <div v-if="isEditing" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800">编辑服务</h3>
          <button class="text-gray-400 hover:text-gray-600" @click="cancelEdit">
            <i class="fa fa-times"></i>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label for="edit-service-name" class="block text-sm font-medium text-gray-700 mb-1">服务名称</label>
            <input type="text" id="edit-service-name" v-model="editingService.name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50">
          </div>
          
          <div>
            <label for="edit-service-price" class="block text-sm font-medium text-gray-700 mb-1">服务价格</label>
            <input type="number" id="edit-service-price" v-model="editingService.price" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50">
          </div>
          
          <div class="md:col-span-2">
            <label for="edit-service-description" class="block text-sm font-medium text-gray-700 mb-1">服务描述</label>
            <textarea id="edit-service-description" v-model="editingService.description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"></textarea>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-4">
          <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-300" @click="cancelEdit">
            取消
          </button>
          <button class="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300" @click="saveService">
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useTelegram } from '@telegram-apps/sdk-vue'

export default {
  name: 'AdminServices',
  setup() {
    const $tg = useTelegram()
    const services = ref([])
    const newService = ref({
      name: '',
      price: '',
      description: ''
    })
    const isEditing = ref(false)
    const editingService = ref({
      id: null,
      name: '',
      price: '',
      description: ''
    })
    
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
    
    const addService = async () => {
      if (!newService.value.name || !newService.value.price) return
      
      try {
        // 显示加载状态
        $tg.showLoading()
        
        // 模拟API调用添加服务
        const response = await fetch('/api/admin/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newService.value)
        })
        
        if (response.ok) {
          // 重新加载服务列表
          await fetchServices()
          // 清空表单
          newService.value = {
            name: '',
            price: '',
            description: ''
          }
          $tg.showAlert('服务添加成功')
        } else {
          const errorData = await response.json()
          $tg.showAlert(errorData.message || '添加服务失败，请稍后再试')
          console.error('添加服务失败:', response.status)
        }
        
        // 隐藏加载状态
        $tg.hideLoading()
      } catch (error) {
        $tg.hideLoading()
        console.error('添加服务出错:', error)
        $tg.showAlert('添加服务失败，请稍后再试')
      }
    }
    
    const editService = (service) => {
      editingService.value = { ...service }
      isEditing.value = true
    }
    
    const cancelEdit = () => {
      isEditing.value = false
    }
    
    const saveService = async () => {
      if (!editingService.value.name || !editingService.value.price) return
      
      try {
        // 显示加载状态
        $tg.showLoading()
        
        // 模拟API调用更新服务
        const response = await fetch(`/api/admin/services/${editingService.value.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editingService.value)
        })
        
        if (response.ok) {
          // 重新加载服务列表
          await fetchServices()
          // 关闭模态框
          isEditing.value = false
          $tg.showAlert('服务更新成功')
        } else {
          const errorData = await response.json()
          $tg.showAlert(errorData.message || '更新服务失败，请稍后再试')
          console.error('更新服务失败:', response.status)
        }
        
        // 隐藏加载状态
        $tg.hideLoading()
      } catch (error) {
        $tg.hideLoading()
        console.error('更新服务出错:', error)
        $tg.showAlert('更新服务失败，请稍后再试')
      }
    }
    
    const deleteService = async (serviceId) => {
      if (!confirm('确定要删除这个服务吗？这将同时删除相关的预约信息。')) return
      
      try {
        // 显示加载状态
        $tg.showLoading()
        
        // 模拟API调用删除服务
        const response = await fetch(`/api/admin/services/${serviceId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          // 重新加载服务列表
          await fetchServices()
          $tg.showAlert('服务删除成功')
        } else {
          const errorData = await response.json()
          $tg.showAlert(errorData.message || '删除服务失败，请稍后再试')
          console.error('删除服务失败:', response.status)
        }
        
        // 隐藏加载状态
        $tg.hideLoading()
      } catch (error) {
        $tg.hideLoading()
        console.error('删除服务出错:', error)
        $tg.showAlert('删除服务失败，请稍后再试')
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
      $tg.ready()
    })
    
    return {
      services,
      newService,
      isEditing,
      editingService,
      addService,
      editService,
      cancelEdit,
      saveService,
      deleteService,
      logout
    }
  }
}
</script>
    