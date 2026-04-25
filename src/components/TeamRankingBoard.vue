<script setup>
import { computed } from 'vue'
import { Award, Crown, Medal, Skull, Trophy } from 'lucide-vue-next'

const props = defineProps({
  teamRankings: {
    type: Array,
    required: true
  }
})

const topThree = computed(() => props.teamRankings.slice(0, 3))
const otherTeams = computed(() => props.teamRankings.slice(3))
const lowestRank = computed(() => props.teamRankings.length)

const rankBadgeClasses = {
  1: 'bg-amber-100 text-amber-700 ring-amber-200',
  2: 'bg-slate-100 text-slate-700 ring-slate-200',
  3: 'bg-orange-100 text-orange-700 ring-orange-200'
}

const cardClasses = {
  1: 'border-amber-200 bg-gradient-to-br from-amber-50 to-white',
  2: 'border-slate-200 bg-gradient-to-br from-slate-50 to-white',
  3: 'border-orange-200 bg-gradient-to-br from-orange-50 to-white'
}

const getRankBadgeClass = (rank) => {
  return rankBadgeClasses[rank] ?? 'bg-blue-100 text-blue-700 ring-blue-200'
}

const getCardClass = (rank) => {
  return cardClasses[rank] ?? 'border-blue-100 bg-white'
}

const getPodiumColumnClass = (rank) => {
  if (rank === 1) return 'md:order-2'
  if (rank === 2) return 'md:order-1'
  return 'md:order-3'
}

const getPodiumHeightClass = (rank) => {
  if (rank === 1) return 'min-h-[300px]'
  if (rank === 2) return 'min-h-[280px]'
  return 'min-h-[260px]'
}

const getPodiumGlowClass = (rank) => {
  if (rank === 1) return 'from-amber-300/30 via-yellow-200/20 to-white'
  if (rank === 2) return 'from-slate-300/25 via-slate-200/20 to-white'
  return 'from-orange-300/25 via-amber-100/20 to-white'
}

const getRankIcon = (rank) => {
  if (rank === 1) return Trophy
  if (rank === 2) return Medal
  return Award
}

const getRankLabel = (rank) => {
  if (rank === 1) return 'Juara 1'
  if (rank === 2) return 'Juara 2'
  return 'Juara 3'
}

const getPedestalClass = (rank) => {
  if (rank === 1) return 'h-28 bg-gradient-to-b from-amber-300 to-amber-500'
  if (rank === 2) return 'h-20 bg-gradient-to-b from-slate-300 to-slate-500'
  return 'h-14 bg-gradient-to-b from-orange-300 to-orange-500'
}

const getAccentTextClass = (rank) => {
  if (rank === 1) return 'text-amber-700'
  if (rank === 2) return 'text-slate-700'
  return 'text-orange-700'
}

const getAccentChipClass = (rank) => {
  if (rank === 1) return 'bg-amber-50/90 text-amber-800 ring-amber-200'
  if (rank === 2) return 'bg-slate-50/90 text-slate-800 ring-slate-200'
  return 'bg-orange-50/90 text-orange-800 ring-orange-200'
}

const getAccentStatClass = (rank) => {
  if (rank === 1) return 'from-amber-50 to-yellow-50 border-amber-100'
  if (rank === 2) return 'from-slate-50 to-gray-50 border-slate-100'
  return 'from-orange-50 to-amber-50 border-orange-100'
}

const isLowestRank = (rank) => rank === lowestRank.value
</script>

<template>
  <section class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-xs font-semibold tracking-[0.2em] uppercase text-blue-100">Halaman Depan</p>
          <h2 class="text-xl md:text-2xl font-bold mt-1">Ranking Tim Instalasi</h2>
        </div>
        <div class="text-right">
          <p class="text-xs text-blue-100">Peringkat dihitung dari total ODP + ODC</p>
        </div>
      </div>
    </div>

    <div class="px-4 pt-4 md:px-6 md:pt-6">
      <div class="rounded-[28px] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_55%),linear-gradient(180deg,_#eff6ff_0%,_#ffffff_100%)] border border-blue-100 p-4 md:p-6 overflow-hidden">
        <div class="flex items-center justify-between gap-4 mb-6">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Top 3</p>
            <h3 class="text-lg md:text-xl font-bold text-slate-900 mt-1">Podium Performa Teratas</h3>
          </div>
          <p class="text-sm text-slate-500">Ranking tertinggi tampil paling menonjol di depan.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div
            v-for="team in topThree"
            :key="`podium-${team.id}`"
            class="podium-slot flex flex-col justify-end"
            :class="getPodiumColumnClass(team.rank)"
            :style="{ animationDelay: `${team.rank * 140}ms` }"
          >
            <div v-if="team.rank === 1" class="crown-wrap flex justify-center">
              <div class="crown-badge">
                <Crown :size="42" stroke-width="2.4" />
              </div>
            </div>

            <article
              class="podium-card relative overflow-hidden rounded-[24px] border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              :class="[getCardClass(team.rank), getPodiumHeightClass(team.rank)]"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br opacity-80 pointer-events-none"
                :class="getPodiumGlowClass(team.rank)"
              />
              <div class="relative h-full flex flex-col">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div
                      class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] shadow-sm backdrop-blur-sm ring-1"
                      :class="getAccentChipClass(team.rank)"
                    >
                      <component :is="getRankIcon(team.rank)" :size="14" class="podium-icon" />
                      <span>{{ getRankLabel(team.rank) }}</span>
                    </div>
                    <p class="text-sm font-semibold text-gray-500 mt-3">{{ team.name }}</p>
                    <h4 class="text-2xl font-black text-gray-900 mt-1">{{ team.pic }}</h4>
                  </div>
                  <div
                    class="rank-badge w-12 h-12 rounded-full ring-1 flex items-center justify-center text-sm font-bold"
                    :class="[getRankBadgeClass(team.rank), { 'rank-badge-top': team.rank === 1 }]"
                  >
                    #{{ team.rank }}
                  </div>
                </div>

                <div class="mt-8">
                  <p class="text-sm text-gray-500">Total Instalasi</p>
                  <p class="text-5xl font-black mt-2 leading-none" :class="getAccentTextClass(team.rank)">
                    {{ team.totalInstalled }}
                  </p>
                </div>

                <div class="mt-auto pt-6">
                  <div class="h-3 rounded-full bg-white/70 overflow-hidden">
                    <div
                      class="progress-bar h-full rounded-full"
                      :class="team.rank === 1 ? 'bg-amber-400' : team.rank === 2 ? 'bg-slate-400' : 'bg-orange-400'"
                      :style="{ width: `${Math.min((team.totalInstalled / Math.max(topThree[0]?.totalInstalled || 1, 1)) * 100, 100)}%` }"
                    />
                  </div>
                  <div class="mt-4 grid grid-cols-2 gap-3">
                    <div
                      class="rounded-xl border bg-gradient-to-br px-4 py-3 backdrop-blur-sm"
                      :class="getAccentStatClass(team.rank)"
                    >
                      <p class="text-xs font-semibold uppercase tracking-wide text-blue-600">ODP</p>
                      <p class="text-lg font-bold text-blue-900 mt-1">{{ team.odp }}</p>
                    </div>
                    <div
                      class="rounded-xl border bg-gradient-to-br px-4 py-3 backdrop-blur-sm"
                      :class="getAccentStatClass(team.rank)"
                    >
                      <p class="text-xs font-semibold uppercase tracking-wide text-violet-600">ODC</p>
                      <p class="text-lg font-bold text-violet-900 mt-1">{{ team.odc }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <div
              class="podium-base relative mx-3 rounded-b-[22px] rounded-t-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
              :class="getPedestalClass(team.rank)"
            >
              <div class="absolute inset-x-4 top-0 h-px bg-white/60" />
              <div class="absolute inset-x-0 bottom-3 flex justify-center">
                <span class="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white/90 ring-1 ring-white/20">
                  {{ getRankLabel(team.rank) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="otherTeams.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4 md:p-6">
      <article
        v-for="team in otherTeams"
        :key="team.id"
        class="ranking-card rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        :class="getCardClass(team.rank)"
        :style="{ animationDelay: `${team.rank * 120}ms` }"
      >
        <div v-if="isLowestRank(team.rank)" class="lowest-rank-mark">
          <Skull :size="28" stroke-width="2.4" class="lowest-rank-skull" />
          <span>Posisi Terbawah</span>
        </div>

        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-gray-500">{{ team.name }}</p>
            <h3 class="text-xl font-bold text-gray-900 mt-1">{{ team.pic }}</h3>
          </div>
          <div
            class="rank-badge w-11 h-11 rounded-full ring-1 flex items-center justify-center text-sm font-bold"
            :class="[getRankBadgeClass(team.rank), { 'rank-badge-top': team.rank === 1 }]"
          >
            #{{ team.rank }}
          </div>
        </div>

        <div class="mt-6">
          <p class="text-sm text-gray-500">Total Instalasi</p>
          <p class="text-3xl font-extrabold text-gray-900 mt-1">{{ team.totalInstalled }}</p>
        </div>

        <div class="mt-5 grid grid-cols-2 gap-3">
          <div class="rounded-xl bg-blue-50 px-4 py-3">
            <p class="text-xs font-semibold uppercase tracking-wide text-blue-600">ODP</p>
            <p class="text-lg font-bold text-blue-900 mt-1">{{ team.odp }}</p>
          </div>
          <div class="rounded-xl bg-violet-50 px-4 py-3">
            <p class="text-xs font-semibold uppercase tracking-wide text-violet-600">ODC</p>
            <p class="text-lg font-bold text-violet-900 mt-1">{{ team.odc }}</p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.podium-slot,
.podium-card,
.ranking-card {
  opacity: 0;
  transform: translateY(18px) scale(0.98);
  animation: cardEnter 0.6s ease-out forwards;
}

.podium-slot:hover,
.podium-card:hover,
.ranking-card:hover {
  animation-play-state: paused;
}

.rank-badge-top {
  animation: crownPulse 2.4s ease-in-out infinite;
}

.podium-card::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 1.5rem;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(255, 255, 255, 0));
  pointer-events: none;
}

.podium-card,
.ranking-card {
  position: relative;
}

.crown-wrap {
  margin-bottom: -0.9rem;
  position: relative;
  z-index: 2;
}

.crown-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 5.25rem;
  height: 5.25rem;
  border-radius: 9999px;
  color: rgb(180 83 9);
  background: radial-gradient(circle at 30% 30%, rgba(254, 240, 138, 1), rgba(250, 204, 21, 0.98) 45%, rgba(217, 119, 6, 0.98));
  box-shadow: 0 18px 40px rgba(245, 158, 11, 0.42), 0 0 0 8px rgba(253, 224, 71, 0.22);
  border: 1px solid rgba(217, 119, 6, 0.35);
  animation: crownFloat 2.6s ease-in-out infinite;
}

.lowest-rank-mark {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 1rem;
  padding: 0.55rem 0.95rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgb(254 226 226);
  background: linear-gradient(135deg, rgb(69 10 10), rgb(127 29 29));
  border: 1px solid rgb(248 113 113);
  box-shadow: 0 12px 28px rgba(127, 29, 29, 0.35);
}

.lowest-rank-skull {
  color: rgb(254 202 202);
  filter: drop-shadow(0 0 10px rgba(248, 113, 113, 0.65));
}

.progress-bar {
  transform-origin: left center;
  animation: progressGrow 0.9s ease-out both;
}

.podium-icon {
  animation: iconFloat 2.8s ease-in-out infinite;
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes crownPulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.3);
  }
  50% {
    transform: scale(1.08);
    box-shadow: 0 0 0 10px rgba(251, 191, 36, 0);
  }
}

@keyframes progressGrow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@keyframes iconFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

@keyframes crownFloat {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-6px) rotate(-4deg) scale(1.04);
  }
}

@media (prefers-reduced-motion: reduce) {
  .podium-card,
  .ranking-card,
  .rank-badge-top,
  .progress-bar,
  .podium-icon,
  .crown-badge {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
