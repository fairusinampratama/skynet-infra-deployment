<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { CalendarDays, Clock3, MapPinned } from 'lucide-vue-next'
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
  activeArea,
  selectedAreaId,
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

const route = useRoute()
const TOTAL_REWARD = 20000000
const REWARD_TARGET = 411

const latestLog = computed(() => logs.value[logs.value.length - 1] ?? null)
const nonRankingTeams = computed(() => teamTotals.value.filter((team) => team.rankingEligible === false))
const hasTeamProgress = computed(() => activeArea.value.id === 'randuagung')
const activeAreaTarget = computed(() => TARGET_ODP.value + TARGET_ODC.value)
const activeAreaProgressWidth = computed(() => Math.min(Math.max(progressPercent.value, 0), 100))
const activeAreaTargetLabel = computed(() =>
  activeArea.value.hasKnownTarget ? `${activeAreaTarget.value} titik` : 'Belum diisi'
)
const activeAreaSplitLabel = computed(() =>
  activeArea.value.hasKnownTarget ? `ODP ${TARGET_ODP.value} | ODC ${TARGET_ODC.value}` : 'Target ODP & ODC menyusul'
)

watch(
  () => route.meta.areaId,
  (areaId) => {
    selectedAreaId.value = areaId || 'randuagung'
  },
  { immediate: true }
)

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

        <div class="area-console mt-4">
          <div class="area-console__head">
            <div>
              <div class="area-chip">
                <MapPinned :size="15" />
                Area Aktif
              </div>
              <h2 class="area-console__title">{{ activeArea.name }}</h2>
            </div>
            <p class="area-console__note">Pilih area dari menu atas untuk berpindah halaman dashboard.</p>
          </div>

          <article class="area-focus-card">
            <div>
              <span class="area-focus-card__status">{{ activeArea.hasKnownTarget ? 'Target aktif' : 'Menunggu target' }}</span>
              <strong>{{ activeArea.name }}</strong>
              <span class="area-focus-card__target">{{ activeAreaTargetLabel }}</span>
              <span class="area-focus-card__meta">{{ activeAreaSplitLabel }}</span>
            </div>

            <div class="area-focus-card__side">
              <span>Terpasang</span>
              <strong>{{ totalInstalled }}</strong>
              <small>{{ progressPercent }}%</small>
            </div>

            <span class="area-focus-card__progress">
              <span :style="{ width: `${activeAreaProgressWidth}%` }"></span>
            </span>
          </article>
        </div>

        <div class="relative mt-3 md:mt-4">
          <TeamRankingBoard
            v-if="hasTeamProgress"
            :team-rankings="teamRankings"
            :non-ranking-teams="nonRankingTeams"
            :total-target="TOTAL_TARGET"
            :reward-target="REWARD_TARGET"
            :total-reward="TOTAL_REWARD"
          />
          <div v-else class="area-empty-state">
            <div class="area-empty-state__icon">
              <MapPinned :size="28" />
            </div>
            <div>
              <p>{{ activeArea.name }}</p>
              <h3>Area sudah disiapkan di dashboard.</h3>
              <span>Data progres tim, grafik harian, dan ranking akan tampil setelah input harian area ini mulai diisi.</span>
            </div>
          </div>
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
        :has-known-target="activeArea.hasKnownTarget"
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

.area-console {
  position: relative;
  border-radius: 1.35rem;
  border: 1px solid rgba(92, 131, 207, 0.28);
  background: rgba(5, 17, 43, 0.76);
  padding: 1rem;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 18px 34px -30px rgba(2, 6, 23, 0.9);
}

.area-console__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.area-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border-radius: 0.85rem;
  border: 1px solid rgba(96, 165, 250, 0.26);
  background: rgba(8, 35, 80, 0.72);
  padding: 0.44rem 0.7rem;
  color: #c8dcff;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.area-console__title {
  margin-top: 0.55rem;
  color: #ffffff;
  font-size: 1.45rem;
  font-weight: 900;
  line-height: 1;
}

.area-console__note {
  max-width: 22rem;
  color: rgba(211, 226, 255, 0.78);
  font-size: 0.85rem;
  font-weight: 700;
  line-height: 1.45;
  text-align: right;
}

.area-focus-card {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1.2rem;
  margin-top: 0.9rem;
  border-radius: 1rem;
  border: 1px solid rgba(74, 163, 255, 0.66);
  background:
    radial-gradient(circle at top left, rgba(47, 140, 255, 0.22), transparent 32%),
    linear-gradient(180deg, rgba(9, 35, 80, 0.92), rgba(7, 24, 57, 0.9));
  padding: 0.88rem;
  color: #ffffff;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 18px 34px -30px rgba(14, 165, 233, 0.64);
}

.area-focus-card__side {
  min-width: 9rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(125, 211, 252, 0.2);
  background: rgba(6, 20, 50, 0.68);
  padding: 0.74rem 0.85rem;
  text-align: right;
}

.area-focus-card__status,
.area-focus-card__meta,
.area-focus-card__side span {
  display: block;
  color: rgba(211, 226, 255, 0.78);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.area-focus-card strong {
  display: block;
  margin-top: 0.45rem;
  font-size: 1.05rem;
  font-weight: 900;
}

.area-focus-card__target {
  display: block;
  margin-top: 0.6rem;
  color: #f7fbff;
  font-size: 1.35rem;
  font-weight: 900;
  line-height: 1;
}

.area-focus-card__meta {
  display: block;
  margin-top: 0.5rem;
}

.area-focus-card__side strong {
  color: #67e8f9;
  font-size: 2rem;
  line-height: 1;
}

.area-focus-card__side small {
  display: block;
  margin-top: 0.35rem;
  color: rgba(226, 244, 255, 0.82);
  font-size: 0.8rem;
  font-weight: 900;
}

.area-focus-card__progress {
  grid-column: 1 / -1;
  height: 0.45rem;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(137, 167, 221, 0.18);
}

.area-focus-card__progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #32b1ff 0%, #49f2ae 100%);
}

.area-empty-state {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 18rem;
  border-radius: 1.35rem;
  border: 1px solid rgba(83, 130, 214, 0.3);
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.18), transparent 28%),
    linear-gradient(180deg, rgba(5, 17, 43, 0.96), rgba(3, 12, 32, 0.96));
  padding: 1.4rem;
  color: #ffffff;
}

.area-empty-state__icon {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 4.2rem;
  height: 4.2rem;
  border-radius: 1.2rem;
  border: 1px solid rgba(96, 165, 250, 0.28);
  background: rgba(7, 29, 68, 0.72);
  color: #bdd7ff;
}

.area-empty-state p {
  color: #86d8ff;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.area-empty-state h3 {
  margin-top: 0.35rem;
  font-size: 1.65rem;
  font-weight: 900;
}

.area-empty-state span {
  display: block;
  margin-top: 0.4rem;
  color: rgba(219, 231, 255, 0.78);
  line-height: 1.5;
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

  .area-console__head,
  .area-empty-state {
    flex-direction: column;
  }

  .area-console__note {
    max-width: none;
    text-align: left;
  }

  .area-focus-card {
    grid-template-columns: 1fr;
  }

  .area-focus-card__side {
    text-align: left;
  }
}
</style>
