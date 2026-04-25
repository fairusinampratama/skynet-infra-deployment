<script setup>
import { computed } from 'vue'
import { BarChart3, RadioTower, ShieldEllipsis, Users } from 'lucide-vue-next'

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

const percentNumber = (value, target) => {
  if (target === 0) return 0
  return Math.min((value / target) * 100, 100)
}

const grandTotalOdp = computed(() => props.teamTotals.reduce((s, t) => s + t.odp, 0))
const grandTotalOdc = computed(() => props.teamTotals.reduce((s, t) => s + t.odc, 0))
const overallTotal = computed(() => grandTotalOdp.value + grandTotalOdc.value)

const enrichedTeams = computed(() =>
  props.teamTotals.map((team, index) => ({
    ...team,
    rank: index + 1,
    totalInstalled: team.odp + team.odc,
    odpWidth: percentNumber(team.odp, props.targetOdp),
    odcWidth: percentNumber(team.odc, props.targetOdc)
  }))
)
</script>

<template>
  <div
    class="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_26%),linear-gradient(180deg,_#ffffff_0%,_#f8fbff_100%)] shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]"
  >
    <div class="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(59,130,246,0.08),transparent)]"></div>

    <div class="relative flex-none border-b border-slate-200/80 px-6 py-5">
      <div class="flex items-start justify-between gap-4">
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700 ring-1 ring-blue-100"
          >
            <Users :size="14" />
            Ringkasan Tim
          </div>
          <h3 class="mt-3 text-xl font-bold tracking-tight text-slate-900">Rekap ODP & ODC Per Tim</h3>
          <p class="mt-1 text-sm text-slate-500">Pantau capaian setiap tim dengan progress yang lebih mudah dibaca.</p>
        </div>

        <div class="rounded-2xl bg-white/80 p-3 text-blue-600 ring-1 ring-slate-200 shadow-sm backdrop-blur-sm">
          <BarChart3 :size="22" />
        </div>
      </div>

      <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div class="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Total Tim</p>
          <p class="mt-2 text-3xl font-black text-slate-900 tabular-nums">{{ teamTotals.length }}</p>
        </div>
        <div class="rounded-2xl border border-blue-100 bg-blue-50/80 p-4 shadow-sm">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700">Total ODP</p>
          <p class="mt-2 text-3xl font-black text-slate-900 tabular-nums">{{ grandTotalOdp }}</p>
        </div>
        <div class="rounded-2xl border border-violet-100 bg-violet-50/80 p-4 shadow-sm">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700">Total ODC</p>
          <p class="mt-2 text-3xl font-black text-slate-900 tabular-nums">{{ grandTotalOdc }}</p>
        </div>
      </div>
    </div>

    <div class="relative flex-grow space-y-4 overflow-y-auto px-5 py-5">
      <article
        v-for="team in enrichedTeams"
        :key="team.id"
        class="rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-24px_rgba(59,130,246,0.28)]"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white"
              >
                T{{ team.rank }}
              </div>
              <div>
                <h4 class="text-base font-bold text-slate-900">{{ team.name }}</h4>
                <p class="text-sm text-slate-500">{{ team.pic }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-2xl bg-slate-50 px-3 py-2 text-right ring-1 ring-slate-200">
            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Total</p>
            <p class="mt-1 text-2xl font-black text-slate-900 tabular-nums">{{ team.totalInstalled }}</p>
          </div>
        </div>

        <div class="mt-5 grid grid-cols-2 gap-3">
          <div class="rounded-2xl border border-blue-100 bg-blue-50/80 p-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-blue-700">
                <RadioTower :size="15" />
                <span class="text-[11px] font-semibold uppercase tracking-[0.18em]">ODP</span>
              </div>
              <span class="text-sm font-bold text-slate-900 tabular-nums">{{ team.odp }}</span>
            </div>
            <div class="mt-3 h-2.5 rounded-full bg-blue-100">
              <div
                class="h-2.5 rounded-full bg-[linear-gradient(90deg,_#2563eb_0%,_#38bdf8_100%)] transition-all duration-700"
                :style="{ width: `${team.odpWidth}%` }"
              ></div>
            </div>
            <p class="mt-2 text-xs font-medium text-blue-800">{{ formatPercent(team.odp, targetOdp) }}</p>
          </div>

          <div class="rounded-2xl border border-violet-100 bg-violet-50/80 p-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-violet-700">
                <ShieldEllipsis :size="15" />
                <span class="text-[11px] font-semibold uppercase tracking-[0.18em]">ODC</span>
              </div>
              <span class="text-sm font-bold text-slate-900 tabular-nums">{{ team.odc }}</span>
            </div>
            <div class="mt-3 h-2.5 rounded-full bg-violet-100">
              <div
                class="h-2.5 rounded-full bg-[linear-gradient(90deg,_#7c3aed_0%,_#c084fc_100%)] transition-all duration-700"
                :style="{ width: `${team.odcWidth}%` }"
              ></div>
            </div>
            <p class="mt-2 text-xs font-medium text-violet-800">{{ formatPercent(team.odc, targetOdc) }}</p>
          </div>
        </div>
      </article>
    </div>

    <div class="relative mt-auto border-t border-slate-200/80 bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef6ff_100%)] px-6 py-5">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Total Keseluruhan</p>
          <p class="mt-2 text-3xl font-black text-slate-900 tabular-nums">{{ overallTotal }}</p>
        </div>

        <div class="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-[360px]">
          <div class="rounded-2xl border border-blue-100 bg-white/85 p-4 shadow-sm">
            <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span>Total ODP</span>
              <span class="text-lg text-slate-900 tabular-nums">{{ grandTotalOdp }}</span>
            </div>
            <div class="mt-3 h-2.5 rounded-full bg-blue-100">
              <div
                class="h-2.5 rounded-full bg-[linear-gradient(90deg,_#2563eb_0%,_#38bdf8_100%)] transition-all duration-700"
                :style="{ width: `${percentNumber(grandTotalOdp, targetOdp)}%` }"
              ></div>
            </div>
            <p class="mt-2 text-xs font-medium text-blue-800">{{ formatPercent(grandTotalOdp, targetOdp) }}</p>
          </div>

          <div class="rounded-2xl border border-violet-100 bg-white/85 p-4 shadow-sm">
            <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span>Total ODC</span>
              <span class="text-lg text-slate-900 tabular-nums">{{ grandTotalOdc }}</span>
            </div>
            <div class="mt-3 h-2.5 rounded-full bg-violet-100">
              <div
                class="h-2.5 rounded-full bg-[linear-gradient(90deg,_#7c3aed_0%,_#c084fc_100%)] transition-all duration-700"
                :style="{ width: `${percentNumber(grandTotalOdc, targetOdc)}%` }"
              ></div>
            </div>
            <p class="mt-2 text-xs font-medium text-violet-800">{{ formatPercent(grandTotalOdc, targetOdc) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
