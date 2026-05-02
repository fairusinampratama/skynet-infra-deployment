<script setup>
import { computed } from "vue";
import { Target, Activity, Percent, CalendarClock, Skull } from "lucide-vue-next";

const props = defineProps({
  target: { type: Number, required: true },
  targetOdp: { type: Number, required: true },
  targetOdc: { type: Number, required: true },
  installed: { type: Number, required: true },
  installedOdp: { type: Number, required: true },
  installedOdc: { type: Number, required: true },
  progress: { type: Number, required: true },
  daysRemaining: { type: Number, required: true },
  remainingOdp: { type: Number, required: true },
  remainingOdc: { type: Number, required: true },
  hasKnownTarget: { type: Boolean, default: true },
});

const remainingTotal = computed(() => props.remainingOdp + props.remainingOdc);
const progressWidth = computed(() => Math.min(Math.max(props.progress, 0), 100));
const installedRatioLabel = computed(() => (props.hasKnownTarget ? `${props.installed} / ${props.target}` : "Target belum diisi"));
const targetLabel = computed(() => (props.hasKnownTarget ? props.target : "Belum diisi"));
const targetSplitLabel = computed(() => (props.hasKnownTarget ? `ODP ${props.targetOdp} | ODC ${props.targetOdc}` : "ODP & ODC menyusul"));
const remainingTotalLabel = computed(() => (props.hasKnownTarget ? remainingTotal.value : "-"));
const statusLabel = computed(() => {
  if (!props.hasKnownTarget) return "Menunggu Target";
  return props.daysRemaining <= 7 ? "Mepet" : "On Track";
});
const isUrgentStatus = computed(() => statusLabel.value === "Mepet");
</script>

<template>
  <section class="dashboard-kpi-grid">
    <article class="kpi-card kpi-card--hero">
      <div class="kpi-card__glow"></div>
      <div class="kpi-head">
        <div>
          <p class="kpi-eyebrow">Ringkasan Proyek</p>
          <h2 class="kpi-title">KPI Pemasangan</h2>
        </div>
        <div class="kpi-icon-badge kpi-icon-badge--blue">
          <Target :size="25" />
        </div>
      </div>

      <div class="kpi-mini-grid">
        <div class="kpi-mini-box">
          <p class="kpi-mini-label">Target</p>
          <p class="kpi-mini-value" :class="{ 'kpi-value--text': !hasKnownTarget }">{{ targetLabel }}</p>
          <p class="kpi-mini-meta">{{ targetSplitLabel }}</p>
        </div>
        <div class="kpi-mini-box">
          <p class="kpi-mini-label">Terpasang</p>
          <p class="kpi-mini-value">{{ installed }}</p>
          <p class="kpi-mini-meta">ODP {{ installedOdp }} | ODC {{ installedOdc }}</p>
        </div>
      </div>

      <div class="kpi-progress-box">
        <div class="kpi-progress-head">
          <div>
            <p class="kpi-mini-label">Progress Total</p>
            <p class="kpi-progress-value">{{ progress }}%</p>
          </div>
          <div class="text-right">
            <p class="kpi-mini-label">Realisasi</p>
            <p class="kpi-progress-meta">{{ installedRatioLabel }}</p>
          </div>
        </div>
        <div class="kpi-progress-track">
          <div class="kpi-progress-fill" :style="{ width: `${progressWidth}%` }"></div>
        </div>
      </div>
    </article>

    <article class="kpi-card kpi-card--metric kpi-card--blue">
      <div class="kpi-head">
        <div>
          <p class="kpi-eyebrow">Target</p>
          <p class="kpi-metric-value" :class="{ 'kpi-value--text': !hasKnownTarget }">{{ targetLabel }}</p>
        </div>
        <div class="kpi-icon-badge kpi-icon-badge--blue">
          <Target :size="22" />
        </div>
      </div>
      <div class="kpi-stack">
        <div class="kpi-stack-item">
          <span>ODP</span>
          <strong>{{ hasKnownTarget ? targetOdp : '-' }}</strong>
        </div>
        <div class="kpi-stack-item">
          <span>ODC</span>
          <strong>{{ hasKnownTarget ? targetOdc : '-' }}</strong>
        </div>
      </div>
    </article>

    <article class="kpi-card kpi-card--metric kpi-card--violet">
      <div class="kpi-head">
        <div>
          <p class="kpi-eyebrow">Total Terpasang</p>
          <p class="kpi-metric-value">{{ installed }}</p>
        </div>
        <div class="kpi-icon-badge kpi-icon-badge--violet">
          <Activity :size="22" />
        </div>
      </div>
      <div class="kpi-stack">
        <div class="kpi-stack-item">
          <span>ODP</span>
          <strong>{{ installedOdp }}</strong>
        </div>
        <div class="kpi-stack-item">
          <span>ODC</span>
          <strong>{{ installedOdc }}</strong>
        </div>
      </div>
    </article>

    <article class="kpi-card kpi-card--metric kpi-card--green">
      <div class="kpi-head">
        <div>
          <p class="kpi-eyebrow">Progress Total</p>
          <p class="kpi-metric-value">{{ progress }}%</p>
        </div>
        <div class="kpi-icon-badge kpi-icon-badge--green">
          <Percent :size="22" />
        </div>
      </div>
      <div class="kpi-status-box">
        <div class="kpi-stack-item kpi-stack-item--plain">
          <span>Capaian</span>
          <strong>{{ installedRatioLabel }}</strong>
        </div>
        <div class="kpi-progress-track kpi-progress-track--slim">
          <div class="kpi-progress-fill kpi-progress-fill--green" :style="{ width: `${progressWidth}%` }"></div>
        </div>
      </div>
    </article>

    <article class="kpi-card kpi-card--metric kpi-card--amber">
      <div class="kpi-head">
        <div>
          <p class="kpi-eyebrow">Sisa Hari</p>
          <p class="kpi-metric-value">{{ daysRemaining }}</p>
        </div>
        <div class="kpi-icon-badge kpi-icon-badge--amber">
          <CalendarClock :size="22" />
        </div>
      </div>
      <div class="kpi-status-box">
        <p class="kpi-mini-label">Status</p>
        <div class="kpi-pill" :class="{ 'kpi-pill--urgent': isUrgentStatus }">{{ statusLabel }}</div>
      </div>
    </article>

    <article class="kpi-card kpi-card--banner">
      <div class="kpi-banner-main">
        <div class="kpi-icon-badge kpi-icon-badge--rose">
          <Skull :size="22" />
        </div>
        <div>
          <p class="kpi-eyebrow kpi-eyebrow--rose">Sisa Pemasangan</p>
          <p class="kpi-banner-value">{{ remainingTotalLabel }}</p>
        </div>
      </div>

      <div class="kpi-banner-side">
        <div class="kpi-banner-box">
          <span>ODP</span>
          <strong>{{ hasKnownTarget ? remainingOdp : '-' }}</strong>
        </div>
        <div class="kpi-banner-box kpi-banner-box--amber">
          <span>ODC</span>
          <strong>{{ hasKnownTarget ? remainingOdc : '-' }}</strong>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped>
.dashboard-kpi-grid {
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  align-items: stretch;
}

.kpi-card {
  position: relative;
  overflow: hidden;
  border-radius: 1.55rem;
  border: 1px solid rgba(95, 123, 180, 0.34);
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 28%),
    linear-gradient(180deg, rgba(5, 16, 39, 0.98), rgba(2, 12, 31, 0.98));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 24px 48px -34px rgba(2, 6, 23, 0.92);
}

.kpi-card--hero {
  grid-column: 1 / span 4;
  grid-row: span 2 / span 2;
  padding: 1.2rem;
  min-height: 21.8rem;
  border-color: rgba(49, 121, 255, 0.6);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 0 0 1px rgba(30, 132, 255, 0.22),
    0 0 26px rgba(37, 99, 235, 0.2),
    0 24px 48px -34px rgba(2, 6, 23, 0.92);
}

.kpi-card--metric {
  grid-column: span 2 / span 2;
  padding: 1rem 0.92rem;
  min-height: 10.35rem;
  display: flex;
  flex-direction: column;
}

.kpi-card--banner {
  grid-column: 5 / span 8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.95rem 1.1rem;
  min-height: 5.2rem;
  margin-top: -0.1rem;
  border-color: rgba(255, 58, 147, 0.55);
  background:
    radial-gradient(circle at top left, rgba(244, 63, 94, 0.2), transparent 24%),
    radial-gradient(circle at top right, rgba(251, 146, 60, 0.12), transparent 20%),
    linear-gradient(180deg, rgba(57, 5, 34, 0.98), rgba(34, 7, 31, 0.98));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 0 0 1px rgba(255, 58, 147, 0.18),
    0 0 28px rgba(236, 72, 153, 0.14),
    0 24px 48px -34px rgba(2, 6, 23, 0.92);
}

.kpi-card--blue {
  border-color: rgba(66, 122, 255, 0.42);
  grid-column: 5 / span 2;
  grid-row: 1;
}

.kpi-card--violet {
  border-color: rgba(157, 78, 221, 0.42);
  grid-column: 7 / span 2;
  grid-row: 1;
  background:
    radial-gradient(circle at top left, rgba(139, 92, 246, 0.14), transparent 28%),
    linear-gradient(180deg, rgba(17, 13, 50, 0.98), rgba(8, 10, 31, 0.98));
}

.kpi-card--green {
  border-color: rgba(16, 185, 129, 0.42);
  grid-column: 9 / span 2;
  grid-row: 1;
  background:
    radial-gradient(circle at top left, rgba(16, 185, 129, 0.16), transparent 28%),
    linear-gradient(180deg, rgba(7, 43, 39, 0.98), rgba(5, 21, 26, 0.98));
}

.kpi-card--amber {
  border-color: rgba(245, 158, 11, 0.36);
  grid-column: 11 / span 2;
  grid-row: 1;
  background:
    radial-gradient(circle at top left, rgba(245, 158, 11, 0.18), transparent 28%),
    linear-gradient(180deg, rgba(43, 29, 9, 0.98), rgba(24, 18, 11, 0.98));
}

.kpi-card--green .kpi-head,
.kpi-card--amber .kpi-head {
  align-items: flex-start;
}

.kpi-card__glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 0 0, rgba(37, 99, 235, 0.16), transparent 26%),
    linear-gradient(120deg, rgba(255, 255, 255, 0.08), transparent 28%, transparent 74%, rgba(255, 255, 255, 0.04));
  pointer-events: none;
}

.kpi-head {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.kpi-eyebrow {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(211, 226, 255, 0.76);
}

.kpi-eyebrow--rose {
  color: #ff4ea2;
}

.kpi-title {
  margin-top: 0.5rem;
  font-size: 1.55rem;
  font-weight: 800;
  color: #f8fbff;
}

.kpi-icon-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.09);
}

.kpi-icon-badge--blue {
  background: linear-gradient(180deg, rgba(36, 91, 203, 0.86), rgba(17, 57, 135, 0.86));
  color: #d8e7ff;
}

.kpi-icon-badge--violet {
  background: linear-gradient(180deg, rgba(122, 53, 191, 0.86), rgba(79, 33, 126, 0.86));
  color: #efdfff;
}

.kpi-icon-badge--green {
  background: linear-gradient(180deg, rgba(28, 152, 109, 0.9), rgba(18, 94, 74, 0.86));
  color: #d4ffeb;
}

.kpi-icon-badge--amber {
  background: linear-gradient(180deg, rgba(177, 114, 35, 0.9), rgba(114, 64, 17, 0.9));
  color: #ffedc8;
}

.kpi-icon-badge--rose {
  background: linear-gradient(180deg, rgba(209, 42, 117, 0.96), rgba(114, 14, 71, 0.96));
  color: #fff0f7;
}

.kpi-mini-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.kpi-mini-box,
.kpi-status-box,
.kpi-stack-item,
.kpi-banner-box {
  border-radius: 1rem;
  border: 1px solid rgba(102, 129, 187, 0.34);
  background: rgba(9, 25, 58, 0.68);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.kpi-mini-box {
  padding: 0.82rem 0.9rem;
}

.kpi-mini-label {
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(204, 220, 255, 0.82);
}

.kpi-mini-value,
.kpi-metric-value,
.kpi-banner-value {
  margin-top: 0.55rem;
  font-weight: 900;
  line-height: 1;
  color: #fbfdff;
}

.kpi-mini-value {
  font-size: 2.55rem;
}

.kpi-metric-value {
  font-size: 3rem;
}

.kpi-value--text {
  font-size: 1.35rem;
  line-height: 1.15;
}

.kpi-banner-value {
  font-size: 2.45rem;
}

.kpi-mini-meta,
.kpi-progress-meta {
  margin-top: 0.45rem;
  font-size: 0.84rem;
  font-weight: 700;
  color: #f5f9ff;
}

.kpi-progress-box {
  position: relative;
  margin-top: 0.65rem;
  padding: 0.82rem 0.9rem;
  border-radius: 1rem;
  border: 1px solid rgba(102, 129, 187, 0.34);
  background: rgba(9, 25, 58, 0.68);
}

.kpi-progress-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.kpi-progress-value {
  margin-top: 0.45rem;
  font-size: 2rem;
  font-weight: 900;
  line-height: 1;
  color: #ffffff;
}

.kpi-progress-track {
  margin-top: 0.8rem;
  height: 0.85rem;
  border-radius: 999px;
  background: rgba(137, 167, 221, 0.2);
  overflow: hidden;
}

.kpi-progress-track--slim {
  height: 0.9rem;
}

.kpi-progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #32b1ff 0%, #1ed3ff 45%, #49f2ae 100%);
}

.kpi-progress-fill--green {
  background: linear-gradient(90deg, #55e58b 0%, #43efb9 100%);
}

.kpi-stack {
  display: grid;
  gap: 0.6rem;
  margin-top: auto;
  padding-top: 0.35rem;
}

.kpi-stack-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.68rem 0.78rem;
}

.kpi-stack-item span,
.kpi-banner-box span {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #d9e6ff;
}

.kpi-stack-item strong,
.kpi-banner-box strong {
  font-size: 0.96rem;
  font-weight: 800;
  color: #ffffff;
}

.kpi-stack-item--plain {
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  align-items: center;
}

.kpi-pill {
  display: inline-flex;
  align-items: center;
  margin-top: 0.7rem;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(41, 140, 96, 0.95), rgba(21, 88, 70, 0.95));
  border: 1px solid rgba(88, 237, 161, 0.26);
  color: #e8fff4;
  font-size: 0.88rem;
  font-weight: 800;
  text-transform: uppercase;
}

.kpi-status-box {
  margin-top: auto;
  padding: 0.62rem 0.68rem;
}

.kpi-card--green .kpi-status-box,
.kpi-card--amber .kpi-status-box {
  display: flex;
  min-height: 4rem;
  flex-direction: column;
  justify-content: space-between;
}

.kpi-card--green .kpi-stack-item--plain span,
.kpi-card--amber .kpi-mini-label {
  font-size: 0.72rem;
  letter-spacing: 0.18em;
}

.kpi-card--green .kpi-stack-item--plain strong {
  font-size: 0.88rem;
  line-height: 1;
}

.kpi-card--green .kpi-progress-track--slim {
  margin-top: 0.45rem;
}

.kpi-card--amber .kpi-pill {
  margin-top: 0.35rem;
  align-self: flex-start;
}

.kpi-pill--urgent {
  background: linear-gradient(180deg, rgba(239, 68, 68, 0.96), rgba(153, 27, 27, 0.96));
  border-color: rgba(248, 113, 113, 0.46);
  color: #fff5f5;
  box-shadow: 0 0 18px rgba(239, 68, 68, 0.22);
}

.kpi-card--blue .kpi-stack-item,
.kpi-card--violet .kpi-stack-item {
  min-height: 3rem;
  border-radius: 1.05rem;
}

.kpi-card--blue .kpi-stack-item span,
.kpi-card--violet .kpi-stack-item span {
  font-size: 0.84rem;
  letter-spacing: 0.16em;
}

.kpi-card--blue .kpi-stack-item strong,
.kpi-card--violet .kpi-stack-item strong {
  font-size: 0.96rem;
}

.kpi-banner-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kpi-banner-box span {
  font-size: 0.84rem;
  letter-spacing: 0.16em;
}

.kpi-banner-main {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.kpi-banner-side {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
  min-width: min(22rem, 100%);
}

.kpi-banner-box {
  min-width: 8.5rem;
  padding: 0.68rem 0.8rem;
}

.kpi-banner-box--amber {
  border-color: rgba(250, 151, 35, 0.36);
  background: rgba(66, 26, 12, 0.6);
}

@media (max-width: 1279px) {
  .kpi-card--hero {
    grid-column: span 12 / span 12;
    grid-row: auto;
  }

  .kpi-card--metric {
    grid-column: span 3 / span 3;
    grid-row: auto;
  }

  .kpi-card--banner {
    grid-column: span 12 / span 12;
    margin-top: 0;
  }
}

@media (max-width: 1023px) {
  .kpi-card--metric {
    grid-column: span 6 / span 6;
  }

  .kpi-card--banner {
    flex-direction: column;
    align-items: stretch;
  }

  .kpi-banner-side {
    min-width: 0;
  }
}

@media (max-width: 767px) {
  .dashboard-kpi-grid {
    grid-template-columns: 1fr;
  }

  .kpi-card--hero,
  .kpi-card--metric,
  .kpi-card--banner {
    grid-column: auto;
  }

  .kpi-mini-grid,
  .kpi-banner-side {
    grid-template-columns: 1fr;
  }

  .kpi-metric-value {
    font-size: 3.15rem;
  }

  .kpi-value--text {
    font-size: 1.35rem;
  }
}
</style>
