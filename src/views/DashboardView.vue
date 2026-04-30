<script setup>
import { computed } from 'vue'
import { CalendarDays, Clock3 } from 'lucide-vue-next'
import { useDashboard } from '../composables/useDashboard'
import SummaryCards from '../components/SummaryCards.vue'
import ProgressCharts from '../components/ProgressCharts.vue'
import TeamRekapTable from '../components/TeamRekapTable.vue'
import TeamRankingBoard from '../components/TeamRankingBoard.vue'
import SkynetLogo from '../components/SkynetLogo.vue'

const {
  TARGET_ODP,
  TARGET_ODC,
  TOTAL_TARGET,
  totalOdp,
  totalOdc,
  totalInstalled,
  progressPercent,
  logs,
  fetchLogsFailed,
  remainingDays,
  remainingOdp,
  remainingOdc,
  chartData,
  teamTotals,
  teamRankings
} = useDashboard()

const TOTAL_REWARD = 20000000

const latestLog = computed(() => logs.value[logs.value.length - 1] ?? null)
const nonRankingTeams = computed(() => teamTotals.value.filter((team) => team.rankingEligible === false))

const latestDateLabel = computed(() => {
  if (!latestLog.value?.date) return '24 Mei 2025'

  const date = new Date(latestLog.value.date)

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
})

const latestTimeLabel = computed(() => {
  if (!latestLog.value?.updatedAt) return '10:30'

  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(latestLog.value.updatedAt))
})
</script>

<template>
  <div class="space-y-5 pb-8">
    <section class="showcase-frame relative overflow-hidden rounded-[1.95rem] border border-blue-400/20 shadow-[0_28px_80px_-38px_rgba(2,6,23,0.9)]">
      <div class="showcase-top absolute inset-x-0 top-0 h-[10.6rem] md:h-[11rem]" />
      <div class="showcase-topline showcase-topline--left" />
      <div class="showcase-topline showcase-topline--right" />
      <div class="showcase-cutout" />
      <div class="showcase-surface" />

      <div class="relative z-10 px-5 pb-6 pt-4 md:px-7 md:pt-5">
        <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_350px] lg:items-start">
          <div class="flex items-start gap-5 text-white">
            <div class="brand-mark" aria-hidden="true">
              <SkynetLogo />
            </div>

            <div class="brand-copy pt-1">
              <p class="brand-copy__eyebrow text-[1rem] font-black uppercase tracking-[0.08em] text-white md:text-[1.18rem]">
                PEMBANGUNAN ODP & ODC
              </p>
              <div class="brand-title-wrap mt-0.5">
                <h1 class="brand-title text-[2.8rem] font-black leading-none md:text-[4rem]">SKYNET</h1>
              </div>
            </div>
          </div>

          <div class="update-badge mt-1 justify-self-end rounded-[1.55rem] px-6 py-4 text-white">
            <div class="flex items-start gap-4">
              <div class="rounded-xl bg-white/12 p-3 ring-1 ring-white/18">
                <CalendarDays :size="20" />
              </div>
              <div>
                <p class="text-[1rem] font-semibold text-white">Update Terakhir</p>
                <div class="mt-2 flex flex-wrap items-center gap-3 text-[0.98rem] font-bold text-white/95 md:text-[1.12rem]">
                  <span>{{ latestDateLabel }}</span>
                  <span class="text-white/55">|</span>
                  <span class="inline-flex items-center gap-2">
                    <Clock3 :size="15" />
                    {{ latestTimeLabel }} WIB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="relative mt-3 md:mt-4">
          <TeamRankingBoard
            :team-rankings="teamRankings"
            :non-ranking-teams="nonRankingTeams"
            :total-target="TOTAL_TARGET"
            :total-reward="TOTAL_REWARD"
          />
        </div>
      </div>
    </section>

    <section>
      <div
        v-if="fetchLogsFailed"
        class="mb-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-100"
      >
        Data server belum berhasil dimuat. Dashboard sedang tidak membaca `/api/logs`, jadi cek backend `localhost:3000` atau proxy Vite kamu.
      </div>

      <SummaryCards
        :target="TOTAL_TARGET"
        :target-odp="TARGET_ODP"
        :target-odc="TARGET_ODC"
        :installed="totalInstalled"
        :installed-odp="totalOdp"
        :installed-odc="totalOdc"
        :progress="progressPercent"
        :days-remaining="remainingDays"
        :remaining-odp="remainingOdp"
        :remaining-odc="remainingOdc"
      />
    </section>

    <div class="grid grid-cols-1 gap-8 xl:grid-cols-3 items-stretch">
      <div class="h-full xl:col-span-1">
        <TeamRekapTable
          :team-totals="teamTotals"
          :target-odp="TARGET_ODP"
          :target-odc="TARGET_ODC"
        />
      </div>

      <div class="h-full xl:col-span-2">
        <ProgressCharts
          :labels="chartData.labels"
          :odp-data="chartData.odpData"
          :odc-data="chartData.odcData"
          :target-odp="TARGET_ODP"
          :target-odc="TARGET_ODC"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.showcase-frame {
  min-height: auto;
  background:
    radial-gradient(circle at 16% 22%, rgba(37, 99, 235, 0.18), transparent 16%),
    radial-gradient(circle at 82% 60%, rgba(16, 185, 129, 0.08), transparent 18%),
    linear-gradient(180deg, #030a17 0%, #071224 34%, #020712 100%);
}

.showcase-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 88% 82%, rgba(30, 64, 175, 0.18), rgba(255, 255, 255, 0) 16%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0) 22%, rgba(59, 130, 246, 0.05) 58%, rgba(255, 255, 255, 0) 82%);
  pointer-events: none;
}

.showcase-top {
  background:
    linear-gradient(135deg, #020918 0%, #0d2e92 28%, #1639c8 42%, #09152f 100%);
  box-shadow:
    inset 0 -4px 0 rgba(8, 18, 84, 0.75),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 76.1% 100%, 72.8% 72.5%, 40.1% 72.5%, 36.9% 100%, 0 100%);
}

.showcase-top::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 18%, rgba(110, 231, 255, 0.22), transparent 18%),
    linear-gradient(90deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0) 22%, rgba(96, 165, 250, 0.2) 56%, rgba(255, 255, 255, 0) 84%);
}

.showcase-topline {
  position: absolute;
  top: 0.5rem;
  z-index: 2;
  height: 0.18rem;
  border-radius: 9999px;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.15), rgba(96, 165, 250, 1), rgba(255, 255, 255, 0.45));
  box-shadow:
    0 0 14px rgba(59, 130, 246, 0.55),
    0 0 24px rgba(96, 165, 250, 0.26);
}

.showcase-topline--left {
  left: 1.1rem;
  width: 67.5%;
}

.showcase-topline--right {
  right: 1.1rem;
  width: 28.2%;
}

.showcase-cutout {
  position: absolute;
  right: 10.55%;
  top: 0.72rem;
  z-index: 1;
  height: 10.55rem;
  width: 39.7rem;
  border-radius: 2.25rem 2.25rem 0 2.4rem;
  background:
    linear-gradient(180deg, rgba(11, 23, 48, 0.98), rgba(8, 17, 35, 0.98));
  clip-path: polygon(13.6% 0, 100% 0, 100% 100%, 0 100%, 10.6% 18.2%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    0 8px 0 rgba(4, 18, 65, 0.92),
    0 22px 28px -28px rgba(15, 23, 42, 0.42);
}

.showcase-cutout::before {
  content: '';
  position: absolute;
  inset: 0.55rem 0.8rem 0.8rem 1.25rem;
  border-radius: 1.85rem 1.85rem 0 1.95rem;
  border: 1px solid rgba(84, 126, 210, 0.45);
}

.showcase-cutout::after {
  content: '';
  position: absolute;
  inset: 0.8rem 1rem auto 1.5rem;
  height: 0.7rem;
  border-radius: 9999px;
  background: linear-gradient(180deg, rgba(130, 167, 255, 0.2), rgba(255, 255, 255, 0));
}

.showcase-surface {
  position: absolute;
  inset: 9.72rem 0 0 0;
  background:
    radial-gradient(circle at 8% 8%, rgba(37, 99, 235, 0.18), transparent 10%),
    radial-gradient(circle at 28% 14%, rgba(192, 74, 255, 0.12), transparent 8%),
    linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(6, 18, 43, 0.98) 14%, #020712 100%);
}

.showcase-surface::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 11% 18%, rgba(59, 130, 246, 0.18), rgba(255, 255, 255, 0) 12%),
    linear-gradient(115deg, rgba(255, 255, 255, 0) 0 62%, rgba(37, 99, 235, 0.1) 62.2%, rgba(255, 255, 255, 0) 63.4%),
    linear-gradient(152deg, rgba(255, 255, 255, 0) 0 74%, rgba(147, 51, 234, 0.08) 74.2%, rgba(255, 255, 255, 0) 75.5%);
  pointer-events: none;
}

.showcase-surface::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 5% 12%, rgba(53, 98, 212, 0.28), transparent 4%),
    radial-gradient(circle at 9% 6%, rgba(59, 130, 246, 0.22), transparent 2.8%),
    radial-gradient(circle at 93% 84%, rgba(26, 54, 93, 0.3), transparent 4.5%);
  opacity: 0.9;
  pointer-events: none;
}

.brand-mark {
  position: relative;
  flex: none;
  height: 7.15rem;
  width: 7.15rem;
}

.brand-title-wrap {
  position: relative;
  display: inline-block;
  padding-right: 0.35rem;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 7rem;
}

.brand-copy__eyebrow {
  line-height: 1.1;
  text-shadow: 0 2px 12px rgba(8, 20, 82, 0.24);
}

.brand-title {
  font-family: "Arial Black", Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
  letter-spacing: 0.025em;
  color: transparent;
  background:
    linear-gradient(180deg, #7ce7ff 0%, #45cfff 18%, #2380ff 54%, #7e36ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow:
    0 0 18px rgba(96, 165, 250, 0.16),
    0 6px 12px rgba(7, 21, 84, 0.16);
  transform: skewX(-11deg) scaleX(0.88);
  transform-origin: left center;
  filter: drop-shadow(0 7px 10px rgba(5, 20, 90, 0.22));
}

.update-badge {
  position: relative;
  min-width: 22.8rem;
  background: linear-gradient(180deg, #10257f 0%, #0d1f67 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 22px 36px -28px rgba(15, 23, 42, 0.92);
  border: 1px solid rgba(82, 129, 255, 0.2);
}

.update-badge::before {
  content: '';
  position: absolute;
  inset: 0.5rem;
  border-radius: 1.15rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.update-badge::after {
  content: '';
  position: absolute;
  left: 1rem;
  right: 1rem;
  top: 0.55rem;
  height: 0.75rem;
  border-radius: 9999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0));
}

@media (max-width: 1023px) {
  .showcase-frame {
    min-height: auto;
  }

  .showcase-cutout {
    right: 0.5rem;
    width: 20rem;
  }
}

@media (max-width: 767px) {
  .showcase-top {
    height: 13rem;
  }

  .showcase-cutout {
    display: none;
  }

  .showcase-surface {
    inset: 12rem 0 0 0;
  }

  .showcase-topline--left {
    width: 55%;
  }

  .showcase-topline--right {
    width: 20%;
  }

  .brand-mark {
    height: 6.3rem;
    width: 6.3rem;
  }

  .brand-copy {
    min-height: auto;
  }

  .update-badge {
    min-width: 100%;
  }
}
</style>
