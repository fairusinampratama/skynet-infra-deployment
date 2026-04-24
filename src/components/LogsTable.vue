<script setup>
import { Trash2 } from 'lucide-vue-next'

defineProps({
  logs: {
    type: Array,
    required: true
  }
})

defineEmits(['delete'])

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

const formatPercent = (value) => {
  return `${(value * 100).toFixed(1)}%`
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
      <h3 class="font-semibold text-gray-800">Tabel Daily ODP & ODC</h3>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm text-gray-600 min-w-max border-collapse">
        <thead class="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100 text-center">
          <tr>
            <th scope="col" class="px-4 py-3 font-medium border-r border-gray-100 sticky left-0 z-20 bg-gray-50/50" rowspan="2">Hari Ke-</th>
            <th scope="col" class="px-4 py-3 font-medium border-r border-gray-100 sticky left-[72px] z-20 bg-gray-50/50" rowspan="2">Tanggal</th>
            <th scope="col" class="px-4 py-2 font-medium border-r border-gray-100 border-b bg-gray-100/50 text-gray-700" colspan="2">Tim 1</th>
            <th scope="col" class="px-4 py-2 font-medium border-r border-gray-100 border-b bg-gray-100/50 text-gray-700" colspan="2">Tim 2</th>
            <th scope="col" class="px-4 py-2 font-medium border-r border-gray-100 border-b bg-gray-100/50 text-gray-700" colspan="2">Tim 3</th>
            <th scope="col" class="px-4 py-2 font-medium border-r border-gray-100 border-b bg-gray-100/50 text-gray-700" colspan="2">Tim 4</th>
            <th scope="col" class="px-4 py-2 font-medium border-r border-gray-100 border-b bg-blue-50/50 text-blue-800" colspan="2">Total Harian</th>
            <th scope="col" class="px-4 py-2 font-medium border-r border-gray-100 border-b bg-blue-100/50 text-blue-900" colspan="2">Akumulasi</th>
            <th scope="col" class="px-4 py-2 font-medium border-r border-gray-100 border-b bg-emerald-50/50 text-emerald-800" colspan="2">Progress</th>
            <th scope="col" class="px-4 py-3 font-medium border-r border-gray-100" rowspan="2">Keterangan</th>
            <th scope="col" class="px-4 py-3 font-medium" rowspan="2">Aksi</th>
          </tr>
          <tr>
            <th class="px-2 py-2 border-r border-gray-100 bg-gray-50/50">ODP</th>
            <th class="px-2 py-2 border-r border-gray-100 bg-gray-50/50">ODC</th>
            <th class="px-2 py-2 border-r border-gray-100 bg-gray-50/50">ODP</th>
            <th class="px-2 py-2 border-r border-gray-100 bg-gray-50/50">ODC</th>
            <th class="px-2 py-2 border-r border-gray-100 bg-gray-50/50">ODP</th>
            <th class="px-2 py-2 border-r border-gray-100 bg-gray-50/50">ODC</th>
            <th class="px-2 py-2 border-r border-gray-100 bg-gray-50/50">ODP</th>
            <th class="px-2 py-2 border-r border-gray-100 bg-gray-50/50">ODC</th>
            <th class="px-2 py-2 border-r border-gray-100 bg-blue-50/30">ODP</th>
            <th class="px-2 py-2 border-r border-gray-100 bg-blue-50/30">ODC</th>
            <th class="px-2 py-2 border-r border-gray-100 bg-blue-100/30">ODP</th>
            <th class="px-2 py-2 border-r border-gray-100 bg-blue-100/30">ODC</th>
            <th class="px-2 py-2 border-r border-gray-100 bg-emerald-50/30">ODP</th>
            <th class="px-2 py-2 border-r border-gray-100 bg-emerald-50/30">ODC</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50 text-center">
          <tr v-if="logs.length === 0">
            <td colspan="18" class="px-6 py-8 text-center text-gray-400">
              Belum ada data riwayat
            </td>
          </tr>
          <tr 
            v-else
            v-for="log in logs" 
            :key="log.id"
            class="hover:bg-gray-50/50 transition-colors group"
          >
            <td class="px-4 py-3 font-medium border-r border-gray-50 sticky left-0 z-10 bg-white group-hover:bg-gray-50/50">{{ log.hariIndex }}</td>
            <td class="px-4 py-3 whitespace-nowrap border-r border-gray-50 sticky left-[72px] z-10 bg-white group-hover:bg-gray-50/50">{{ formatDate(log.date) }}</td>
            <td class="px-2 py-3 border-r border-gray-50 font-medium" :class="(!log.tim1?.odp || log.tim1.odp === 0) ? 'text-gray-300 font-normal' : 'text-blue-600'">{{ log.tim1?.odp || 0 }}</td>
            <td class="px-2 py-3 border-r border-gray-50 font-medium" :class="(!log.tim1?.odc || log.tim1.odc === 0) ? 'text-gray-300 font-normal' : 'text-violet-600'">{{ log.tim1?.odc || 0 }}</td>
            <td class="px-2 py-3 border-r border-gray-50 font-medium" :class="(!log.tim2?.odp || log.tim2.odp === 0) ? 'text-gray-300 font-normal' : 'text-blue-600'">{{ log.tim2?.odp || 0 }}</td>
            <td class="px-2 py-3 border-r border-gray-50 font-medium" :class="(!log.tim2?.odc || log.tim2.odc === 0) ? 'text-gray-300 font-normal' : 'text-violet-600'">{{ log.tim2?.odc || 0 }}</td>
            <td class="px-2 py-3 border-r border-gray-50 font-medium" :class="(!log.tim3?.odp || log.tim3.odp === 0) ? 'text-gray-300 font-normal' : 'text-blue-600'">{{ log.tim3?.odp || 0 }}</td>
            <td class="px-2 py-3 border-r border-gray-50 font-medium" :class="(!log.tim3?.odc || log.tim3.odc === 0) ? 'text-gray-300 font-normal' : 'text-violet-600'">{{ log.tim3?.odc || 0 }}</td>
            <td class="px-2 py-3 border-r border-gray-50 font-medium" :class="(!log.tim4?.odp || log.tim4.odp === 0) ? 'text-gray-300 font-normal' : 'text-blue-600'">{{ log.tim4?.odp || 0 }}</td>
            <td class="px-2 py-3 border-r border-gray-50 font-medium" :class="(!log.tim4?.odc || log.tim4.odc === 0) ? 'text-gray-300 font-normal' : 'text-violet-600'">{{ log.tim4?.odc || 0 }}</td>
            <td class="px-2 py-3 border-r border-gray-50 font-medium text-blue-700 bg-blue-50/20">{{ log.dailyOdp }}</td>
            <td class="px-2 py-3 border-r border-gray-50 font-medium text-violet-700 bg-violet-50/20">{{ log.dailyOdc }}</td>
            <td class="px-2 py-3 border-r border-gray-50 font-bold text-blue-800 bg-blue-50/40">{{ log.accOdp }}</td>
            <td class="px-2 py-3 border-r border-gray-50 font-bold text-violet-800 bg-violet-50/40">{{ log.accOdc }}</td>
            <td class="px-2 py-3 border-r border-gray-50 text-gray-500 bg-emerald-50/20">{{ formatPercent(log.progressOdp) }}</td>
            <td class="px-2 py-3 border-r border-gray-50 text-gray-500 bg-emerald-50/20">{{ formatPercent(log.progressOdc) }}</td>
            <td class="px-4 py-3 text-left border-r border-gray-50 max-w-xs truncate" :title="log.notes" :class="!log.notes ? 'text-gray-300' : 'text-gray-700'">{{ log.notes || '-' }}</td>
            <td class="px-4 py-3 text-center">
              <button @click="$emit('delete', log.id)" class="text-red-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50" title="Hapus Data">
                <Trash2 :size="16" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
