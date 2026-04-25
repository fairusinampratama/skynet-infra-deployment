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
import { Activity, Goal, TrendingUp } from 'lucide-vue-next'

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

const latestOdp = computed(() => props.odpData.at(-1) ?? 0)
const latestOdc = computed(() => props.odcData.at(-1) ?? 0)

const formatPercent = (value, target) => {
  if (target === 0) return '0%'
  return `${((value / target) * 100).toFixed(1)}%`
}

const createOptions = (accentColor) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 700,
    easing: 'easeOutQuart'
  },
  layout: {
    padding: {
      top: 8,
      right: 8,
      bottom: 0,
      left: 2
    }
  },
  plugins: {
    legend: {
      position: 'top',
      align: 'start',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        boxWidth: 10,
        boxHeight: 10,
        color: '#475569',
        padding: 18,
        font: {
          size: 12,
          weight: '600'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      titleColor: '#f8fafc',
      bodyColor: '#e2e8f0',
      borderColor: 'rgba(148, 163, 184, 0.22)',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      usePointStyle: true
    }
  },
  interaction: {
    mode: 'index',
    intersect: false
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      border: {
        display: false
      },
      ticks: {
        color: '#64748b',
        font: {
          size: 11,
          weight: '600'
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(148, 163, 184, 0.14)',
        drawBorder: false
      },
      border: {
        display: false
      },
      ticks: {
        color: '#64748b',
        padding: 10,
        font: {
          size: 11,
          weight: '600'
        }
      }
    }
  },
  elements: {
    point: {
      radius: 0,
      hoverRadius: 5,
      hitRadius: 18,
      borderWidth: 2,
      backgroundColor: '#ffffff'
    },
    line: {
      borderCapStyle: 'round',
      borderJoinStyle: 'round'
    }
  },
  interactionColor: accentColor
})

const odpOptions = createOptions('#2563eb')
const odcOptions = createOptions('#7c3aed')

const odpChartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Kumulatif ODP',
      data: props.odpData,
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.14)',
      pointHoverBackgroundColor: '#2563eb',
      pointHoverBorderColor: '#ffffff',
      pointHoverBorderWidth: 2,
      borderWidth: 3,
      tension: 0.38,
      fill: true
    },
    {
      label: `Target (${props.targetOdp})`,
      data: Array(props.labels.length).fill(props.targetOdp),
      borderColor: '#f97316',
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderDash: [8, 6],
      pointRadius: 0,
      pointHoverRadius: 0,
      tension: 0,
      fill: false
    }
  ]
}))

const odcChartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Kumulatif ODC',
      data: props.odcData,
      borderColor: '#7c3aed',
      backgroundColor: 'rgba(124, 58, 237, 0.14)',
      pointHoverBackgroundColor: '#7c3aed',
      pointHoverBorderColor: '#ffffff',
      pointHoverBorderWidth: 2,
      borderWidth: 3,
      tension: 0.38,
      fill: true
    },
    {
      label: `Target (${props.targetOdc})`,
      data: Array(props.labels.length).fill(props.targetOdc),
      borderColor: '#f97316',
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderDash: [8, 6],
      pointRadius: 0,
      pointHoverRadius: 0,
      tension: 0,
      fill: false
    }
  ]
}))
</script>

<template>
  <div class="grid h-full grid-cols-1 gap-6 xl:grid-cols-2">
    <article
      class="relative flex min-h-[340px] flex-col overflow-hidden rounded-[28px] border border-blue-100 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.16),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f8fbff_100%)] p-6 shadow-[0_20px_44px_-30px_rgba(37,99,235,0.26)]"
    >
      <div class="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(59,130,246,0.08),transparent)]"></div>
      <div class="relative flex items-start justify-between gap-4">
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700 ring-1 ring-blue-100"
          >
            <Activity :size="14" />
            Chart ODP
          </div>
          <h3 class="mt-3 text-xl font-bold tracking-tight text-slate-900">Grafik Pembangunan ODP</h3>
          <p class="mt-1 text-sm text-slate-500">Pergerakan kumulatif ODP dibanding garis target proyek.</p>
        </div>
        <div class="rounded-2xl bg-white/85 px-4 py-3 text-right ring-1 ring-slate-200 shadow-sm">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Capaian</p>
          <p class="mt-1 text-2xl font-black text-slate-900 tabular-nums">{{ latestOdp }}</p>
        </div>
      </div>

      <div class="relative mt-5 grid grid-cols-2 gap-3">
        <div class="rounded-2xl border border-blue-100 bg-white/85 p-4 shadow-sm">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700">Target</p>
          <p class="mt-2 text-2xl font-black text-slate-900 tabular-nums">{{ targetOdp }}</p>
        </div>
        <div class="rounded-2xl border border-emerald-100 bg-white/85 p-4 shadow-sm">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Progress</p>
          <p class="mt-2 text-2xl font-black text-slate-900 tabular-nums">{{ formatPercent(latestOdp, targetOdp) }}</p>
        </div>
      </div>

      <div class="relative mt-5 flex-grow">
        <div v-if="labels.length === 0" class="absolute inset-0 flex items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 text-slate-400">
          Belum ada data
        </div>
        <Line v-else :data="odpChartData" :options="odpOptions" class="!h-full !w-full" />
      </div>
    </article>

    <article
      class="relative flex min-h-[340px] flex-col overflow-hidden rounded-[28px] border border-violet-100 bg-[radial-gradient(circle_at_top_right,_rgba(167,139,250,0.18),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#fbf9ff_100%)] p-6 shadow-[0_20px_44px_-30px_rgba(124,58,237,0.26)]"
    >
      <div class="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(124,58,237,0.08),transparent)]"></div>
      <div class="relative flex items-start justify-between gap-4">
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-700 ring-1 ring-violet-100"
          >
            <TrendingUp :size="14" />
            Chart ODC
          </div>
          <h3 class="mt-3 text-xl font-bold tracking-tight text-slate-900">Grafik Pembangunan ODC</h3>
          <p class="mt-1 text-sm text-slate-500">Pantau akumulasi ODC harian dan jaraknya terhadap target akhir.</p>
        </div>
        <div class="rounded-2xl bg-white/85 px-4 py-3 text-right ring-1 ring-slate-200 shadow-sm">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Capaian</p>
          <p class="mt-1 text-2xl font-black text-slate-900 tabular-nums">{{ latestOdc }}</p>
        </div>
      </div>

      <div class="relative mt-5 grid grid-cols-2 gap-3">
        <div class="rounded-2xl border border-violet-100 bg-white/85 p-4 shadow-sm">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700">Target</p>
          <p class="mt-2 text-2xl font-black text-slate-900 tabular-nums">{{ targetOdc }}</p>
        </div>
        <div class="rounded-2xl border border-orange-100 bg-white/85 p-4 shadow-sm">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700">Progress</p>
          <p class="mt-2 text-2xl font-black text-slate-900 tabular-nums">{{ formatPercent(latestOdc, targetOdc) }}</p>
        </div>
      </div>

      <div class="relative mt-5 flex-grow">
        <div v-if="labels.length === 0" class="absolute inset-0 flex items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 text-slate-400">
          Belum ada data
        </div>
        <Line v-else :data="odcChartData" :options="odcOptions" class="!h-full !w-full" />
      </div>
    </article>
  </div>
</template>
