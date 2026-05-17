<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock3,
  ExternalLink,
  FileText,
  Gauge,
  Link2,
  Loader2,
  Play,
  Save,
  TrendingDown,
  TrendingUp
} from 'lucide-vue-next'

const links = ref([])
const isLoading = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const analysis = ref(null)
const selectedRange = ref('now-6h')

const rangeOptions = [
  { label: '6 Jam', value: 'now-6h' },
  { label: '12 Jam', value: 'now-12h' },
  { label: '24 Jam', value: 'now-24h' },
  { label: '7 Hari', value: 'now-7d' }
]

const filledLinks = computed(() => links.value.filter((link) => link.url.trim() || link.dashboardJson?.trim()))
const analyzedPanels = computed(() =>
  (analysis.value?.results || []).reduce((total, result) => total + (result.panels?.length || 0), 0)
)
const dataSeriesCount = computed(() =>
  (analysis.value?.results || []).reduce(
    (total, result) => total + (result.panels || []).reduce((panelTotal, panel) => panelTotal + panel.series.length, 0),
    0
  )
)

const loadLinks = async () => {
  errorMessage.value = ''

  try {
    const response = await fetch('/api/grafana-links')
    if (!response.ok) throw new Error('Gagal membaca link Grafana')
    links.value = await response.json()
  } catch (err) {
    errorMessage.value = err.message
    links.value = Array.from({ length: 4 }, (_, index) => ({
      id: index + 1,
      name: `Dashboard ${index + 1}`,
      url: '',
      dashboardJson: ''
    }))
  }
}

const saveLinks = async () => {
  isSaving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await fetch('/api/grafana-links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ links: links.value })
    })
    if (!response.ok) throw new Error('Gagal menyimpan link')

    links.value = await response.json()
    successMessage.value = '4 slot link/JSON Grafana sudah disimpan.'
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isSaving.value = false
  }
}

const analyzeLinks = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  analysis.value = null

  try {
    const response = await fetch('/api/grafana-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        links: links.value,
        range: { from: selectedRange.value, to: 'now' }
      })
    })
    const payload = await response.json()
    if (!response.ok) throw new Error(payload.error || 'Analisa gagal')

    analysis.value = payload
    successMessage.value = 'Analisa selesai.'
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isLoading.value = false
  }
}

const loadDashboardJsonFile = async (event, link) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    const text = await file.text()
    const parsed = JSON.parse(text)
    link.dashboardJson = text
    if (!link.name || /^Dashboard \d+$/.test(link.name)) {
      link.name = parsed.title || link.name
    }
    successMessage.value = `JSON ${file.name} dimuat ke Slot ${link.id}.`
    errorMessage.value = ''
  } catch (err) {
    errorMessage.value = `JSON Slot ${link.id} tidak valid: ${err.message}`
  } finally {
    event.target.value = ''
  }
}

const formatMbps = (value) => {
  if (!Number.isFinite(Number(value))) return '-'
  const number = Number(value)
  if (number >= 1000) return `${(number / 1000).toFixed(2)} Gbps`
  if (number >= 10) return `${number.toFixed(1)} Mbps`
  return `${number.toFixed(2)} Mbps`
}

const formatTime = (time) => {
  if (!time) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(time))
}

const statusLabel = (status) => {
  const labels = {
    ok: 'Data terbaca',
    metadata_only: 'Butuh akses query',
    failed: 'Gagal',
    empty: 'Kosong',
    normal: 'Normal',
    drop_seen: 'Ada drop',
    idle: 'Idle',
    query_failed: 'Query gagal',
    no_data: 'No data'
  }

  return labels[status] || status
}

onMounted(loadLinks)
</script>

<template>
  <div class="grafana-analyzer">
    <section class="analyzer-toolbar">
      <div>
        <div class="analyzer-chip">
          <Activity :size="15" />
          Grafana Traffic Analyzer
        </div>
        <h2>Analisa Peak, Minimum, dan Average Traffic</h2>
        <p>Simpan 4 public dashboard Grafana atau JSON export, lalu hitung statistik traffic per panel dan series.</p>
      </div>

      <div class="analyzer-actions">
        <select v-model="selectedRange" class="range-select" aria-label="Rentang waktu analisa">
          <option v-for="option in rangeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <button type="button" class="icon-button" :disabled="isSaving" @click="saveLinks">
          <Loader2 v-if="isSaving" :size="17" class="animate-spin" />
          <Save v-else :size="17" />
          Simpan
        </button>
        <button type="button" class="primary-button" :disabled="isLoading || !filledLinks.length" @click="analyzeLinks">
          <Loader2 v-if="isLoading" :size="18" class="animate-spin" />
          <Play v-else :size="18" />
          Analisa
        </button>
      </div>
    </section>

    <div v-if="errorMessage" class="message message--error">
      <AlertTriangle :size="18" />
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="message message--success">
      <Gauge :size="18" />
      {{ successMessage }}
    </div>

    <section class="link-grid">
      <article v-for="link in links" :key="link.id" class="link-card">
        <div class="link-card__head">
          <span><Link2 :size="16" /> Slot {{ link.id }}</span>
          <a v-if="link.url" :href="link.url" target="_blank" rel="noreferrer" title="Buka dashboard">
            <ExternalLink :size="16" />
          </a>
        </div>
        <input v-model="link.name" class="link-input" type="text" placeholder="Nama dashboard" />
        <input v-model="link.url" class="link-input" type="url" placeholder="https://grafana.../public-dashboards/..." />
        <label class="json-upload">
          <FileText :size="16" />
          Upload JSON export
          <input type="file" accept="application/json,.json" @change="loadDashboardJsonFile($event, link)" />
        </label>
        <textarea
          v-model="link.dashboardJson"
          class="json-textarea"
          rows="4"
          placeholder="Atau paste export JSON dashboard Grafana di sini"
        />
      </article>
    </section>

    <section v-if="analysis" class="summary-strip">
      <div>
        <span>Dashboard Diisi</span>
        <strong>{{ filledLinks.length }}/4</strong>
      </div>
      <div>
        <span>Panel Dianalisa</span>
        <strong>{{ analyzedPanels }}</strong>
      </div>
      <div>
        <span>Series Data</span>
        <strong>{{ dataSeriesCount }}</strong>
      </div>
      <div>
        <span>Rentang</span>
        <strong>{{ selectedRange.replace('now-', '') }}</strong>
      </div>
    </section>

    <section v-if="analysis" class="result-stack">
      <article v-for="result in analysis.results" :key="result.id" class="dashboard-result">
        <div class="dashboard-result__head">
          <div>
            <span class="dashboard-result__status" :class="`dashboard-result__status--${result.status}`">
              {{ statusLabel(result.status) }}
            </span>
            <h3>{{ result.dashboardTitle || result.name }}</h3>
            <p>{{ result.warning || result.error || `${result.panelCount || 0} panel timeseries ditemukan.` }}</p>
          </div>
          <a v-if="result.url" :href="result.url" target="_blank" rel="noreferrer" class="open-link">
            <ExternalLink :size="16" />
          </a>
        </div>

        <div v-if="result.panels?.length" class="panel-list">
          <article v-for="panel in result.panels" :key="panel.panelId" class="panel-result">
            <div class="panel-result__head">
              <div>
                <span :class="['panel-pill', `panel-pill--${panel.status}`]">{{ statusLabel(panel.status) }}</span>
                <h4>{{ panel.title }}</h4>
              </div>
              <p>{{ panel.note }}</p>
            </div>

            <div v-if="panel.series.length" class="series-table-wrap">
              <table class="series-table">
                <thead>
                  <tr>
                    <th>Series</th>
                    <th><TrendingUp :size="14" /> Peak</th>
                    <th><Clock3 :size="14" /> Jam Peak</th>
                    <th><TrendingDown :size="14" /> Minimum</th>
                    <th><Clock3 :size="14" /> Jam Min</th>
                    <th><BarChart3 :size="14" /> Average</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="series in panel.series" :key="series.name">
                    <td>{{ series.name }}</td>
                    <td>{{ formatMbps(series.peakMbps) }}</td>
                    <td>{{ formatTime(series.peak.time) }}</td>
                    <td>{{ formatMbps(series.minimumMbps) }}</td>
                    <td>{{ formatTime(series.minimum.time) }}</td>
                    <td>{{ formatMbps(series.averageMbps) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.grafana-analyzer {
  display: grid;
  gap: 1rem;
  padding-bottom: 2rem;
}

.analyzer-toolbar,
.link-card,
.dashboard-result,
.panel-result,
.summary-strip {
  border: 1px solid rgba(83, 130, 214, 0.3);
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.14), transparent 28%),
    linear-gradient(180deg, rgba(5, 17, 43, 0.96), rgba(3, 12, 32, 0.96));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 20px 42px -34px rgba(2, 6, 23, 0.9);
}

.analyzer-toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  border-radius: 1.35rem;
  padding: 1.2rem;
}

.analyzer-chip,
.link-card__head span,
.panel-pill,
.dashboard-result__status {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.analyzer-chip {
  border-radius: 0.85rem;
  border: 1px solid rgba(96, 165, 250, 0.26);
  background: rgba(8, 35, 80, 0.72);
  padding: 0.44rem 0.7rem;
  color: #c8dcff;
}

.analyzer-toolbar h2 {
  margin-top: 0.75rem;
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 900;
  line-height: 1.05;
}

.analyzer-toolbar p,
.dashboard-result__head p,
.panel-result__head p {
  margin-top: 0.45rem;
  color: rgba(211, 226, 255, 0.78);
  font-weight: 700;
  line-height: 1.45;
}

.analyzer-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.65rem;
}

.range-select,
.link-input {
  border: 1px solid rgba(111, 151, 222, 0.3);
  background: rgba(6, 20, 50, 0.72);
  color: #f8fbff;
  outline: none;
}

.range-select {
  min-height: 2.65rem;
  border-radius: 0.9rem;
  padding: 0 0.85rem;
  font-weight: 800;
}

.icon-button,
.primary-button,
.open-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  min-height: 2.65rem;
  border: 0;
  border-radius: 0.9rem;
  cursor: pointer;
  font-weight: 900;
  transition: transform 150ms ease, opacity 150ms ease;
}

.icon-button {
  background: rgba(8, 35, 80, 0.9);
  color: #dbeafe;
  padding: 0 0.9rem;
}

.primary-button {
  background: linear-gradient(135deg, #1d4ed8, #0891b2);
  color: #ffffff;
  padding: 0 1rem;
}

.icon-button:hover,
.primary-button:hover,
.open-link:hover {
  transform: translateY(-1px);
}

.icon-button:disabled,
.primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  transform: none;
}

.message {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  border-radius: 0.95rem;
  padding: 0.85rem 1rem;
  font-weight: 800;
}

.message--error {
  border: 1px solid rgba(248, 113, 113, 0.28);
  background: rgba(127, 29, 29, 0.22);
  color: #fecaca;
}

.message--success {
  border: 1px solid rgba(74, 222, 128, 0.24);
  background: rgba(20, 83, 45, 0.24);
  color: #bbf7d0;
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}

.link-card {
  display: grid;
  gap: 0.7rem;
  border-radius: 1.1rem;
  padding: 0.95rem;
}

.link-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #c8dcff;
}

.link-card__head a,
.open-link {
  color: #bfdbfe;
}

.link-input {
  min-height: 2.65rem;
  width: 100%;
  border-radius: 0.8rem;
  padding: 0 0.82rem;
  font-weight: 700;
}

.link-input::placeholder {
  color: rgba(203, 213, 225, 0.46);
}

.json-upload {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  min-height: 2.4rem;
  border-radius: 0.8rem;
  background: rgba(8, 35, 80, 0.86);
  color: #dbeafe;
  cursor: pointer;
  font-weight: 900;
}

.json-upload input {
  display: none;
}

.json-textarea {
  min-height: 6.6rem;
  width: 100%;
  resize: vertical;
  border: 1px solid rgba(111, 151, 222, 0.3);
  border-radius: 0.8rem;
  background: rgba(6, 20, 50, 0.72);
  color: #f8fbff;
  outline: none;
  padding: 0.75rem 0.82rem;
  font: 700 0.82rem/1.45 ui-monospace, SFMono-Regular, Consolas, monospace;
}

.json-textarea::placeholder {
  color: rgba(203, 213, 225, 0.46);
}

.summary-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.8rem;
  border-radius: 1.1rem;
  padding: 0.95rem;
}

.summary-strip div {
  border-radius: 0.85rem;
  background: rgba(8, 35, 80, 0.6);
  padding: 0.85rem;
}

.summary-strip span {
  color: rgba(211, 226, 255, 0.72);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.summary-strip strong {
  display: block;
  margin-top: 0.28rem;
  color: #ffffff;
  font-size: 1.55rem;
  font-weight: 950;
  line-height: 1;
}

.result-stack,
.panel-list {
  display: grid;
  gap: 1rem;
}

.dashboard-result {
  border-radius: 1.25rem;
  padding: 1rem;
}

.dashboard-result__head,
.panel-result__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.dashboard-result__head h3,
.panel-result__head h4 {
  margin-top: 0.45rem;
  color: #ffffff;
  font-weight: 900;
  line-height: 1.1;
}

.dashboard-result__head h3 {
  font-size: 1.28rem;
}

.panel-result__head h4 {
  font-size: 1rem;
}

.dashboard-result__status,
.panel-pill {
  border-radius: 999px;
  padding: 0.3rem 0.58rem;
}

.dashboard-result__status--ok,
.panel-pill--normal {
  background: rgba(22, 101, 52, 0.72);
  color: #bbf7d0;
}

.dashboard-result__status--metadata_only,
.panel-pill--query_failed,
.panel-pill--no_data {
  background: rgba(146, 64, 14, 0.72);
  color: #fed7aa;
}

.dashboard-result__status--failed,
.panel-pill--drop_seen {
  background: rgba(127, 29, 29, 0.72);
  color: #fecaca;
}

.dashboard-result__status--empty,
.panel-pill--idle {
  background: rgba(51, 65, 85, 0.78);
  color: #e2e8f0;
}

.open-link {
  width: 2.4rem;
  flex: none;
  background: rgba(8, 35, 80, 0.72);
}

.panel-list {
  margin-top: 1rem;
}

.panel-result {
  border-radius: 1rem;
  padding: 0.85rem;
}

.series-table-wrap {
  margin-top: 0.85rem;
  overflow-x: auto;
}

.series-table {
  width: 100%;
  min-width: 780px;
  border-collapse: collapse;
  overflow: hidden;
  border-radius: 0.8rem;
}

.series-table th,
.series-table td {
  border-bottom: 1px solid rgba(100, 116, 139, 0.22);
  padding: 0.75rem;
  text-align: left;
}

.series-table th {
  background: rgba(8, 35, 80, 0.78);
  color: #c8dcff;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
}

.series-table th svg {
  display: inline-block;
  margin-right: 0.25rem;
  vertical-align: -2px;
}

.series-table td {
  background: rgba(6, 20, 50, 0.62);
  color: #f8fbff;
  font-weight: 750;
}

@media (max-width: 1100px) {
  .analyzer-toolbar,
  .dashboard-result__head,
  .panel-result__head {
    flex-direction: column;
  }

  .analyzer-actions {
    justify-content: flex-start;
  }

  .summary-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .link-grid,
  .summary-strip {
    grid-template-columns: 1fr;
  }
}
</style>
