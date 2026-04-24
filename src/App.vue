<script setup>
import { LayoutDashboard, FileSpreadsheet } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 pb-12 font-sans selection:bg-blue-100">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-inner">
              <span class="text-white font-bold text-sm">RA</span>
            </div>
            <h1 class="font-bold text-lg md:text-xl tracking-tight text-gray-900">
              Pembangunan ODP & ODC Skynet
            </h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation Tabs -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <router-link 
            to="/" 
            class="group inline-flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors"
            active-class="border-blue-500 text-blue-600"
            exact-active-class="border-blue-500 text-blue-600"
            :class="[$route.path === '/' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            <LayoutDashboard :size="18" class="mr-2" :class="[$route.path === '/' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500']" />
            Overview
          </router-link>

          <router-link 
            to="/crud" 
            class="group inline-flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors"
            active-class="border-blue-500 text-blue-600"
            :class="[$route.path === '/crud' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            <FileSpreadsheet :size="18" class="mr-2" :class="[$route.path === '/crud' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500']" />
            Pencatatan Harian
          </router-link>
        </nav>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
