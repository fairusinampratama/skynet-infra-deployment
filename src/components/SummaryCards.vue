<script setup>
import { computed } from "vue";
import {
  Target,
  Activity,
  Percent,
  CalendarClock,
  Skull,
  ArrowUpRight,
} from "lucide-vue-next";

const props = defineProps({
  target: {
    type: Number,
    required: true,
  },
  targetOdp: {
    type: Number,
    required: true,
  },
  targetOdc: {
    type: Number,
    required: true,
  },
  installed: {
    type: Number,
    required: true,
  },
  installedOdp: {
    type: Number,
    required: true,
  },
  installedOdc: {
    type: Number,
    required: true,
  },
  progress: {
    type: Number,
    required: true,
  },
  daysRemaining: {
    type: Number,
    required: true,
  },
  remainingOdp: {
    type: Number,
    required: true,
  },
  remainingOdc: {
    type: Number,
    required: true,
  },
});

const remainingTotal = computed(() => props.remainingOdp + props.remainingOdc);
const completedRatio = computed(() =>
  props.target === 0 ? 0 : Math.min((props.installed / props.target) * 100, 100)
);
const dayTone = computed(() =>
  props.daysRemaining <= 7
    ? "text-rose-600 bg-rose-100 border-rose-200"
    : "text-amber-700 bg-amber-100 border-amber-200"
);
</script>

<template>
  <section class="grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_repeat(4,minmax(0,1fr))]">
    <article
      class="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.2),_transparent_35%),linear-gradient(135deg,_#0f172a_0%,_#1d4ed8_55%,_#22c55e_130%)] p-6 text-white shadow-[0_22px_60px_-24px_rgba(15,23,42,0.75)]"
    >
      <div class="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.08)_45%,transparent_100%)]"></div>

      <div class="relative flex h-full flex-col gap-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div class="max-w-xl">
            <div
              class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-50 backdrop-blur"
            >
              <Target :size="14" />
              Ringkasan Proyek
            </div>
            <h2 class="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Target {{ target }} titik dengan progres {{ progress }}%
            </h2>
            <p class="mt-2 max-w-lg text-sm leading-6 text-blue-50/80">
              Pantau capaian utama pemasangan ODP dan ODC dalam satu tampilan yang
              lebih jelas, rapi, dan mudah dibaca.
            </p>
          </div>

          <div class="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <p class="text-xs font-medium uppercase tracking-[0.22em] text-blue-100/80">
              Total Terpasang
            </p>
            <div class="mt-3 flex items-end gap-2">
              <span class="text-4xl font-bold leading-none">{{ installed }}</span>
              <span class="pb-1 text-sm font-medium text-blue-100/80">dari {{ target }}</span>
            </div>
            <div class="mt-4 h-2.5 w-52 rounded-full bg-white/15">
              <div
                class="h-2.5 rounded-full bg-white transition-all duration-700"
                :style="{ width: `${completedRatio}%` }"
              ></div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div class="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div class="flex items-center justify-between">
              <p class="text-xs font-medium uppercase tracking-[0.22em] text-blue-100/80">
                Target
              </p>
              <ArrowUpRight :size="16" class="text-blue-100/70" />
            </div>
            <p class="mt-3 text-3xl font-bold leading-none">{{ target }}</p>
            <div class="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span class="rounded-full bg-white/12 px-3 py-1.5 text-white">ODP {{ targetOdp }}</span>
              <span class="rounded-full bg-white/12 px-3 py-1.5 text-white">ODC {{ targetOdc }}</span>
            </div>
          </div>

          <div class="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div class="flex items-center justify-between">
              <p class="text-xs font-medium uppercase tracking-[0.22em] text-blue-100/80">
                Terpasang
              </p>
              <Activity :size="16" class="text-blue-100/70" />
            </div>
            <p class="mt-3 text-3xl font-bold leading-none">{{ installed }}</p>
            <div class="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span class="rounded-full bg-emerald-400/20 px-3 py-1.5 text-emerald-50">
                ODP {{ installedOdp }}
              </span>
              <span class="rounded-full bg-cyan-400/20 px-3 py-1.5 text-cyan-50">
                ODC {{ installedOdc }}
              </span>
            </div>
          </div>

          <div class="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div class="flex items-center justify-between">
              <p class="text-xs font-medium uppercase tracking-[0.22em] text-blue-100/80">
                Sisa Pemasangan
              </p>
              <Skull :size="16" class="text-blue-100/70" />
            </div>
            <p class="mt-3 text-3xl font-bold leading-none">{{ remainingTotal }}</p>
            <div class="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span class="rounded-full bg-rose-400/20 px-3 py-1.5 text-rose-50">
                ODP {{ remainingOdp }}
              </span>
              <span class="rounded-full bg-orange-400/20 px-3 py-1.5 text-orange-50">
                ODC {{ remainingOdc }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>

    <article
      class="group relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(37,99,235,0.35)]"
    >
      <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400"></div>
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Target</p>
          <p class="mt-3 text-3xl font-bold tracking-tight text-slate-900">{{ target }}</p>
        </div>
        <div class="rounded-2xl bg-blue-50 p-3 text-blue-600 ring-1 ring-blue-100">
          <Target :size="22" />
        </div>
      </div>
      <div class="mt-5 space-y-3">
        <div class="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">ODP</span>
          <span class="text-sm font-bold text-slate-900">{{ targetOdp }}</span>
        </div>
        <div class="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">ODC</span>
          <span class="text-sm font-bold text-slate-900">{{ targetOdc }}</span>
        </div>
      </div>
    </article>

    <article
      class="group relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(79,70,229,0.35)]"
    >
      <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Total Terpasang
          </p>
          <p class="mt-3 text-3xl font-bold tracking-tight text-slate-900">{{ installed }}</p>
        </div>
        <div class="rounded-2xl bg-indigo-50 p-3 text-indigo-600 ring-1 ring-indigo-100">
          <Activity :size="22" />
        </div>
      </div>
      <div class="mt-5 space-y-3">
        <div class="flex items-center justify-between rounded-2xl bg-indigo-50/70 px-3 py-2.5">
          <span class="text-xs font-semibold uppercase tracking-wide text-indigo-600">ODP</span>
          <span class="text-sm font-bold text-slate-900">{{ installedOdp }}</span>
        </div>
        <div class="flex items-center justify-between rounded-2xl bg-cyan-50 px-3 py-2.5">
          <span class="text-xs font-semibold uppercase tracking-wide text-cyan-700">ODC</span>
          <span class="text-sm font-bold text-slate-900">{{ installedOdc }}</span>
        </div>
      </div>
    </article>

    <article
      class="group relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(16,185,129,0.35)]"
    >
      <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-lime-400"></div>
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Progress Total
          </p>
          <p class="mt-3 text-3xl font-bold tracking-tight text-slate-900">{{ progress }}%</p>
        </div>
        <div class="rounded-2xl bg-emerald-50 p-3 text-emerald-600 ring-1 ring-emerald-100">
          <Percent :size="22" />
        </div>
      </div>
      <div class="mt-5">
        <div class="flex items-center justify-between text-xs font-medium text-slate-500">
          <span>Capaian proyek</span>
          <span>{{ installed }}/{{ target }}</span>
        </div>
        <div class="mt-2 h-3 rounded-full bg-slate-100">
          <div
            class="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-700"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </article>

    <article
      class="group relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(244,114,182,0.28)]"
    >
      <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 to-rose-400"></div>
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Sisa Hari</p>
          <p class="mt-3 text-3xl font-bold tracking-tight text-slate-900">{{ daysRemaining }}</p>
          <p class="mt-1 text-sm text-slate-500">Hari menuju deadline</p>
        </div>
        <div class="rounded-2xl bg-amber-50 p-3 text-amber-600 ring-1 ring-amber-100">
          <CalendarClock :size="22" />
        </div>
      </div>
      <div class="mt-5">
        <div
          class="inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold"
          :class="dayTone"
        >
          {{ daysRemaining <= 7 ? "Perlu akselerasi" : "Masih ada ruang kerja" }}
        </div>
      </div>
    </article>
  </section>
</template>
