<script setup>
import { computed } from 'vue'

const props = defineProps({
  teamRankings: {
    type: Array,
    required: true
  }
})

const rankMap = computed(() => {
  const map = new Map()
  props.teamRankings.forEach((team) => map.set(team.rank, team))
  return map
})

const secondPlace = computed(() => rankMap.value.get(2) ?? null)
const firstPlace = computed(() => rankMap.value.get(1) ?? null)
const thirdPlace = computed(() => rankMap.value.get(3) ?? null)
const fourthPlace = computed(() => rankMap.value.get(4) ?? null)

const leaderScore = computed(() => Math.max(firstPlace.value?.totalInstalled ?? 1, 1))
const progressWidth = (value) => `${Math.max((value / leaderScore.value) * 100, 12)}%`
const barHeight = (value, step, rank) => `${22 + step * 16 + Math.max(value, 1) * (rank === 1 ? 1.8 : 1.35)}px`
</script>

<template>
  <div class="rank-showcase">
    <div class="podium-grid">
      <article v-if="secondPlace" class="podium-card podium-card--silver">
        <div class="podium-card__glow" />
        <div class="podium-card__shine" />
        <div class="podium-head">
          <div class="medal-ribbon medal-ribbon--silver">
            <span class="medal-ribbon__icon">
              <svg viewBox="0 0 64 64" class="trophy-mark trophy-mark--silver" aria-hidden="true">
                <path d="M20 10h24v8c0 7.7-5.2 14.2-12 16-6.8-1.8-12-8.3-12-16z" />
                <path d="M17 14H8c0 9.2 5.5 15 13 16" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                <path d="M47 14h9c0 9.2-5.5 15-13 16" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                <path d="M26 36h12v6H26z" />
                <path d="M22 44h20v6H22z" />
              </svg>
            </span>
            <span>Juara 2</span>
          </div>
          <div class="rank-bubble rank-bubble--silver">#2</div>
        </div>

        <div class="podium-body">
          <p class="team-label">{{ secondPlace.name }}</p>
          <h3 class="team-name">{{ secondPlace.pic }}</h3>

          <div class="stat-layout">
            <div>
              <p class="metric-label">Total Instalasi</p>
              <p class="metric-value metric-value--silver">{{ secondPlace.totalInstalled }}</p>
            </div>
            <div class="chart-bars chart-bars--silver">
              <span v-for="step in 4" :key="`silver-${step}`" class="chart-bars__bar chart-bars__bar--silver" :style="{ height: barHeight(secondPlace.totalInstalled, step, 2) }" />
            </div>
          </div>

          <div class="progress-rail">
            <div class="progress-fill progress-fill--silver" :style="{ width: progressWidth(secondPlace.totalInstalled) }" />
          </div>

          <div class="split-stats">
            <div class="split-stats__item">
              <p class="split-stats__label split-stats__label--odp">ODP</p>
              <p class="split-stats__value">{{ secondPlace.odp }}</p>
            </div>
            <div class="split-stats__item">
              <p class="split-stats__label split-stats__label--odc">ODC</p>
              <p class="split-stats__value">{{ secondPlace.odc }}</p>
            </div>
          </div>
        </div>

        <div class="podium-footer podium-footer--silver">Juara 2</div>
      </article>

      <article v-if="firstPlace" class="podium-card podium-card--gold podium-card--main">
        <div class="podium-card__glow" />
        <div class="podium-card__shine" />
        <div class="podium-head">
          <div class="medal-ribbon medal-ribbon--gold">
            <span class="medal-ribbon__icon">
              <svg viewBox="0 0 64 64" class="trophy-mark trophy-mark--gold" aria-hidden="true">
                <path d="M20 10h24v8c0 7.7-5.2 14.2-12 16-6.8-1.8-12-8.3-12-16z" />
                <path d="M17 14H8c0 9.2 5.5 15 13 16" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                <path d="M47 14h9c0 9.2-5.5 15-13 16" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                <path d="M26 36h12v6H26z" />
                <path d="M22 44h20v6H22z" />
              </svg>
            </span>
            <span>Juara 1</span>
          </div>
          <div class="rank-bubble rank-bubble--gold">#1</div>
        </div>

        <div class="podium-body">
          <p class="team-label">{{ firstPlace.name }}</p>
          <h3 class="team-name team-name--main">{{ firstPlace.pic }}</h3>

          <div class="stat-layout stat-layout--main">
            <div>
              <p class="metric-label">Total Instalasi</p>
              <p class="metric-value metric-value--gold">{{ firstPlace.totalInstalled }}</p>
            </div>
            <div class="chart-bars chart-bars--gold">
              <span v-for="step in 4" :key="`gold-${step}`" class="chart-bars__bar chart-bars__bar--gold" :style="{ height: barHeight(firstPlace.totalInstalled, step, 1) }" />
            </div>
          </div>

          <div class="progress-rail">
            <div class="progress-fill progress-fill--gold" :style="{ width: progressWidth(firstPlace.totalInstalled) }" />
          </div>

          <div class="split-stats">
            <div class="split-stats__item">
              <p class="split-stats__label split-stats__label--odp">ODP</p>
              <p class="split-stats__value">{{ firstPlace.odp }}</p>
            </div>
            <div class="split-stats__item">
              <p class="split-stats__label split-stats__label--odc">ODC</p>
              <p class="split-stats__value">{{ firstPlace.odc }}</p>
            </div>
          </div>
        </div>

        <div class="podium-footer podium-footer--gold">
          <span class="podium-footer__star">&#9733;</span>
          <span>Juara 1</span>
          <span class="podium-footer__star">&#9733;</span>
        </div>
      </article>

      <article v-if="thirdPlace" class="podium-card podium-card--bronze">
        <div class="podium-card__glow" />
        <div class="podium-card__shine" />
        <div class="podium-head">
          <div class="medal-ribbon medal-ribbon--bronze">
            <span class="medal-ribbon__icon">
              <svg viewBox="0 0 64 64" class="trophy-mark trophy-mark--bronze" aria-hidden="true">
                <path d="M20 10h24v8c0 7.7-5.2 14.2-12 16-6.8-1.8-12-8.3-12-16z" />
                <path d="M17 14H8c0 9.2 5.5 15 13 16" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                <path d="M47 14h9c0 9.2-5.5 15-13 16" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                <path d="M26 36h12v6H26z" />
                <path d="M22 44h20v6H22z" />
              </svg>
            </span>
            <span>Juara 3</span>
          </div>
          <div class="rank-bubble rank-bubble--bronze">#3</div>
        </div>

        <div class="podium-body">
          <p class="team-label">{{ thirdPlace.name }}</p>
          <h3 class="team-name">{{ thirdPlace.pic }}</h3>

          <div class="stat-layout">
            <div>
              <p class="metric-label">Total Instalasi</p>
              <p class="metric-value metric-value--bronze">{{ thirdPlace.totalInstalled }}</p>
            </div>
            <div class="chart-bars chart-bars--bronze">
              <span v-for="step in 4" :key="`bronze-${step}`" class="chart-bars__bar chart-bars__bar--bronze" :style="{ height: barHeight(thirdPlace.totalInstalled, step, 3) }" />
            </div>
          </div>

          <div class="progress-rail">
            <div class="progress-fill progress-fill--bronze" :style="{ width: progressWidth(thirdPlace.totalInstalled) }" />
          </div>

          <div class="split-stats">
            <div class="split-stats__item">
              <p class="split-stats__label split-stats__label--odp">ODP</p>
              <p class="split-stats__value">{{ thirdPlace.odp }}</p>
            </div>
            <div class="split-stats__item">
              <p class="split-stats__label split-stats__label--odc">ODC</p>
              <p class="split-stats__value">{{ thirdPlace.odc }}</p>
            </div>
          </div>
        </div>

        <div class="podium-footer podium-footer--bronze">Juara 3</div>
      </article>
    </div>

    <div v-if="fourthPlace" class="mini-card-wrap">
      <article class="mini-card">
        <div class="podium-card__glow" />
        <div class="podium-card__shine" />
        <div class="mini-card__head">
          <div>
            <p class="team-label">{{ fourthPlace.name }}</p>
            <h3 class="team-name">{{ fourthPlace.pic }}</h3>
          </div>
          <div class="rank-bubble rank-bubble--silver">#4</div>
        </div>

        <div class="stat-layout stat-layout--mini">
          <div>
            <p class="metric-label">Total Instalasi</p>
            <p class="metric-value metric-value--silver">{{ fourthPlace.totalInstalled }}</p>
          </div>
          <div class="chart-bars chart-bars--silver chart-bars--mini">
            <span v-for="step in 3" :key="`mini-${step}`" class="chart-bars__bar chart-bars__bar--silver" :style="{ height: `${22 + step * 15 + Math.max(fourthPlace.totalInstalled, 1) * 3}px` }" />
          </div>
        </div>

        <div class="progress-rail">
          <div class="progress-fill progress-fill--silver" :style="{ width: progressWidth(fourthPlace.totalInstalled) }" />
        </div>

        <div class="split-stats">
          <div class="split-stats__item">
            <p class="split-stats__label split-stats__label--odp">ODP</p>
            <p class="split-stats__value">{{ fourthPlace.odp }}</p>
          </div>
          <div class="split-stats__item">
            <p class="split-stats__label split-stats__label--odc">ODC</p>
            <p class="split-stats__value">{{ fourthPlace.odc }}</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.rank-showcase {
  position: relative;
  padding: 0 1.7rem 1.8rem;
}

.podium-grid {
  display: grid;
  grid-template-columns: 1fr 1.08fr 1fr;
  gap: 1.15rem;
  align-items: start;
}

.podium-card,
.mini-card {
  position: relative;
  overflow: hidden;
  border-radius: 1.9rem;
  border: 1px solid rgba(80, 115, 176, 0.28);
  background:
    radial-gradient(circle at 15% 8%, rgba(59, 130, 246, 0.12), rgba(255, 255, 255, 0) 28%),
    linear-gradient(180deg, rgba(7, 20, 50, 0.98), rgba(3, 12, 32, 0.98));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 3px 0 rgba(10, 26, 63, 0.88),
    0 18px 34px -24px rgba(2, 6, 23, 0.72);
}

.podium-card::before,
.mini-card::before {
  content: '';
  position: absolute;
  inset: 0.16rem;
  border-radius: inherit;
  border: 1px solid rgba(255, 255, 255, 0.05);
  pointer-events: none;
}

.podium-card {
  min-height: 28.4rem;
}

.podium-card--main {
  min-height: 31.4rem;
  transform: translateY(-0.6rem);
}

.podium-card--silver {
  margin-top: 2.1rem;
  background:
    radial-gradient(circle at 16% 12%, rgba(96, 165, 250, 0.16), rgba(219, 234, 254, 0) 22%),
    linear-gradient(180deg, rgba(6, 22, 56, 0.98), rgba(4, 14, 38, 0.98));
}

.podium-card--gold {
  background:
    radial-gradient(circle at 50% 10%, rgba(255, 236, 166, 0.18), rgba(255, 236, 166, 0) 24%),
    linear-gradient(180deg, rgba(34, 27, 8, 0.98), rgba(16, 13, 7, 0.98));
  border-color: rgba(250, 204, 21, 0.52);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 3px 0 rgba(100, 70, 10, 0.8),
    0 22px 40px -28px rgba(2, 6, 23, 0.72);
}

.podium-card--bronze {
  margin-top: 2.1rem;
  background:
    radial-gradient(circle at 16% 12%, rgba(255, 143, 40, 0.16), rgba(255, 221, 189, 0) 22%),
    linear-gradient(180deg, rgba(43, 20, 6, 0.98), rgba(24, 11, 6, 0.98));
  border-color: rgba(251, 146, 60, 0.42);
}

.podium-card__glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 84% 58%, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0) 18%),
    radial-gradient(circle at 28% 18%, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0) 24%);
  pointer-events: none;
}

.podium-card__shine {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0) 32%),
    radial-gradient(circle at 84% 15%, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0) 18%);
  pointer-events: none;
}

.podium-head,
.mini-card__head {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.12rem 1.12rem 0;
}

.podium-body,
.mini-card {
  position: relative;
}

.medal-ribbon {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  min-height: 2.7rem;
  padding: 0.22rem 0.9rem 0.26rem 0.28rem;
  border-radius: 0.72rem;
  color: white;
  font-size: 0.84rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.52),
    0 8px 14px -14px rgba(15, 23, 42, 0.44);
}

.medal-ribbon::before {
  content: '';
  position: absolute;
  inset: 0.16rem 0.2rem;
  border-radius: 0.56rem;
  border: 1px solid rgba(255, 255, 255, 0.34);
}

.medal-ribbon::after {
  content: '';
  position: absolute;
  left: 2.55rem;
  right: 0.8rem;
  top: 0.18rem;
  height: 0.34rem;
  border-radius: 9999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0));
}

.medal-ribbon__icon {
  display: inline-flex;
  height: 2.1rem;
  width: 2.1rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.82rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0.08));
  color: currentColor;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    0 4px 8px -6px rgba(15, 23, 42, 0.45);
  clip-path: polygon(50% 0, 92% 22%, 92% 78%, 50% 100%, 8% 78%, 8% 22%);
}

.trophy-mark {
  height: 1.35rem;
  width: 1.35rem;
  filter: drop-shadow(0 1px 0 rgba(255,255,255,0.35));
}

.trophy-mark--gold {
  color: #7c4300;
}

.trophy-mark--silver {
  color: #35538f;
}

.trophy-mark--bronze {
  color: #8b4200;
}

.medal-ribbon--silver {
  background: linear-gradient(180deg, #eef3fb 0%, #b4c4de 56%, #7d8da9 100%);
  color: #21417e;
}

.medal-ribbon--gold {
  background: linear-gradient(180deg, #ffdf7b 0%, #f4b006 58%, #b96a00 100%);
}

.medal-ribbon--bronze {
  background: linear-gradient(180deg, #ffc894 0%, #f18726 56%, #b95800 100%);
}

.rank-bubble {
  position: relative;
  display: inline-flex;
  height: 3.2rem;
  width: 3.2rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 900;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.88),
    0 10px 14px -16px rgba(15, 23, 42, 0.42);
}

.rank-bubble::before {
  content: '';
  position: absolute;
  inset: 0.25rem;
  border-radius: inherit;
  border: 1px solid rgba(255, 255, 255, 0.55);
}

.rank-bubble--silver {
  background: linear-gradient(180deg, #fbfdff 0%, #d7e5f9 100%);
  color: #234282;
  border: 1px solid rgba(171, 195, 227, 0.72);
}

.rank-bubble--gold {
  background: linear-gradient(180deg, #fff7d6 0%, #ffd958 100%);
  color: #8a4b00;
  border: 1px solid rgba(241, 193, 54, 0.72);
}

.rank-bubble--bronze {
  background: linear-gradient(180deg, #ffe8d5 0%, #ffbc78 100%);
  color: #8f3c00;
  border: 1px solid rgba(246, 165, 97, 0.72);
}

.podium-body,
.mini-card {
  padding: 0.88rem 1.08rem 0;
}

.team-label {
  font-size: 0.84rem;
  font-weight: 500;
  color: rgba(219, 231, 255, 0.82);
}

.team-name {
  margin-top: 0.3rem;
  font-size: 1.95rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.05em;
  color: #f7fbff;
}

.team-name--main {
  font-size: 2.6rem;
}

.stat-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 5.9rem;
  align-items: end;
  gap: 0.8rem;
  margin-top: 0.85rem;
}

.stat-layout--main {
  grid-template-columns: minmax(0, 1fr) 6.5rem;
  margin-top: 0.95rem;
}

.stat-layout--mini {
  grid-template-columns: minmax(0, 1fr) 4rem;
  margin-top: 0.9rem;
}

.metric-label {
  font-size: 0.74rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgba(226, 235, 250, 0.84);
}

.metric-value {
  margin-top: 0.45rem;
  font-size: 3.15rem;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.06em;
}

.metric-value--silver {
  color: #183cac;
}

.metric-value--gold {
  color: #d97700;
}

.metric-value--bronze {
  color: #d65b00;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 0.28rem;
  min-height: 7.8rem;
}

.chart-bars--mini {
  min-height: 4rem;
}

.chart-bars__bar {
  position: relative;
  width: 1.2rem;
  min-height: 2rem;
  border-radius: 0.24rem 0.24rem 0.12rem 0.12rem;
  box-shadow:
    inset 1px 1px 0 rgba(255, 255, 255, 0.62),
    0 10px 16px -14px rgba(15, 23, 42, 0.4);
}

.chart-bars__bar::before {
  content: '';
  position: absolute;
  inset: 0.12rem auto 0.12rem 0.08rem;
  width: 0.16rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
}

.chart-bars__bar::after {
  content: '';
  position: absolute;
  top: 0.22rem;
  right: -0.32rem;
  bottom: 0;
  width: 0.34rem;
  transform: skewY(42deg);
  transform-origin: left bottom;
  border-radius: 0 0.12rem 0.08rem 0;
  opacity: 0.7;
}

.chart-bars__bar--silver {
  background: linear-gradient(180deg, #9bc0ff 0%, #4f8cff 56%, #1a4dcf 100%);
}

.chart-bars__bar--silver::after {
  background: linear-gradient(180deg, #4d88ff 0%, #1b49bd 100%);
}

.chart-bars__bar--gold {
  background: linear-gradient(180deg, #ffe279 0%, #ffc014 58%, #e18800 100%);
}

.chart-bars__bar--gold::after {
  background: linear-gradient(180deg, #ffc83f 0%, #d47c00 100%);
}

.chart-bars__bar--bronze {
  background: linear-gradient(180deg, #ffbe6f 0%, #ff8419 58%, #d25700 100%);
}

.chart-bars__bar--bronze::after {
  background: linear-gradient(180deg, #ff9530 0%, #c94c00 100%);
}

.progress-rail {
  position: relative;
  margin-top: 0.82rem;
  height: 0.82rem;
  overflow: hidden;
  border-radius: 9999px;
  background: linear-gradient(180deg, #f0ede6 0%, #d9d9d7 100%);
  box-shadow:
    inset 0 2px 4px rgba(100, 116, 139, 0.2),
    inset 0 -1px 1px rgba(255, 255, 255, 0.68);
}

.progress-rail::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.56), rgba(255, 255, 255, 0) 44%);
  pointer-events: none;
}

.progress-fill {
  position: relative;
  height: 100%;
  border-radius: inherit;
}

.progress-fill::after {
  content: '';
  position: absolute;
  right: -0.35rem;
  top: 50%;
  height: 1.15rem;
  width: 1.15rem;
  transform: translateY(-50%);
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0));
}

.progress-fill--silver {
  background: linear-gradient(90deg, #1f4fda 0%, #2a72ff 60%, #8fc6ff 100%);
}

.progress-fill--gold {
  background: linear-gradient(90deg, #f7aa00 0%, #f7c600 60%, #ffe46d 100%);
}

.progress-fill--bronze {
  background: linear-gradient(90deg, #e06100 0%, #ff8620 60%, #ffbd6c 100%);
}

.split-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.62rem;
  margin-top: 0.72rem;
  padding-bottom: 0.9rem;
}

.split-stats__item {
  position: relative;
  border-radius: 0.95rem;
  border: 1px solid rgba(82, 112, 168, 0.32);
  background: rgba(7, 23, 54, 0.74);
  padding: 0.62rem 0.72rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.86);
}

.split-stats__item::after {
  content: '';
  position: absolute;
  inset: 0.22rem;
  border-radius: 0.72rem;
  border: 1px solid rgba(104, 129, 181, 0.18);
}

.split-stats__label {
  font-size: 0.74rem;
  font-weight: 700;
}

.split-stats__label--odp {
  color: #1d4ed8;
}

.split-stats__label--odc {
  color: #6d28d9;
}

.split-stats__value {
  margin-top: 0.28rem;
  font-size: 1.45rem;
  line-height: 1;
  font-weight: 900;
  color: #f7fbff;
}

.podium-footer {
  position: relative;
  display: flex;
  min-height: 3rem;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
  border-top: 1px solid rgba(255, 255, 255, 0.42);
  color: white;
  font-size: 0.9rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.38);
  border-radius: 0 0 1.55rem 1.55rem;
  margin: 0 0.12rem 0.12rem;
  width: calc(100% - 0.24rem);
}

.podium-footer::before {
  content: '';
  position: absolute;
  left: 0.9rem;
  right: 0.9rem;
  top: 0.35rem;
  height: 0.6rem;
  border-radius: 9999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.44), rgba(255, 255, 255, 0));
}

.podium-footer--silver {
  background: linear-gradient(180deg, #3676f7 0%, #1150cd 58%, #0e388f 100%);
}

.podium-footer--gold {
  background: linear-gradient(180deg, #ffd84f 0%, #eda700 58%, #bd6d00 100%);
}

.podium-footer--bronze {
  background: linear-gradient(180deg, #ff9928 0%, #eb6900 58%, #c74d00 100%);
}

.podium-footer__star {
  font-size: 1rem;
  color: #fff7bd;
  text-shadow: 0 0 12px rgba(255, 243, 173, 0.52);
}

.mini-card-wrap {
  margin-top: 0.78rem;
  width: 29.1%;
  min-width: 20rem;
}

.mini-card {
  min-height: 14.6rem;
  background:
    radial-gradient(circle at 18% 12%, rgba(96, 165, 250, 0.16), rgba(219, 234, 254, 0) 20%),
    linear-gradient(180deg, rgba(6, 22, 56, 0.98), rgba(4, 14, 38, 0.98));
}

@media (max-width: 1180px) {
  .rank-showcase {
    padding: 0 1rem 1.5rem;
  }

  .podium-grid {
    grid-template-columns: 1fr;
  }

  .podium-card--main,
  .podium-card--silver,
  .podium-card--bronze {
    margin-top: 0;
    transform: none;
  }

  .mini-card-wrap {
    width: 100%;
    min-width: 0;
  }
}

@media (max-width: 767px) {
  .rank-showcase {
    padding: 0 0.2rem 1rem;
  }

  .podium-card,
  .podium-card--main {
    min-height: auto;
  }

  .podium-head,
  .mini-card__head,
  .podium-body,
  .mini-card {
    padding-left: 1.15rem;
    padding-right: 1.15rem;
  }

  .team-name,
  .team-name--main {
    font-size: 2rem;
  }

  .metric-value {
    font-size: 2.9rem;
  }
}
</style>
