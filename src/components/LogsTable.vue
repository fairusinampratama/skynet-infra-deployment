<script setup>
import { Trash2, Table2 } from 'lucide-vue-next'

defineProps({
  logs: {
    type: Array,
    required: true
  }
})

defineEmits(['delete'])

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

const formatPercent = (value) => `${(value * 100).toFixed(1)}%`
</script>

<template>
  <article class="logs-panel">
    <div class="logs-panel__header">
      <div>
        <div class="logs-chip">
          <Table2 :size="14" />
          Riwayat Harian
        </div>
        <h3 class="logs-panel__title">Tabel Daily ODP & ODC</h3>
        <p class="logs-panel__desc">Pantau total harian, akumulasi, dan persentase progres tiap tanggal dalam satu tabel.</p>
      </div>
    </div>

    <div class="logs-table-wrap">
      <table class="logs-table">
        <thead>
          <tr>
            <th class="sticky-col sticky-col--day" rowspan="2">Hari</th>
            <th class="sticky-col sticky-col--date" rowspan="2">Tanggal</th>
            <th class="head-group" colspan="2">Tim 1</th>
            <th class="head-group" colspan="2">Tim 2</th>
            <th class="head-group" colspan="2">Tim 3</th>
            <th class="head-group" colspan="2">Tim 4</th>
            <th class="head-group head-group--blue" colspan="2">Total Harian</th>
            <th class="head-group head-group--deep" colspan="2">Akumulasi</th>
            <th class="head-group head-group--green" colspan="2">Progress</th>
            <th rowspan="2">Keterangan</th>
            <th rowspan="2">Aksi</th>
          </tr>
          <tr>
            <th>ODP</th>
            <th>ODC</th>
            <th>ODP</th>
            <th>ODC</th>
            <th>ODP</th>
            <th>ODC</th>
            <th>ODP</th>
            <th>ODC</th>
            <th class="head-group--blue-sub">ODP</th>
            <th class="head-group--blue-sub">ODC</th>
            <th class="head-group--deep-sub">ODP</th>
            <th class="head-group--deep-sub">ODC</th>
            <th class="head-group--green-sub">ODP</th>
            <th class="head-group--green-sub">ODC</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="logs.length === 0">
            <td colspan="18" class="logs-empty">
              Belum ada data riwayat
            </td>
          </tr>

          <tr v-for="log in logs" v-else :key="log.id">
            <td class="sticky-col sticky-col--day body-sticky">{{ log.hariIndex }}</td>
            <td class="sticky-col sticky-col--date body-sticky">{{ formatDate(log.date) }}</td>
            <td :class="(!log.tim1?.odp || log.tim1.odp === 0) ? 'muted' : 'blue'">{{ log.tim1?.odp || 0 }}</td>
            <td :class="(!log.tim1?.odc || log.tim1.odc === 0) ? 'muted' : 'violet'">{{ log.tim1?.odc || 0 }}</td>
            <td :class="(!log.tim2?.odp || log.tim2.odp === 0) ? 'muted' : 'blue'">{{ log.tim2?.odp || 0 }}</td>
            <td :class="(!log.tim2?.odc || log.tim2.odc === 0) ? 'muted' : 'violet'">{{ log.tim2?.odc || 0 }}</td>
            <td :class="(!log.tim3?.odp || log.tim3.odp === 0) ? 'muted' : 'blue'">{{ log.tim3?.odp || 0 }}</td>
            <td :class="(!log.tim3?.odc || log.tim3.odc === 0) ? 'muted' : 'violet'">{{ log.tim3?.odc || 0 }}</td>
            <td :class="(!log.tim4?.odp || log.tim4.odp === 0) ? 'muted' : 'blue'">{{ log.tim4?.odp || 0 }}</td>
            <td :class="(!log.tim4?.odc || log.tim4.odc === 0) ? 'muted' : 'violet'">{{ log.tim4?.odc || 0 }}</td>
            <td class="metric-blue">{{ log.dailyOdp }}</td>
            <td class="metric-violet">{{ log.dailyOdc }}</td>
            <td class="metric-deep-blue">{{ log.accOdp }}</td>
            <td class="metric-deep-violet">{{ log.accOdc }}</td>
            <td class="metric-green">{{ formatPercent(log.progressOdp) }}</td>
            <td class="metric-green">{{ formatPercent(log.progressOdc) }}</td>
            <td class="notes-cell" :title="log.notes">{{ log.notes || '-' }}</td>
            <td>
              <button
                @click="$emit('delete', log.id)"
                class="delete-btn"
                title="Hapus Data"
              >
                <Trash2 :size="16" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
</template>

<style scoped>
.logs-panel {
  overflow: hidden;
  border-radius: 1.55rem;
  border: 1px solid rgba(66, 108, 177, 0.28);
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.1), transparent 22%),
    linear-gradient(180deg, rgba(5, 17, 42, 0.98), rgba(3, 11, 29, 0.98));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 24px 48px -34px rgba(2, 6, 23, 0.94);
}

.logs-panel__header {
  padding: 1.2rem 1.2rem 0.9rem;
}

.logs-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  border: 1px solid rgba(72, 124, 220, 0.28);
  background: rgba(9, 31, 70, 0.7);
  color: #c9deff;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.logs-panel__title {
  margin-top: 0.85rem;
  font-size: 1.4rem;
  font-weight: 800;
  color: #f8fbff;
}

.logs-panel__desc {
  margin-top: 0.35rem;
  color: rgba(206, 221, 249, 0.76);
  line-height: 1.5;
}

.logs-table-wrap {
  overflow-x: auto;
  padding: 0 1.2rem 1.2rem;
}

.logs-table {
  width: 100%;
  min-width: 1180px;
  border-collapse: separate;
  border-spacing: 0;
  color: #d9e7ff;
  font-size: 0.88rem;
}

.logs-table th,
.logs-table td {
  border-right: 1px solid rgba(84, 112, 163, 0.2);
  border-bottom: 1px solid rgba(84, 112, 163, 0.2);
  padding: 0.8rem 0.7rem;
  text-align: center;
  background: rgba(5, 17, 43, 0.72);
}

.logs-table thead th {
  position: sticky;
  top: 0;
  z-index: 5;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #cfe0ff;
  background: rgba(9, 24, 58, 0.98);
}

.head-group {
  background: rgba(14, 30, 67, 0.98) !important;
}

.head-group--blue {
  background: rgba(9, 45, 88, 0.98) !important;
}

.head-group--deep {
  background: rgba(9, 56, 110, 0.98) !important;
}

.head-group--green {
  background: rgba(8, 53, 49, 0.98) !important;
}

.head-group--blue-sub {
  background: rgba(10, 40, 79, 0.98) !important;
}

.head-group--deep-sub {
  background: rgba(8, 52, 97, 0.98) !important;
}

.head-group--green-sub {
  background: rgba(10, 49, 45, 0.98) !important;
}

.sticky-col {
  position: sticky;
  z-index: 6;
  background: rgba(8, 22, 53, 0.98) !important;
}

.sticky-col--day {
  left: 0;
  min-width: 4.2rem;
}

.sticky-col--date {
  left: 4.2rem;
  min-width: 8.5rem;
}

.body-sticky {
  font-weight: 700;
  color: #ffffff;
}

.logs-table tbody tr:hover td {
  background: rgba(8, 23, 56, 0.96);
}

.logs-table tbody tr:hover .sticky-col {
  background: rgba(11, 29, 67, 0.99) !important;
}

.muted {
  color: rgba(158, 179, 217, 0.42);
}

.blue {
  color: #77b2ff;
  font-weight: 700;
}

.violet {
  color: #d59cff;
  font-weight: 700;
}

.metric-blue {
  color: #8ec0ff;
  background: rgba(12, 41, 84, 0.84) !important;
  font-weight: 700;
}

.metric-violet {
  color: #ddacff;
  background: rgba(36, 16, 76, 0.82) !important;
  font-weight: 700;
}

.metric-deep-blue {
  color: #b5d6ff;
  background: rgba(13, 53, 98, 0.88) !important;
  font-weight: 800;
}

.metric-deep-violet {
  color: #f0d1ff;
  background: rgba(50, 23, 97, 0.86) !important;
  font-weight: 800;
}

.metric-green {
  color: #aef1d6;
  background: rgba(10, 55, 46, 0.82) !important;
}

.notes-cell {
  max-width: 16rem;
  text-align: left !important;
  color: rgba(223, 232, 251, 0.82);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logs-empty {
  padding: 1.8rem;
  color: rgba(176, 196, 233, 0.6);
}

.delete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.7rem;
  color: #ff9ba0;
  background: rgba(98, 23, 33, 0.24);
  transition: background-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
}

.delete-btn:hover {
  background: rgba(125, 27, 41, 0.42);
  color: #ffd1d3;
  transform: translateY(-1px);
}
</style>
