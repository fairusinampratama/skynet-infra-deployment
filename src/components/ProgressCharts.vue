<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { Activity, TrendingUp } from 'lucide-vue-next'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

const lastValueBadgePlugin = {
  id: 'lastValueBadge',
  afterDatasetsDraw(chart, args, pluginOptions) {
    const datasetIndex = pluginOptions?.datasetIndex ?? 1
    const label = pluginOptions?.label
    const dataset = chart.data.datasets[datasetIndex]
    const meta = chart.getDatasetMeta(datasetIndex)
    const point = meta?.data?.at(-1)

    if (!dataset || !point || label == null) return

    const { ctx } = chart
    const x = point.x
    const y = point.y
    const text = String(label)
    const paddingX = 10
    const height = 32
    const radius = 8

    ctx.save()
    ctx.font = '700 16px Inter, system-ui, sans-serif'
    const textWidth = ctx.measureText(text).width
    const width = Math.max(40, textWidth + paddingX * 2)
    const boxX = Math.min(Math.max(x - width / 2, chart.chartArea.left), chart.chartArea.right - width)
    const boxY = Math.max(chart.chartArea.top + 10, y - 46)

    ctx.fillStyle = pluginOptions?.backgroundColor ?? '#2f8cff'
    ctx.shadowColor = pluginOptions?.shadowColor ?? 'rgba(47, 140, 255, 0.35)'
    ctx.shadowBlur = 16

    ctx.beginPath()
    ctx.moveTo(boxX + radius, boxY)
    ctx.lineTo(boxX + width - radius, boxY)
    ctx.quadraticCurveTo(boxX + width, boxY, boxX + width, boxY + radius)
    ctx.lineTo(boxX + width, boxY + height - radius)
    ctx.quadraticCurveTo(boxX + width, boxY + height, boxX + width - radius, boxY + height)
    ctx.lineTo(boxX + radius, boxY + height)
    ctx.quadraticCurveTo(boxX, boxY + height, boxX, boxY + height - radius)
    ctx.lineTo(boxX, boxY + radius)
    ctx.quadraticCurveTo(boxX, boxY, boxX + radius, boxY)
    ctx.closePath()
    ctx.fill()

    ctx.shadowBlur = 0
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, boxX + width / 2, boxY + height / 2 + 1)
    ctx.restore()
  }
}

ChartJS.register(lastValueBadgePlugin)

const props = defineProps({
  labels: { type: Array, required: true },
  odpData: { type: Array, required: true },
  odcData: { type: Array, required: true },
  targetOdp: { type: Number, required: true },
  targetOdc: { type: Number, required: true }
})

const latestOdp = computed(() => props.odpData.at(-1) ?? 0)
const latestOdc = computed(() => props.odcData.at(-1) ?? 0)
const shouldShowOdpPoint = computed(() => props.odpData.length <= 1)
const shouldShowOdcPoint = computed(() => props.odcData.length <= 1)
const odpTargetTrend = computed(() =>
  formatLabels.value.map((_, index, arr) => {
    if (arr.length <= 1) return props.targetOdp
    return Math.round((props.targetOdp * index) / (arr.length - 1))
  })
)
const odcTargetTrend = computed(() =>
  formatLabels.value.map((_, index, arr) => {
    if (arr.length <= 1) return props.targetOdc
    return Math.round((props.targetOdc * index) / (arr.length - 1))
  })
)
const odpMax = computed(() => Math.max(props.targetOdp, ...props.odpData, latestOdp.value))
const odcMax = computed(() => Math.max(props.targetOdc, ...props.odcData, latestOdc.value))

const createStepSize = (maxValue) => {
  if (maxValue <= 60) return 10
  if (maxValue <= 120) return 20
  if (maxValue <= 240) return 40
  return 50
}

const createAxisMax = (maxValue) => {
  const step = createStepSize(maxValue)
  return Math.ceil((maxValue * 1.08) / step) * step
}

const formatPercent = (value, target) => {
  if (!target) return '0%'
  return `${((value / target) * 100).toFixed(1)}%`
}

const formatLabels = computed(() => {
  if (!props.labels.length) {
    return ['01 Mei', '08 Mei', '16 Mei', '24 Mei', '31 Mei']
  }

  return props.labels.map((label) => {
    const date = new Date(label)
    if (Number.isNaN(date.getTime())) return label
    return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short' }).format(date)
  })
})

const darkOptions = (color, maxValue, badgeLabel, badgeColor, badgeShadow) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 700, easing: 'easeOutQuart' },
  plugins: {
    lastValueBadge: {
      datasetIndex: 1,
      label: badgeLabel,
      backgroundColor: badgeColor,
      shadowColor: badgeShadow
    },
    legend: {
      position: 'top',
      align: 'start',
      labels: {
        color: '#e8eefc',
        usePointStyle: true,
        boxWidth: 10,
        boxHeight: 10,
        padding: 18,
        font: { size: 12, weight: '600' }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(6, 13, 31, 0.96)',
      titleColor: '#ffffff',
      bodyColor: '#dbe7ff',
      borderColor: 'rgba(78, 111, 173, 0.45)',
      borderWidth: 1,
      padding: 12
    }
  },
  interaction: { mode: 'index', intersect: false },
  scales: {
    x: {
      grid: { display: false },
      border: { color: 'rgba(80, 109, 168, 0.2)' },
      ticks: { color: '#d8e4ff', font: { size: 11, weight: '600' } }
    },
    y: {
      beginAtZero: true,
      suggestedMax: createAxisMax(maxValue),
      grid: { color: 'rgba(85, 111, 161, 0.18)' },
      border: { color: 'rgba(80, 109, 168, 0.2)' },
      ticks: {
        color: '#c5d7fb',
        font: { size: 11, weight: '600' },
        stepSize: createStepSize(maxValue)
      }
    }
  },
  elements: {
    point: {
      radius: 0,
      hoverRadius: 4,
      hitRadius: 18,
      borderWidth: 2,
      backgroundColor: '#061225'
    },
    line: {
      borderCapStyle: 'round',
      borderJoinStyle: 'round'
    }
  },
  interactionColor: color
})

const odpOptions = computed(() =>
  darkOptions('#2f8cff', odpMax.value, latestOdp.value, '#2f8cff', 'rgba(47, 140, 255, 0.38)')
)
const odcOptions = computed(() =>
  darkOptions('#c04aff', odcMax.value, latestOdc.value, '#8d39ff', 'rgba(141, 57, 255, 0.42)')
)

const odpChartData = computed(() => ({
  labels: formatLabels.value,
  datasets: [
    {
      label: 'Target',
      data: odpTargetTrend.value,
      borderColor: 'rgba(220, 228, 244, 0.86)',
      borderWidth: 1.6,
      borderDash: [5, 5],
      pointRadius: 0,
      tension: 0,
      fill: false
    },
    {
      label: 'Terpasang',
      data: props.odpData.length ? props.odpData : [0, 22, 58, 67, latestOdp.value],
      borderColor: '#2f8cff',
      backgroundColor: 'rgba(47, 140, 255, 0.12)',
      borderWidth: 2.8,
      pointRadius: shouldShowOdpPoint.value ? 5 : 0,
      pointHoverRadius: shouldShowOdpPoint.value ? 6 : 4,
      pointBackgroundColor: '#2f8cff',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointHoverBackgroundColor: '#2f8cff',
      pointHoverBorderColor: '#ffffff',
      tension: 0.18,
      fill: false
    }
  ]
}))

const odcChartData = computed(() => ({
  labels: formatLabels.value,
  datasets: [
    {
      label: 'Target',
      data: odcTargetTrend.value,
      borderColor: 'rgba(225, 164, 255, 0.86)',
      borderWidth: 1.6,
      borderDash: [5, 5],
      pointRadius: 0,
      tension: 0,
      fill: false
    },
    {
      label: 'Terpasang',
      data: props.odcData.length ? props.odcData : [0, 3, 7, 10, latestOdc.value],
      borderColor: '#c04aff',
      backgroundColor: 'rgba(192, 74, 255, 0.1)',
      borderWidth: 2.8,
      pointRadius: shouldShowOdcPoint.value ? 5 : 0,
      pointHoverRadius: shouldShowOdcPoint.value ? 6 : 4,
      pointBackgroundColor: '#c04aff',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointHoverBackgroundColor: '#c04aff',
      pointHoverBorderColor: '#ffffff',
      tension: 0.18,
      fill: false
    }
  ]
}))
</script>

<template>
  <div class="chart-grid">
    <article class="chart-card chart-card--blue">
      <div class="chart-card__head">
        <div>
          <div class="chart-chip chart-chip--blue">
            <Activity :size="14" />
            Chart ODP
          </div>
          <h3 class="chart-card__title">Grafik Pembangunan ODP</h3>
          <p class="chart-card__desc">Pergerakan kumulatif ODP dibanding garis target proyek.</p>
        </div>
        <div class="chart-score">
          <p>Capaian</p>
          <strong>{{ latestOdp }}</strong>
        </div>
      </div>

      <div class="chart-metrics">
        <div class="chart-metric chart-metric--blue">
          <p>Target</p>
          <strong>{{ targetOdp }}</strong>
        </div>
        <div class="chart-metric chart-metric--green">
          <p>Progress</p>
          <strong>{{ formatPercent(latestOdp, targetOdp) }}</strong>
        </div>
      </div>

      <div class="chart-canvas">
        <Line :data="odpChartData" :options="odpOptions" class="!h-full !w-full" />
      </div>
    </article>

    <article class="chart-card chart-card--violet">
      <div class="chart-card__head">
        <div>
          <div class="chart-chip chart-chip--violet">
            <TrendingUp :size="14" />
            Chart ODC
          </div>
          <h3 class="chart-card__title">Grafik Pembangunan ODC</h3>
          <p class="chart-card__desc">Pantau akumulasi ODC harian dan jaraknya terhadap target akhir.</p>
        </div>
        <div class="chart-score chart-score--violet">
          <p>Capaian</p>
          <strong>{{ latestOdc }}</strong>
        </div>
      </div>

      <div class="chart-metrics">
        <div class="chart-metric chart-metric--violet">
          <p>Target</p>
          <strong>{{ targetOdc }}</strong>
        </div>
        <div class="chart-metric chart-metric--amber">
          <p>Progress</p>
          <strong>{{ formatPercent(latestOdc, targetOdc) }}</strong>
        </div>
      </div>

      <div class="chart-canvas">
        <Line :data="odcChartData" :options="odcOptions" class="!h-full !w-full" />
      </div>
    </article>
  </div>
</template>

<style scoped>
.chart-grid {
  display: grid;
  height: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.chart-card {
  position: relative;
  display: flex;
  height: 43rem;
  flex-direction: column;
  overflow: hidden;
  border-radius: 1.55rem;
  border: 1px solid rgba(70, 111, 184, 0.32);
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 24%),
    linear-gradient(180deg, rgba(4, 16, 41, 0.98), rgba(2, 10, 28, 0.98));
  padding: 1.15rem;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 24px 48px -34px rgba(2, 6, 23, 0.92);
}

.chart-card--violet {
  border-color: rgba(147, 77, 217, 0.34);
  background:
    radial-gradient(circle at top left, rgba(147, 77, 217, 0.14), transparent 24%),
    linear-gradient(180deg, rgba(17, 10, 50, 0.98), rgba(8, 8, 31, 0.98));
}

.chart-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.chart-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.78rem;
  border-radius: 0.95rem;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.chart-chip--blue {
  border: 1px solid rgba(69, 124, 255, 0.24);
  background: rgba(7, 29, 68, 0.72);
  color: #bdd7ff;
}

.chart-chip--violet {
  border: 1px solid rgba(171, 103, 255, 0.24);
  background: rgba(25, 12, 66, 0.72);
  color: #ebd7ff;
}

.chart-card__title {
  margin-top: 0.8rem;
  font-size: 1.35rem;
  font-weight: 800;
  color: #ffffff;
}

.chart-card__desc {
  margin-top: 0.35rem;
  font-size: 0.85rem;
  color: rgba(207, 220, 247, 0.8);
  line-height: 1.45;
}

.chart-score {
  min-width: 5.1rem;
  border-radius: 0.95rem;
  border: 1px solid rgba(69, 124, 255, 0.24);
  background: rgba(7, 29, 68, 0.72);
  padding: 0.72rem 0.82rem;
  text-align: center;
}

.chart-score--violet {
  border-color: rgba(171, 103, 255, 0.24);
  background: rgba(25, 12, 66, 0.72);
}

.chart-score p,
.chart-metric p {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #d0dfff;
}

.chart-score strong,
.chart-metric strong {
  display: block;
  margin-top: 0.28rem;
  font-size: 1.7rem;
  font-weight: 900;
  color: #ffffff;
}

.chart-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
  margin-top: 0.95rem;
}

.chart-metric {
  border-radius: 1rem;
  border: 1px solid rgba(69, 124, 255, 0.24);
  background: rgba(7, 29, 68, 0.72);
  padding: 0.8rem 0.9rem;
}

.chart-metric--green {
  border-color: rgba(59, 214, 146, 0.22);
  background: rgba(7, 51, 42, 0.68);
}

.chart-metric--violet {
  border-color: rgba(171, 103, 255, 0.24);
  background: rgba(25, 12, 66, 0.72);
}

.chart-metric--amber {
  border-color: rgba(255, 153, 49, 0.24);
  background: rgba(61, 27, 11, 0.72);
}

.chart-canvas {
  margin-top: 0.9rem;
  height: 26rem;
}

@media (max-width: 1023px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }

  .chart-card {
    height: auto;
  }

  .chart-canvas {
    height: 20rem;
  }
}

@media (max-width: 767px) {
  .chart-card__head {
    flex-direction: column;
  }

  .chart-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
