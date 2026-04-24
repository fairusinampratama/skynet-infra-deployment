<script setup>
import { Target, Activity, Percent, CalendarClock } from 'lucide-vue-next'

defineProps({
  target: {
    type: Number,
    required: true
  },
  installed: {
    type: Number,
    required: true
  },
  progress: {
    type: Number,
    required: true
  },
  daysRemaining: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Target Card -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
      <div class="p-3 bg-blue-50 text-blue-600 rounded-lg">
        <Target :size="24" />
      </div>
      <div>
        <p class="text-sm font-medium text-gray-500">TARGET (ODP+ODC)</p>
        <p class="text-2xl font-bold text-gray-900">{{ target }}</p>
      </div>
    </div>

    <!-- Total Terpasang Card -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
      <div class="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
        <Activity :size="24" />
      </div>
      <div>
        <p class="text-sm font-medium text-gray-500">TOTAL TERPASANG</p>
        <p class="text-2xl font-bold text-gray-900">{{ installed }}</p>
      </div>
    </div>

    <!-- Progress Card -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
      <div class="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
        <Percent :size="24" />
      </div>
      <div class="w-full">
        <p class="text-sm font-medium text-gray-500">PROGRESS TOTAL</p>
        <p class="text-2xl font-bold text-gray-900 mb-1">{{ progress }}%</p>
        <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
          <div class="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>
    </div>

    <!-- Sisa Hari Card -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
      <div class="p-3 bg-amber-50 text-amber-600 rounded-lg">
        <CalendarClock :size="24" />
      </div>
      <div>
        <p class="text-sm font-medium text-gray-500">SISA HARI</p>
        <p class="text-2xl font-bold text-gray-900">{{ daysRemaining }} Hari</p>
      </div>
    </div>
  </div>
</template>
