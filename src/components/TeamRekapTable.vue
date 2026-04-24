<script setup>
import { computed } from 'vue'

const props = defineProps({
  teamTotals: {
    type: Array,
    required: true
  },
  targetOdp: {
    type: Number,
    required: true
  },
  targetOdc: {
    type: Number,
    required: true
  }
})

const formatPercent = (value, target) => {
  if (target === 0) return '0%'
  return `${((value / target) * 100).toFixed(1)}%`
}

const grandTotalOdp = computed(() => {
  return props.teamTotals.reduce((s, t) => s + t.odp, 0)
})

const grandTotalOdc = computed(() => {
  return props.teamTotals.reduce((s, t) => s + t.odc, 0)
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex-none">
      <h3 class="font-semibold text-gray-800">Rekap ODP & ODC Per Tim</h3>
    </div>
    
    <!-- Vertical Team Cards -->
    <div class="flex-grow overflow-y-auto divide-y divide-gray-100">
      <div 
        v-for="team in teamTotals" 
        :key="team.id"
        class="p-5 hover:bg-gray-50/30 transition-colors"
      >
        <div class="flex justify-between items-center mb-4">
          <h4 class="font-bold text-gray-800">
            {{ team.name }}
            <span class="text-sm font-normal text-gray-500 ml-1">({{ team.pic }})</span>
          </h4>
        </div>
        
        <div class="space-y-4">
          <!-- ODP -->
          <div>
            <div class="flex justify-between text-sm mb-1.5">
              <span class="text-gray-600 font-medium">ODP</span>
              <div class="text-right">
                <span class="font-bold text-blue-600">{{ team.odp }}</span>
                <span class="text-gray-400 font-normal text-xs ml-1.5">({{ formatPercent(team.odp, targetOdp) }})</span>
              </div>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2">
              <div class="bg-blue-500 h-2 rounded-full transition-all duration-500" :style="{ width: formatPercent(team.odp, targetOdp) }"></div>
            </div>
          </div>
          
          <!-- ODC -->
          <div>
            <div class="flex justify-between text-sm mb-1.5">
              <span class="text-gray-600 font-medium">ODC</span>
              <div class="text-right">
                <span class="font-bold text-violet-600">{{ team.odc }}</span>
                <span class="text-gray-400 font-normal text-xs ml-1.5">({{ formatPercent(team.odc, targetOdc) }})</span>
              </div>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2">
              <div class="bg-violet-500 h-2 rounded-full transition-all duration-500" :style="{ width: formatPercent(team.odc, targetOdc) }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grand Total Footer -->
    <div class="bg-gray-50 px-6 py-5 border-t border-gray-200 mt-auto">
      <div class="font-bold text-gray-900 mb-4">TOTAL KESELURUHAN</div>
      <div class="grid grid-cols-2 gap-6">
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="text-gray-600">Total ODP</span>
            <span class="font-bold text-blue-700">{{ grandTotalOdp }} <span class="text-gray-500 text-xs font-normal">({{ formatPercent(grandTotalOdp, targetOdp) }})</span></span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-blue-600 h-2 rounded-full transition-all duration-500" :style="{ width: formatPercent(grandTotalOdp, targetOdp) }"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="text-gray-600">Total ODC</span>
            <span class="font-bold text-violet-700">{{ grandTotalOdc }} <span class="text-gray-500 text-xs font-normal">({{ formatPercent(grandTotalOdc, targetOdc) }})</span></span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-violet-600 h-2 rounded-full transition-all duration-500" :style="{ width: formatPercent(grandTotalOdc, targetOdc) }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
