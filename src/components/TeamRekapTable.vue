<script setup>
import { computed } from 'vue'
import { BarChart3, RadioTower, ShieldEllipsis, Users } from 'lucide-vue-next'

const props = defineProps({
  teamTotals: { type: Array, required: true },
  targetOdp: { type: Number, required: true },
  targetOdc: { type: Number, required: true }
})

const formatPercent = (value, target) => {
  if (!target) return '0%'
  return `${((value / target) * 100).toFixed(1)}%`
}

const percentNumber = (value, target) => {
  if (!target) return 0
  return Math.min((value / target) * 100, 100)
}

const grandTotalOdp = computed(() => props.teamTotals.reduce((s, t) => s + t.odp, 0))
const grandTotalOdc = computed(() => props.teamTotals.reduce((s, t) => s + t.odc, 0))

const enrichedTeams = computed(() =>
  props.teamTotals.map((team, index) => ({
    ...team,
    rank: index + 1,
    totalInstalled: team.odp + team.odc
  }))
)
</script>

<template>
  <article class="team-panel">
    <div class="team-panel__header">
      <div>
        <div class="team-chip">
          <Users :size="14" />
          Ringkasan Tim
        </div>
        <h3 class="team-panel__title">Rekap ODP & ODC Per Tim</h3>
        <p class="team-panel__desc">Pantau capaian setiap tim dengan progress yang lebih mudah dibaca.</p>
      </div>
      <div class="team-icon-badge">
        <BarChart3 :size="20" />
      </div>
    </div>

    <div class="team-stats">
      <div class="team-stat-box">
        <p class="team-stat-box__label">Total Tim</p>
        <p class="team-stat-box__value">{{ teamTotals.length }}</p>
        <p class="team-stat-box__meta">Tim aktif</p>
      </div>

      <div class="team-stat-box team-stat-box--blue">
        <div class="team-stat-box__top">
          <p class="team-stat-box__label">Total ODP</p>
          <span class="team-stat-pill">{{ formatPercent(grandTotalOdp, targetOdp) }}</span>
        </div>
        <p class="team-stat-box__value">{{ grandTotalOdp }}</p>
        <p class="team-stat-box__meta">dari {{ targetOdp }}</p>
        <div class="team-bar"><div class="team-bar__fill team-bar__fill--blue" :style="{ width: `${percentNumber(grandTotalOdp, targetOdp)}%` }"></div></div>
      </div>

      <div class="team-stat-box team-stat-box--violet">
        <div class="team-stat-box__top">
          <p class="team-stat-box__label">Total ODC</p>
          <span class="team-stat-pill team-stat-pill--violet">{{ formatPercent(grandTotalOdc, targetOdc) }}</span>
        </div>
        <p class="team-stat-box__value">{{ grandTotalOdc }}</p>
        <p class="team-stat-box__meta">dari {{ targetOdc }}</p>
        <div class="team-bar"><div class="team-bar__fill team-bar__fill--violet" :style="{ width: `${percentNumber(grandTotalOdc, targetOdc)}%` }"></div></div>
      </div>
    </div>

    <div class="team-list">
      <article v-for="team in enrichedTeams" :key="team.id" class="team-row">
        <div class="team-row__main">
          <div class="team-badge">T{{ team.rank }}</div>
          <div>
            <h4 class="team-row__title">{{ team.name }}</h4>
            <p class="team-row__subtitle">{{ team.pic }}</p>
          </div>
        </div>

        <div class="team-row__metrics">
          <div class="team-mini-progress team-mini-progress--blue">
            <div class="team-mini-progress__head">
              <span><RadioTower :size="14" /> ODP</span>
              <strong>{{ team.odp }}</strong>
            </div>
            <div class="team-bar"><div class="team-bar__fill team-bar__fill--blue" :style="{ width: `${percentNumber(team.odp, targetOdp)}%` }"></div></div>
          </div>

          <div class="team-mini-progress team-mini-progress--violet">
            <div class="team-mini-progress__head">
              <span><ShieldEllipsis :size="14" /> ODC</span>
              <strong>{{ team.odc }}</strong>
            </div>
            <div class="team-bar"><div class="team-bar__fill team-bar__fill--violet" :style="{ width: `${percentNumber(team.odc, targetOdc)}%` }"></div></div>
          </div>
        </div>

        <div class="team-total-box">
          <p>Total</p>
          <strong>{{ team.totalInstalled }}</strong>
        </div>
      </article>
    </div>
  </article>
</template>

<style scoped>
.team-panel {
  position: relative;
  height: 43rem;
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

.team-panel__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.team-chip,
.team-icon-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.95rem;
  border: 1px solid rgba(79, 121, 198, 0.28);
  background: rgba(9, 28, 63, 0.72);
  color: #bdd7ff;
}

.team-chip {
  padding: 0.5rem 0.8rem;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.team-icon-badge {
  width: 3rem;
  height: 3rem;
  justify-content: center;
}

.team-panel__title {
  margin-top: 0.8rem;
  font-size: 1.4rem;
  font-weight: 800;
  color: #f8fbff;
}

.team-panel__desc {
  margin-top: 0.35rem;
  font-size: 0.85rem;
  color: rgba(207, 220, 247, 0.8);
  line-height: 1.45;
}

.team-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.65rem;
  margin-top: 1rem;
}

.team-stat-box {
  border-radius: 1rem;
  border: 1px solid rgba(75, 111, 174, 0.3);
  background: rgba(8, 23, 55, 0.72);
  padding: 0.78rem;
}

.team-stat-box--blue {
  background: rgba(7, 29, 67, 0.78);
}

.team-stat-box--violet {
  background: rgba(27, 14, 68, 0.72);
}

.team-stat-box__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.team-stat-box__label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #c6d9ff;
}

.team-stat-box__value {
  margin-top: 0.4rem;
  font-size: 2.35rem;
  font-weight: 900;
  line-height: 1;
  color: #ffffff;
}

.team-stat-box__meta {
  margin-top: 0.35rem;
  color: rgba(222, 232, 253, 0.74);
}

.team-stat-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  background: rgba(12, 61, 140, 0.82);
  font-size: 0.72rem;
  font-weight: 800;
  color: #dcebff;
}

.team-stat-pill--violet {
  background: rgba(91, 48, 179, 0.9);
  color: #efe1ff;
}

.team-list {
  display: grid;
  gap: 0.65rem;
  margin-top: 1rem;
  max-height: 25.8rem;
  overflow-y: auto;
  padding-right: 0.2rem;
}

.team-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr) auto;
  gap: 0.9rem;
  align-items: center;
  border-radius: 1rem;
  border: 1px solid rgba(65, 104, 170, 0.26);
  background: rgba(6, 20, 50, 0.72);
  padding: 0.78rem;
}

.team-row__main {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.team-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(37, 99, 235, 0.9), rgba(22, 49, 122, 0.9));
  border: 1px solid rgba(117, 164, 255, 0.25);
  font-size: 1rem;
  font-weight: 900;
  color: #f3f7ff;
}

.team-row__title {
  font-size: 1rem;
  font-weight: 800;
  color: #ffffff;
}

.team-row__subtitle {
  margin-top: 0.2rem;
  font-size: 0.8rem;
  color: rgba(206, 221, 249, 0.76);
}

.team-row__metrics {
  display: grid;
  gap: 0.65rem;
}

.team-mini-progress {
  border-radius: 0.95rem;
  border: 1px solid rgba(69, 104, 162, 0.24);
  background: rgba(8, 22, 51, 0.74);
  padding: 0.58rem 0.72rem;
}

.team-mini-progress--blue {
  background: rgba(8, 29, 68, 0.72);
}

.team-mini-progress--violet {
  background: rgba(25, 12, 66, 0.72);
}

.team-mini-progress__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 0.55rem;
}

.team-mini-progress__head span {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #c6d9ff;
}

.team-mini-progress__head strong,
.team-total-box strong {
  font-size: 1.1rem;
  font-weight: 800;
  color: #ffffff;
}

.team-total-box {
  min-width: 4.3rem;
  border-radius: 0.95rem;
  border: 1px solid rgba(57, 103, 171, 0.24);
  background: rgba(7, 28, 67, 0.72);
  padding: 0.6rem 0.75rem;
  text-align: right;
}

.team-total-box p {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(203, 219, 248, 0.76);
}

.team-total-box strong {
  display: block;
  margin-top: 0.3rem;
  font-size: 1.55rem;
  color: #4aa6ff;
}

.team-bar {
  height: 0.7rem;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(135, 164, 219, 0.16);
}

.team-bar__fill {
  height: 100%;
  border-radius: inherit;
}

.team-bar__fill--blue {
  background: linear-gradient(90deg, #2b6cff 0%, #34b6ff 100%);
}

.team-bar__fill--violet {
  background: linear-gradient(90deg, #a147ff 0%, #df61ff 100%);
}

@media (max-width: 1100px) {
  .team-panel {
    height: auto;
  }

  .team-list {
    max-height: none;
    overflow: visible;
  }

  .team-row {
    grid-template-columns: 1fr;
  }

  .team-total-box {
    text-align: left;
  }
}

@media (max-width: 767px) {
  .team-stats {
    grid-template-columns: 1fr;
  }

  .team-panel__title {
    font-size: 1.55rem;
  }
}
</style>
