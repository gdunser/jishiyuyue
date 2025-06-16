<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <h1 class="text-[clamp(1.8rem,4vw,2.5rem)] font-bold text-gray-800 mb-2">欢迎使用预约服务</h1>
      <p class="text-gray-600 max-w-2xl mx-auto">选择您需要的服务，预约合适的时间，享受专业的服务体验</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link to="/services" class="service-card bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div class="h-48 overflow-hidden">
          <img src="https://picsum.photos/seed/service1/800/600" alt="服务展示图" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-2">浏览服务</h3>
          <p class="text-gray-600 mb-4">查看我们提供的各类服务，选择您需要的项目</p>
          <div class="inline-flex items-center text-primary-500 font-medium">
            立即查看 <i class="fa fa-arrow-right ml-2"></i>
          </div>
        </div>
      </router-link>
      
      <div class="service-card bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div class="h-48 overflow-hidden">
          <img src="https://picsum.photos/seed/service2/800/600" alt="预约流程展示图" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-2">预约流程</h3>
          <ol class="list-decimal list-inside text-gray-600 space-y-2">
            <li>选择服务项目</li>
            <li>选择预约时间</li>
            <li>完成在线支付</li>
            <li>确认预约成功</li>
          </ol>
        </div>
      </div>
      
      <div class="service-card bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div class="h-48 overflow-hidden">
          <img src="https://picsum.photos/seed/service3/800/600" alt="联系我们展示图" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-2">联系我们</h3>
          <div class="space-y-3 text-gray-600">
            <div class="flex items-center">
              <i class="fa fa-map-marker w-6 text-primary-500"></i>
              <span>北京市朝阳区建国路88号</span>
            </div>
            <div class="flex items-center">
              <i class="fa fa-phone w-6 text-primary-500"></i>
              <span>400-123-4567</span>
            </div>
            <div class="flex items-center">
              <i class="fa fa-envelope w-6 text-primary-500"></i>
              <span>service@example.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.service-card {
  cursor: pointer;
}
</style>
    