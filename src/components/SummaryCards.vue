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
      class="relative overflow-hidden xl:col-span-4 rounded-[28px] border border-slate-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.28),_transparent_26%),radial-gradient(circle_at_80%_20%,_rgba(52,211,153,0.2),_transparent_24%),linear-gradient(145deg,_#0f172a_0%,_#0f3b78_54%,_#0b6b7b_100%)] p-6 text-white shadow-[0_22px_55px_-30px_rgba(15,23,42,0.75)]"
    >
      <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08)_0%,transparent_28%,transparent_72%,rgba(255,255,255,0.06)_100%)]"></div>
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-100/70">
            Ringkasan Proyek
          </p>
          <h2 class="mt-3 text-2xl font-bold tracking-tight sm:text-[2rem]">
            KPI Pemasangan
          </h2>
        </div>
        <div class="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur-sm">
          <Target :size="24" />
        </div>
      </div>

      <div class="mt-8 grid grid-cols-2 gap-3">
        <div class="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur-sm shadow-inner shadow-white/5">
          <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100/70">Target</p>
          <p class="mt-2 text-4xl font-black tabular-nums">{{ target }}</p>
          <p class="mt-2 text-xs text-slate-200/75">ODP {{ targetOdp }} | ODC {{ targetOdc }}</p>
        </div>

        <div class="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur-sm shadow-inner shadow-white/5">
          <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100/70">Terpasang</p>
          <p class="mt-2 text-4xl font-black tabular-nums">{{ installed }}</p>
          <p class="mt-2 text-xs text-slate-200/75">ODP {{ installedOdp }} | ODC {{ installedOdc }}</p>
        </div>
      </div>

      <div class="mt-6 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur-sm shadow-inner shadow-white/5">
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
      class="relative overflow-hidden xl:col-span-2 rounded-[24px] border border-blue-100 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.18),_transparent_32%),linear-gradient(180deg,_#ffffff_0%,_#eff6ff_100%)] p-5 shadow-[0_18px_40px_-30px_rgba(37,99,235,0.32)]"
    >
      <div class="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(59,130,246,0.08),transparent)]"></div>
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Target</p>
          <p class="mt-3 text-4xl font-black tracking-tight text-slate-900 tabular-nums">{{ target }}</p>
        </div>
        <div class="rounded-2xl bg-white/80 p-3 text-blue-600 ring-1 ring-blue-100 shadow-sm backdrop-blur-sm">
          <Target :size="22" />
        </div>
      </div>

      <div class="mt-6 space-y-3">
        <div class="rounded-2xl border border-white/70 bg-white/75 p-3 shadow-sm backdrop-blur-sm">
          <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>ODP</span>
            <span class="text-base text-slate-900 tabular-nums">{{ targetOdp }}</span>
          </div>
        </div>
        <div class="rounded-2xl border border-white/70 bg-white/75 p-3 shadow-sm backdrop-blur-sm">
          <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>ODC</span>
            <span class="text-base text-slate-900 tabular-nums">{{ targetOdc }}</span>
          </div>
        </div>
      </div>
    </article>

    <article
      class="relative overflow-hidden xl:col-span-2 rounded-[24px] border border-indigo-100 bg-[radial-gradient(circle_at_top_right,_rgba(129,140,248,0.18),_transparent_30%),linear-gradient(180deg,_#ffffff_0%,_#eef2ff_100%)] p-5 shadow-[0_18px_40px_-30px_rgba(79,70,229,0.34)]"
    >
      <div class="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(99,102,241,0.08),transparent)]"></div>
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Total Terpasang
          </p>
          <p class="mt-3 text-4xl font-black tracking-tight text-slate-900 tabular-nums">{{ installed }}</p>
        </div>
        <div class="rounded-2xl bg-white/80 p-3 text-indigo-600 ring-1 ring-indigo-100 shadow-sm backdrop-blur-sm">
          <Activity :size="22" />
        </div>
      </div>

      <div class="mt-6 space-y-3">
        <div class="rounded-2xl border border-emerald-100/80 bg-white/75 p-3 shadow-sm backdrop-blur-sm">
          <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-emerald-700">
            <span>ODP</span>
            <span class="text-base text-slate-900 tabular-nums">{{ installedOdp }}</span>
          </div>
        </div>
        <div class="rounded-2xl border border-cyan-100/80 bg-white/75 p-3 shadow-sm backdrop-blur-sm">
          <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-cyan-700">
            <span>ODC</span>
            <span class="text-base text-slate-900 tabular-nums">{{ installedOdc }}</span>
          </div>
        </div>
      </div>
    </article>

    <article
      class="relative overflow-hidden xl:col-span-2 rounded-[24px] border border-emerald-100 bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.2),_transparent_30%),linear-gradient(180deg,_#ffffff_0%,_#ecfdf5_100%)] p-5 shadow-[0_18px_40px_-30px_rgba(16,185,129,0.32)]"
    >
      <div class="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(16,185,129,0.08),transparent)]"></div>
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Progress Total
          </p>
          <p class="mt-3 text-4xl font-black tracking-tight text-slate-900 tabular-nums">{{ progress }}%</p>
        </div>
        <div class="rounded-2xl bg-white/80 p-3 text-emerald-600 ring-1 ring-emerald-100 shadow-sm backdrop-blur-sm">
          <Percent :size="22" />
        </div>
      </div>

      <div class="mt-6 rounded-2xl border border-white/70 bg-white/75 p-3 shadow-sm backdrop-blur-sm">
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
      class="relative overflow-hidden xl:col-span-2 rounded-[24px] border border-amber-100 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.2),_transparent_32%),linear-gradient(180deg,_#ffffff_0%,_#fffbeb_100%)] p-5 shadow-[0_18px_40px_-30px_rgba(245,158,11,0.3)]"
    >
      <div class="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(245,158,11,0.08),transparent)]"></div>
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Sisa Hari</p>
          <p class="mt-3 text-4xl font-black tracking-tight text-slate-900 tabular-nums">
            {{ daysRemaining }}
          </p>
        </div>
        <div class="rounded-2xl bg-white/80 p-3 text-amber-600 ring-1 ring-amber-100 shadow-sm backdrop-blur-sm">
          <CalendarClock :size="22" />
        </div>
      </div>

      <div class="mt-6 flex items-center justify-between rounded-2xl border border-white/70 bg-white/75 p-3 shadow-sm backdrop-blur-sm">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</span>
        <span class="rounded-full px-3 py-1 text-xs font-bold ring-1" :class="daysTone">
          {{ daysRemaining <= 7 ? "Mepet" : "On Track" }}
        </span>
      </div>
    </article>

    <article
      class="relative overflow-hidden xl:col-span-12 rounded-[24px] border border-rose-100 bg-[radial-gradient(circle_at_top_left,_rgba(251,113,133,0.14),_transparent_24%),radial-gradient(circle_at_85%_10%,_rgba(251,146,60,0.16),_transparent_22%),linear-gradient(180deg,_#ffffff_0%,_#fff1f2_100%)] p-5 shadow-[0_18px_40px_-30px_rgba(244,63,94,0.25)]"
    >
      <div class="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(244,63,94,0.06),transparent)]"></div>
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="flex items-start gap-4">
          <div class="rounded-2xl bg-white/85 p-3 text-rose-600 ring-1 ring-rose-100 shadow-sm backdrop-blur-sm">
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
          <div class="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
            <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-rose-700">
              <span>ODP</span>
              <span class="text-lg text-slate-900 tabular-nums">{{ remainingOdp }}</span>
            </div>
          </div>
          <div class="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
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
