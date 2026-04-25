<script setup>
import { computed } from "vue";
import { Target, Activity, Percent, CalendarClock, Skull } from "lucide-vue-next";

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
const progressWidth = computed(() => Math.min(Math.max(props.progress, 0), 100));
const installedRatioLabel = computed(() => `${props.installed} / ${props.target}`);
const daysTone = computed(() =>
  props.daysRemaining <= 7
    ? "text-rose-700 bg-rose-50 ring-rose-200"
    : "text-amber-700 bg-amber-50 ring-amber-200"
);
</script>

<template>
  <section class="grid grid-cols-1 gap-4 xl:grid-cols-12">
    <article
      class="xl:col-span-4 rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,_#0f172a_0%,_#0f3b78_60%,_#0c6c7c_100%)] p-6 text-white shadow-[0_22px_55px_-30px_rgba(15,23,42,0.75)]"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-100/70">
            Ringkasan Proyek
          </p>
          <h2 class="mt-3 text-2xl font-bold tracking-tight sm:text-[2rem]">
            KPI Pemasangan
          </h2>
          <p class="mt-2 max-w-sm text-sm leading-6 text-slate-200/80">
            Fokus pada target, realisasi, progres, dan sisa pekerjaan dengan tampilan angka
            yang lebih presisi.
          </p>
        </div>
        <div class="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
          <Target :size="24" />
        </div>
      </div>

      <div class="mt-8 grid grid-cols-2 gap-3">
        <div class="rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
          <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100/70">Target</p>
          <p class="mt-2 text-4xl font-black tabular-nums">{{ target }}</p>
          <p class="mt-2 text-xs text-slate-200/75">ODP {{ targetOdp }} • ODC {{ targetOdc }}</p>
        </div>

        <div class="rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
          <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100/70">Terpasang</p>
          <p class="mt-2 text-4xl font-black tabular-nums">{{ installed }}</p>
          <p class="mt-2 text-xs text-slate-200/75">ODP {{ installedOdp }} • ODC {{ installedOdc }}</p>
        </div>
      </div>

      <div class="mt-6 rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100/70">
              Progress Total
            </p>
            <p class="mt-2 text-3xl font-black tabular-nums">{{ progress }}%</p>
          </div>
          <div class="text-right">
            <p class="text-[11px] uppercase tracking-[0.2em] text-cyan-100/70">Realisasi</p>
            <p class="mt-2 text-lg font-bold tabular-nums">{{ installedRatioLabel }}</p>
          </div>
        </div>
        <div class="mt-4 h-3 rounded-full bg-white/12">
          <div
            class="h-3 rounded-full bg-[linear-gradient(90deg,_#38bdf8_0%,_#34d399_100%)] transition-all duration-700"
            :style="{ width: `${progressWidth}%` }"
          ></div>
        </div>
      </div>
    </article>

    <article
      class="xl:col-span-2 rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)]"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Target</p>
          <p class="mt-3 text-4xl font-black tracking-tight text-slate-900 tabular-nums">{{ target }}</p>
        </div>
        <div class="rounded-2xl bg-blue-50 p-3 text-blue-600 ring-1 ring-blue-100">
          <Target :size="22" />
        </div>
      </div>

      <div class="mt-6 space-y-3">
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>ODP</span>
            <span class="text-base text-slate-900 tabular-nums">{{ targetOdp }}</span>
          </div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>ODC</span>
            <span class="text-base text-slate-900 tabular-nums">{{ targetOdc }}</span>
          </div>
        </div>
      </div>
    </article>

    <article
      class="xl:col-span-2 rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)]"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Total Terpasang
          </p>
          <p class="mt-3 text-4xl font-black tracking-tight text-slate-900 tabular-nums">{{ installed }}</p>
        </div>
        <div class="rounded-2xl bg-indigo-50 p-3 text-indigo-600 ring-1 ring-indigo-100">
          <Activity :size="22" />
        </div>
      </div>

      <div class="mt-6 space-y-3">
        <div class="rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
          <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-emerald-700">
            <span>ODP</span>
            <span class="text-base text-slate-900 tabular-nums">{{ installedOdp }}</span>
          </div>
        </div>
        <div class="rounded-2xl border border-cyan-100 bg-cyan-50 p-3">
          <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-cyan-700">
            <span>ODC</span>
            <span class="text-base text-slate-900 tabular-nums">{{ installedOdc }}</span>
          </div>
        </div>
      </div>
    </article>

    <article
      class="xl:col-span-2 rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)]"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Progress Total
          </p>
          <p class="mt-3 text-4xl font-black tracking-tight text-slate-900 tabular-nums">{{ progress }}%</p>
        </div>
        <div class="rounded-2xl bg-emerald-50 p-3 text-emerald-600 ring-1 ring-emerald-100">
          <Percent :size="22" />
        </div>
      </div>

      <div class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>Capaian</span>
          <span class="text-sm text-slate-900 tabular-nums">{{ installedRatioLabel }}</span>
        </div>
        <div class="mt-3 h-3 rounded-full bg-slate-200">
          <div
            class="h-3 rounded-full bg-[linear-gradient(90deg,_#10b981_0%,_#84cc16_100%)] transition-all duration-700"
            :style="{ width: `${progressWidth}%` }"
          ></div>
        </div>
      </div>
    </article>

    <article
      class="xl:col-span-2 rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)]"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Sisa Hari</p>
          <p class="mt-3 text-4xl font-black tracking-tight text-slate-900 tabular-nums">
            {{ daysRemaining }}
          </p>
        </div>
        <div class="rounded-2xl bg-amber-50 p-3 text-amber-600 ring-1 ring-amber-100">
          <CalendarClock :size="22" />
        </div>
      </div>

      <div class="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</span>
        <span class="rounded-full px-3 py-1 text-xs font-bold ring-1" :class="daysTone">
          {{ daysRemaining <= 7 ? "Mepet" : "On Track" }}
        </span>
      </div>
    </article>

    <article
      class="xl:col-span-12 rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)]"
    >
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="flex items-start gap-4">
          <div class="rounded-2xl bg-rose-50 p-3 text-rose-600 ring-1 ring-rose-100">
            <Skull :size="22" />
          </div>
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Sisa Pemasangan
            </p>
            <p class="mt-2 text-4xl font-black tracking-tight text-slate-900 tabular-nums">
              {{ remainingTotal }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-[360px]">
          <div class="rounded-2xl border border-rose-100 bg-rose-50 p-4">
            <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-rose-700">
              <span>ODP</span>
              <span class="text-lg text-slate-900 tabular-nums">{{ remainingOdp }}</span>
            </div>
          </div>
          <div class="rounded-2xl border border-orange-100 bg-orange-50 p-4">
            <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-orange-700">
              <span>ODC</span>
              <span class="text-lg text-slate-900 tabular-nums">{{ remainingOdc }}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>
