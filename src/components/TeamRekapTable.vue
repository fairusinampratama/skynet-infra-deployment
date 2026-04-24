<script setup>
defineProps({
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
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex-none">
      <h3 class="font-semibold text-gray-800">Rekap ODP & ODC Per Tim</h3>
    </div>
    
    <div class="overflow-x-auto flex-grow">
      <table class="w-full text-left text-sm text-gray-600">
        <thead class="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
          <tr>
            <th scope="col" class="px-6 py-4 font-medium">Tim</th>
            <th scope="col" class="px-6 py-4 font-medium text-right">Total ODP</th>
            <th scope="col" class="px-6 py-4 font-medium text-right">% ODP (dari {{ targetOdp }})</th>
            <th scope="col" class="px-6 py-4 font-medium text-right">Total ODC</th>
            <th scope="col" class="px-6 py-4 font-medium text-right">% ODC (dari {{ targetOdc }})</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr 
            v-for="team in teamTotals" 
            :key="team.id"
            class="hover:bg-gray-50/50 transition-colors"
          >
            <td class="px-6 py-4 font-medium text-gray-800">{{ team.name }}</td>
            <td class="px-6 py-4 text-right font-medium text-blue-600">{{ team.odp }}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <span class="text-gray-500 w-10">{{ formatPercent(team.odp, targetOdp) }}</span>
                <div class="w-16 bg-gray-200 rounded-full h-1.5">
                  <div class="bg-blue-500 h-1.5 rounded-full" :style="{ width: formatPercent(team.odp, targetOdp) }"></div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-right font-medium text-violet-600">{{ team.odc }}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <span class="text-gray-500 w-10">{{ formatPercent(team.odc, targetOdc) }}</span>
                <div class="w-16 bg-gray-200 rounded-full h-1.5">
                  <div class="bg-violet-500 h-1.5 rounded-full" :style="{ width: formatPercent(team.odc, targetOdc) }"></div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-50 font-semibold text-gray-900 border-t border-gray-200">
          <tr>
            <td class="px-6 py-4">TOTAL</td>
            <td class="px-6 py-4 text-right text-blue-700">{{ teamTotals.reduce((s,t) => s + t.odp, 0) }}</td>
            <td class="px-6 py-4 text-right text-gray-600">{{ formatPercent(teamTotals.reduce((s,t) => s + t.odp, 0), targetOdp) }}</td>
            <td class="px-6 py-4 text-right text-violet-700">{{ teamTotals.reduce((s,t) => s + t.odc, 0) }}</td>
            <td class="px-6 py-4 text-right text-gray-600">{{ formatPercent(teamTotals.reduce((s,t) => s + t.odc, 0), targetOdc) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
