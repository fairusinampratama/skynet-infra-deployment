<script setup>
import { computed } from 'vue'
import { CalendarDays, Clock3 } from 'lucide-vue-next'
import { useDashboard } from '../composables/useDashboard'
import SummaryCards from '../components/SummaryCards.vue'
import ProgressCharts from '../components/ProgressCharts.vue'
import TeamRekapTable from '../components/TeamRekapTable.vue'
import TeamRankingBoard from '../components/TeamRankingBoard.vue'

const {
  TARGET_ODP,
  TARGET_ODC,
  TOTAL_TARGET,
  totalOdp,
  totalOdc,
  totalInstalled,
  progressPercent,
  logs,
  remainingDays,
  remainingOdp,
  remainingOdc,
  chartData,
  teamTotals,
  teamRankings
} = useDashboard()

const latestLog = computed(() => logs.value[logs.value.length - 1] ?? null)

const latestDateLabel = computed(() => {
  if (!latestLog.value?.date) return 'Belum ada data'

  const date = new Date(latestLog.value.date)

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
})

const latestTimeLabel = computed(() => {
  if (!latestLog.value?.updatedAt) return 'Menunggu update'

  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(latestLog.value.updatedAt))
})
</script>

<template>
  <div class="space-y-10 pb-6">
    <section class="showcase-frame relative overflow-hidden rounded-[2.3rem] border border-blue-100/80 bg-white shadow-[0_28px_80px_-38px_rgba(15,23,42,0.28)]">
      <div class="showcase-top absolute inset-x-0 top-0 h-[11.75rem] md:h-[12.2rem]" />
      <div class="showcase-topline showcase-topline--left" />
      <div class="showcase-topline showcase-topline--right" />
      <div class="showcase-cutout" />
      <div class="showcase-surface" />

      <div class="relative z-10 px-5 pb-8 pt-5 md:px-8 md:pt-6">
        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div class="flex items-start gap-5 text-white">
            <div class="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 160 160" class="brand-mark__svg" role="presentation">
                <defs>
                  <linearGradient id="outerGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#60e7ff" />
                    <stop offset="48%" stop-color="#2b68ff" />
                    <stop offset="100%" stop-color="#9b38ff" />
                  </linearGradient>
                  <linearGradient id="innerCore" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#0f1d77" />
                    <stop offset="52%" stop-color="#1d47d8" />
                    <stop offset="100%" stop-color="#11184f" />
                  </linearGradient>
                  <linearGradient id="cubeFace" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff" />
                    <stop offset="100%" stop-color="#dbeafe" />
                  </linearGradient>
                  <filter id="logoShadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#1d4ed8" flood-opacity="0.35" />
                  </filter>
                </defs>

                <g filter="url(#logoShadow)">
                  <polygon points="80,6 137,39 137,104 80,137 23,104 23,39" fill="url(#outerGlow)" />
                  <polygon points="80,20 124,46 124,97 80,123 36,97 36,46" fill="#0f1f77" opacity="0.96" />
                  <polygon points="80,33 112,52 112,90 80,109 48,90 48,52" fill="url(#innerCore)" />
                  <polygon points="80,26 118,48 118,94 80,116 42,94 42,48" fill="none" stroke="#9ae6ff" stroke-opacity="0.7" stroke-width="2.5" />
                  <polygon points="80,46 98,56 98,76 80,86 62,76 62,56" fill="url(#cubeFace)" />
                  <polygon points="80,46 96,55 80,64 64,55" fill="#ffffff" />
                  <polygon points="64,55 80,64 80,82 64,73" fill="#dbeafe" />
                  <polygon points="96,55 80,64 80,82 96,73" fill="#bfdbfe" />
                  <polygon points="80,14 126,41 126,102 80,129 34,102 34,41" fill="none" stroke="#ffffff" stroke-opacity="0.32" stroke-width="3" />
                  <polygon points="80,39 106,54 106,88 80,103 54,88 54,54" fill="none" stroke="#ffffff" stroke-opacity="0.22" stroke-width="2" />
                </g>
              </svg>
            </div>

            <div class="brand-copy pt-2">
              <p class="brand-copy__eyebrow text-[1.05rem] font-black uppercase tracking-[0.08em] text-white md:text-[1.25rem]">
                PEMBANGUNAN ODP & ODC
              </p>
              <div class="brand-title-wrap mt-1">
                <h1 class="brand-title text-[3rem] font-black leading-none md:text-[4.35rem]">SKYNET</h1>
                <div class="brand-title__sheen">SKYNET</div>
              </div>
            </div>
          </div>

          <div class="update-badge mt-1 justify-self-end rounded-[1.6rem] px-6 py-5 text-white">
            <div class="flex items-start gap-4">
              <div class="rounded-xl bg-white/12 p-3 ring-1 ring-white/18">
                <CalendarDays :size="22" />
              </div>
              <div>
                <p class="text-[1.05rem] font-semibold text-white">Update Terakhir</p>
                <div class="mt-2 flex flex-wrap items-center gap-3 text-[1rem] font-bold text-white/95 md:text-[1.2rem]">
                  <span>{{ latestDateLabel }}</span>
                  <span class="text-white/55">|</span>
                  <span class="inline-flex items-center gap-2">
                    <Clock3 :size="16" />
                    {{ latestTimeLabel }} WIB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="relative mt-6 md:mt-8">
          <TeamRankingBoard :team-rankings="teamRankings" />
        </div>
      </div>
    </section>

    <section>
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
  min-height: 60rem;
  background:
    radial-gradient(circle at 16% 26%, rgba(59, 130, 246, 0.08), transparent 18%),
    radial-gradient(circle at 82% 60%, rgba(191, 219, 254, 0.25), transparent 22%),
    linear-gradient(180deg, #fcfeff 0%, #f5f9ff 36%, #eff5ff 100%);
}

.showcase-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 88% 82%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0) 16%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.26), rgba(255, 255, 255, 0) 22%, rgba(59, 130, 246, 0.03) 58%, rgba(255, 255, 255, 0) 82%);
  pointer-events: none;
}

.showcase-top {
  background:
    linear-gradient(135deg, #08144c 0%, #1736b8 36%, #08154a 100%);
}

.showcase-top::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 18%, rgba(110, 231, 255, 0.18), transparent 18%),
    linear-gradient(90deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0) 22%, rgba(96, 165, 250, 0.2) 56%, rgba(255, 255, 255, 0) 84%);
}

.showcase-topline {
  position: absolute;
  top: 0.55rem;
  z-index: 2;
  height: 0.18rem;
  border-radius: 9999px;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.15), rgba(96, 165, 250, 1), rgba(255, 255, 255, 0.45));
  box-shadow:
    0 0 14px rgba(59, 130, 246, 0.55),
    0 0 24px rgba(96, 165, 250, 0.26);
}

.showcase-topline--left {
  left: 1rem;
  width: 65%;
}

.showcase-topline--right {
  right: 1rem;
  width: 28%;
}

.showcase-cutout {
  position: absolute;
  right: 12%;
  top: 1.15rem;
  z-index: 1;
  height: 11.5rem;
  width: 38.5rem;
  border-radius: 2.5rem 2.5rem 0 2.6rem;
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
  clip-path: polygon(12% 0, 100% 0, 100% 100%, 0 100%, 11% 18%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    0 8px 0 rgba(13, 30, 112, 0.75);
}

.showcase-cutout::before {
  content: '';
  position: absolute;
  inset: 0.6rem 0.85rem 0.9rem 1.35rem;
  border-radius: 2rem 2rem 0 2.1rem;
  border: 1px solid rgba(191, 219, 254, 0.65);
}

.showcase-cutout::after {
  content: '';
  position: absolute;
  inset: 0.8rem 1rem auto 1.5rem;
  height: 0.7rem;
  border-radius: 9999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0));
}

.showcase-surface {
  position: absolute;
  inset: 10.7rem 0 0 0;
  background:
    radial-gradient(circle at 8% 8%, rgba(191, 219, 254, 0.38), transparent 10%),
    radial-gradient(circle at 28% 14%, rgba(191, 219, 254, 0.22), transparent 8%),
    linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(247, 250, 255, 0.96) 14%, #f1f6ff 100%);
}

.showcase-surface::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(115deg, rgba(255, 255, 255, 0) 0 62%, rgba(191, 219, 254, 0.14) 62.2%, rgba(255, 255, 255, 0) 63.4%),
    linear-gradient(152deg, rgba(255, 255, 255, 0) 0 74%, rgba(191, 219, 254, 0.1) 74.2%, rgba(255, 255, 255, 0) 75.5%);
  pointer-events: none;
}

.brand-mark {
  position: relative;
  flex: none;
  height: 8.8rem;
  width: 8.8rem;
}

.brand-mark__svg {
  height: 100%;
  width: 100%;
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
  min-height: 8rem;
}

.brand-copy__eyebrow {
  line-height: 1.1;
  text-shadow: 0 2px 12px rgba(8, 20, 82, 0.24);
}

.brand-title {
  letter-spacing: 0.035em;
  color: transparent;
  background:
    linear-gradient(180deg, #8fe8ff 0%, #58c7ff 18%, #2e84ff 54%, #7132ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow:
    0 0 18px rgba(96, 165, 250, 0.16),
    0 6px 12px rgba(7, 21, 84, 0.16);
  transform: skewX(-7deg) scaleX(0.98);
  transform-origin: left center;
  filter: drop-shadow(0 7px 10px rgba(5, 20, 90, 0.22));
}

.brand-title__sheen {
  position: absolute;
  inset: 0;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  transform: skewX(-7deg) scaleX(0.98);
  color: transparent;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.18) 24%, rgba(255, 255, 255, 0) 48%);
  -webkit-background-clip: text;
  background-clip: text;
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: 0.82;
}

.update-badge {
  position: relative;
  min-width: 22rem;
  background: linear-gradient(180deg, #10257f 0%, #0f236f 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 22px 36px -28px rgba(15, 23, 42, 0.92);
}

.update-badge::before {
  content: '';
  position: absolute;
  inset: 0.55rem;
  border-radius: 1.2rem;
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
