<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  labels: {
    type: Array,
    required: true
  },
  odpData: {
    type: Array,
    required: true
  },
  odcData: {
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

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        boxWidth: 8
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  },
  interaction: {
    mode: 'index',
    intersect: false,
  }
}

const odpChartData = computed(() => {
  return {
    labels: props.labels,
    datasets: [
      {
        label: 'Kumulatif ODP',
        data: props.odpData,
        borderColor: '#3b82f6', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      },
      {
        label: 'Target (365)',
        data: Array(props.labels.length).fill(props.targetOdp),
        borderColor: '#ef4444', // red-500
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
      }
    ]
  }
})

const odcChartData = computed(() => {
  return {
    labels: props.labels,
    datasets: [
      {
        label: 'Kumulatif ODC',
        data: props.odcData,
        borderColor: '#8b5cf6', // violet-500
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      },
      {
        label: 'Target (46)',
        data: Array(props.labels.length).fill(props.targetOdc),
        borderColor: '#ef4444', // red-500
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
      }
    ]
  }
})
</script>

<template>
  <div class="flex flex-col gap-6 h-full">
    <!-- ODP Chart -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col flex-1 min-h-[300px]">
      <h3 class="font-semibold text-gray-800 mb-4">Grafik Pembangunan ODP</h3>
      <div class="flex-grow relative w-full">
        <div v-if="labels.length === 0" class="absolute inset-0 flex items-center justify-center text-gray-400">
          Belum ada data
        </div>
        <Line v-else :data="odpChartData" :options="defaultOptions" class="!h-full !w-full" />
      </div>
    </div>

    <!-- ODC Chart -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col flex-1 min-h-[300px]">
      <h3 class="font-semibold text-gray-800 mb-4">Grafik Pembangunan ODC</h3>
      <div class="flex-grow relative w-full">
        <div v-if="labels.length === 0" class="absolute inset-0 flex items-center justify-center text-gray-400">
          Belum ada data
        </div>
        <Line v-else :data="odcChartData" :options="defaultOptions" class="!h-full !w-full" />
      </div>
    </div>
  </div>
</template>
