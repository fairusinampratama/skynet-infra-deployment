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
const barHeight = (value, step, rank) => `${26 + step * 18 + Math.max(value, 1) * (rank === 1 ? 2.05 : 1.65)}px`
</script>

<template>
  <div class="rank-showcase">
    <div class="podium-grid">
      <article v-if="secondPlace" class="podium-card podium-card--silver">
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
  padding: 0 3rem 2rem;
}

.podium-grid {
  display: grid;
  grid-template-columns: 1fr 1.08fr 1fr;
  gap: 2rem;
  align-items: start;
}

.podium-card,
.mini-card {
  position: relative;
  overflow: hidden;
  border-radius: 2rem;
  border: 1px solid rgba(191, 219, 254, 0.45);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.99), rgba(246, 250, 255, 0.98));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    0 22px 40px -28px rgba(15, 23, 42, 0.28);
}

.podium-card::before,
.mini-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid rgba(255, 255, 255, 0.82);
  pointer-events: none;
}

.podium-card {
  min-height: 30.5rem;
}

.podium-card--main {
  min-height: 33.25rem;
  transform: translateY(-1rem);
}

.podium-card--silver {
  margin-top: 2.1rem;
  background:
    radial-gradient(circle at 16% 12%, rgba(219, 234, 254, 0.75), rgba(219, 234, 254, 0) 22%),
    linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(244, 248, 255, 0.98));
}

.podium-card--gold {
  background:
    radial-gradient(circle at 50% 10%, rgba(255, 236, 166, 0.75), rgba(255, 236, 166, 0) 24%),
    linear-gradient(180deg, rgba(255, 253, 245, 1), rgba(255, 248, 221, 0.98));
  border-color: rgba(250, 204, 21, 0.38);
}

.podium-card--bronze {
  margin-top: 2.1rem;
  background:
    radial-gradient(circle at 16% 12%, rgba(255, 221, 189, 0.7), rgba(255, 221, 189, 0) 22%),
    linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(255, 243, 229, 0.98));
  border-color: rgba(251, 146, 60, 0.34);
}

.podium-card__shine {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.76), rgba(255, 255, 255, 0) 32%),
    radial-gradient(circle at 84% 15%, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0) 18%);
  pointer-events: none;
}

.podium-head,
.mini-card__head {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.65rem 1.7rem 0;
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
  min-height: 3.2rem;
  padding: 0.5rem 1.15rem 0.5rem 0.7rem;
  border-radius: 1rem;
  color: white;
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.52),
    0 16px 22px -18px rgba(15, 23, 42, 0.44);
}

.medal-ribbon::before {
  content: '';
  position: absolute;
  inset: 0.22rem;
  border-radius: 0.82rem;
  border: 1px solid rgba(255, 255, 255, 0.34);
}

.medal-ribbon::after {
  content: '';
  position: absolute;
  left: 0.7rem;
  right: 0.8rem;
  top: 0.28rem;
  height: 0.55rem;
  border-radius: 9999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0));
}

.medal-ribbon__icon {
  display: inline-flex;
  height: 2.1rem;
  width: 2.1rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.18);
  color: currentColor;
  }

.trophy-mark {
  height: 1.45rem;
  width: 1.45rem;
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
  background: linear-gradient(180deg, #dbe5f3 0%, #bbc8dd 56%, #8090b2 100%);
  color: #21417e;
}

.medal-ribbon--gold {
  background: linear-gradient(180deg, #f8d158 0%, #f6ae05 58%, #c57800 100%);
}

.medal-ribbon--bronze {
  background: linear-gradient(180deg, #ffc185 0%, #f48727 56%, #bf5d00 100%);
}

.rank-bubble {
  position: relative;
  display: inline-flex;
  height: 3.8rem;
  width: 3.8rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-size: 1.6rem;
  font-weight: 900;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.88),
    0 12px 20px -18px rgba(15, 23, 42, 0.42);
}

.rank-bubble::before {
  content: '';
  position: absolute;
  inset: 0.28rem;
  border-radius: inherit;
  border: 1px solid rgba(255, 255, 255, 0.55);
}

.rank-bubble--silver {
  background: linear-gradient(180deg, #f9fbff 0%, #ccddf7 100%);
  color: #234282;
}

.rank-bubble--gold {
  background: linear-gradient(180deg, #fff3c6 0%, #fbd44a 100%);
  color: #8a4b00;
}

.rank-bubble--bronze {
  background: linear-gradient(180deg, #ffe3ca 0%, #ffb46d 100%);
  color: #8f3c00;
}

.podium-body,
.mini-card {
  padding: 1.4rem 1.85rem 0;
}

.team-label {
  font-size: 1.05rem;
  font-weight: 500;
  color: #334155;
}

.team-name {
  margin-top: 0.2rem;
  font-size: 3rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.04em;
  color: #09122d;
}

.team-name--main {
  font-size: 3.35rem;
}

.stat-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 8rem;
  align-items: end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.stat-layout--main {
  grid-template-columns: minmax(0, 1fr) 9.2rem;
  margin-top: 1.75rem;
}

.stat-layout--mini {
  grid-template-columns: minmax(0, 1fr) 5.7rem;
  margin-top: 1.45rem;
}

.metric-label {
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #475569;
}

.metric-value {
  margin-top: 0.65rem;
  font-size: 4rem;
  line-height: 1;
  font-weight: 900;
}

.metric-value--silver {
  color: #173fba;
}

.metric-value--gold {
  color: #d47a00;
}

.metric-value--bronze {
  color: #dc5b00;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 0.42rem;
  min-height: 10rem;
}

.chart-bars--mini {
  min-height: 6.2rem;
}

.chart-bars__bar {
  width: 1.5rem;
  min-height: 2rem;
  border-radius: 0.45rem 0.45rem 0.12rem 0.12rem;
  box-shadow:
    inset 1px 1px 0 rgba(255, 255, 255, 0.62),
    0 12px 18px -14px rgba(15, 23, 42, 0.4);
}

.chart-bars__bar--silver {
  background: linear-gradient(180deg, #8fb8ff 0%, #417fff 56%, #1744c9 100%);
}

.chart-bars__bar--gold {
  background: linear-gradient(180deg, #ffde6b 0%, #ffba00 58%, #e58700 100%);
}

.chart-bars__bar--bronze {
  background: linear-gradient(180deg, #ffbd63 0%, #ff7f14 58%, #d15600 100%);
}

.progress-rail {
  position: relative;
  margin-top: 1.45rem;
  height: 1.1rem;
  overflow: hidden;
  border-radius: 9999px;
  background: linear-gradient(180deg, #eef2f8 0%, #dbe2eb 100%);
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
  height: 1.45rem;
  width: 1.45rem;
  transform: translateY(-50%);
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0));
}

.progress-fill--silver {
  background: linear-gradient(90deg, #1b4fd8 0%, #2c7eff 60%, #8fcbff 100%);
}

.progress-fill--gold {
  background: linear-gradient(90deg, #ffb000 0%, #f5c400 60%, #ffe56a 100%);
}

.progress-fill--bronze {
  background: linear-gradient(90deg, #e65a00 0%, #ff8120 60%, #ffbc68 100%);
}

.split-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
  margin-top: 1rem;
  padding-bottom: 1.45rem;
}

.split-stats__item {
  position: relative;
  border-radius: 1rem;
  border: 1px solid rgba(191, 219, 254, 0.58);
  background: rgba(255, 255, 255, 0.74);
  padding: 0.95rem 1rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.86);
}

.split-stats__item::after {
  content: '';
  position: absolute;
  inset: 0.32rem;
  border-radius: 0.76rem;
  border: 1px solid rgba(148, 163, 184, 0.14);
}

.split-stats__label {
  font-size: 0.92rem;
  font-weight: 700;
}

.split-stats__label--odp {
  color: #1d4ed8;
}

.split-stats__label--odc {
  color: #6d28d9;
}

.split-stats__value {
  margin-top: 0.35rem;
  font-size: 2.25rem;
  line-height: 1;
  font-weight: 900;
  color: #173fba;
}

.podium-footer {
  position: relative;
  display: flex;
  min-height: 4rem;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
  border-top: 1px solid rgba(255, 255, 255, 0.42);
  color: white;
  font-size: 1.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.38);
}

.podium-footer::before {
  content: '';
  position: absolute;
  left: 1rem;
  right: 1rem;
  top: 0.35rem;
  height: 0.6rem;
  border-radius: 9999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.44), rgba(255, 255, 255, 0));
}

.podium-footer--silver {
  background: linear-gradient(180deg, #2f6ef6 0%, #114bcc 58%, #0e388f 100%);
}

.podium-footer--gold {
  background: linear-gradient(180deg, #ffd247 0%, #eda900 58%, #c37500 100%);
}

.podium-footer--bronze {
  background: linear-gradient(180deg, #ff9928 0%, #ed6700 58%, #c84e00 100%);
}

.podium-footer__star {
  font-size: 1.25rem;
  color: #fff7bd;
  text-shadow: 0 0 12px rgba(255, 243, 173, 0.52);
}

.mini-card-wrap {
  margin-top: 1.2rem;
  width: 29.5%;
  min-width: 20rem;
}

.mini-card {
  min-height: 20rem;
  background:
    radial-gradient(circle at 18% 12%, rgba(219, 234, 254, 0.65), rgba(219, 234, 254, 0) 20%),
    linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(244, 248, 255, 0.98));
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
</style>
