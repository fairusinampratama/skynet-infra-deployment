<script setup>
import { computed, ref, watch } from 'vue'
import { CalendarDays, DatabaseZap, PencilLine, RadioTower, ShieldEllipsis } from 'lucide-vue-next'

const props = defineProps({
  logs: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['submit'])

const today = new Date().toISOString().split('T')[0]

const teamCards = [
  { key: 'tim1', title: 'Tim 1', pic: 'Ridwan' },
  { key: 'tim2', title: 'Tim 2', pic: 'Dappa' },
  { key: 'tim3', title: 'Tim 3', pic: 'Tyo' },
  { key: 'tim4', title: 'Tim 4', pic: 'Rafly' }
]

const getInitialState = (date = today) => ({
  date,
  tim1: { odp: 0, odc: 0 },
  tim2: { odp: 0, odc: 0 },
  tim3: { odp: 0, odc: 0 },
  tim4: { odp: 0, odc: 0 },
  notes: ''
})

const formData = ref(getInitialState())
const isEditMode = ref(false)

watch(() => formData.value.date, (newDate) => {
  const existingLog = props.logs.find((l) => l.date === newDate)
  if (existingLog) {
    formData.value = JSON.parse(JSON.stringify(existingLog))
    isEditMode.value = true
  } else {
    formData.value = getInitialState(newDate)
    isEditMode.value = false
  }
}, { immediate: true })

const dailyTotals = computed(() => teamCards.reduce((acc, team) => {
  acc.odp += Number(formData.value[team.key]?.odp) || 0
  acc.odc += Number(formData.value[team.key]?.odc) || 0
  return acc
}, { odp: 0, odc: 0 }))

const handleSubmit = () => {
  emit('submit', JSON.parse(JSON.stringify(formData.value)))
}
</script>

<template>
  <article class="crud-panel">
    <div class="crud-panel__header">
      <div>
        <div class="crud-chip">
          <DatabaseZap :size="14" />
          Input Harian
        </div>
        <h3 class="crud-panel__title">Input Pencatatan Harian</h3>
        <p class="crud-panel__desc">Masukkan capaian ODP dan ODC setiap tim untuk membentuk progres harian yang rapi.</p>
      </div>

      <div class="crud-mini-stats">
        <div class="crud-mini-stat">
          <span>ODP</span>
          <strong>{{ dailyTotals.odp }}</strong>
        </div>
        <div class="crud-mini-stat crud-mini-stat--violet">
          <span>ODC</span>
          <strong>{{ dailyTotals.odc }}</strong>
        </div>
      </div>
    </div>

    <div v-if="isEditMode" class="crud-alert">
      <PencilLine :size="16" />
      <p>Data untuk tanggal ini sudah ada. Form sedang berada di mode edit dan akan menimpa data sebelumnya.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="crud-form">
      <div class="crud-date-wrap">
        <label class="crud-label">Tanggal</label>
        <div class="crud-date-box">
          <CalendarDays :size="18" class="crud-date-icon" />
          <input
            v-model="formData.date"
            type="date"
            required
            class="crud-input crud-input--date"
          >
        </div>
      </div>

      <div class="crud-team-grid">
        <article v-for="team in teamCards" :key="team.key" class="crud-team-card">
          <div class="crud-team-card__head">
            <div>
              <h4>{{ team.title }}</h4>
              <p>{{ team.pic }}</p>
            </div>
            <div class="crud-team-pill">
              {{ (Number(formData[team.key]?.odp) || 0) + (Number(formData[team.key]?.odc) || 0) }}
            </div>
          </div>

          <div class="crud-field-group">
            <label class="crud-field-label">
              <RadioTower :size="13" />
              ODP
            </label>
            <input
              v-model.number="formData[team.key].odp"
              type="number"
              min="0"
              required
              class="crud-input"
            >
          </div>

          <div class="crud-field-group">
            <label class="crud-field-label crud-field-label--violet">
              <ShieldEllipsis :size="13" />
              ODC
            </label>
            <input
              v-model.number="formData[team.key].odc"
              type="number"
              min="0"
              required
              class="crud-input"
            >
          </div>
        </article>
      </div>

      <div class="crud-notes-wrap">
        <label class="crud-label">Keterangan Harian</label>
        <textarea
          v-model="formData.notes"
          rows="3"
          class="crud-input crud-input--textarea"
          placeholder="Tuliskan catatan tambahan, lokasi pemasangan, kendala lapangan, atau update penting hari ini..."
        ></textarea>
      </div>

      <button type="submit" class="crud-submit">
        {{ isEditMode ? 'Perbarui Data Harian' : 'Simpan Data Harian' }}
      </button>
    </form>
  </article>
</template>

<style scoped>
.crud-panel {
  position: relative;
  overflow: hidden;
  border-radius: 1.55rem;
  border: 1px solid rgba(66, 108, 177, 0.28);
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 24%),
    linear-gradient(180deg, rgba(6, 18, 45, 0.98), rgba(3, 11, 30, 0.98));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 24px 48px -34px rgba(2, 6, 23, 0.94);
}

.crud-panel__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.2rem 1.2rem 0;
}

.crud-chip {
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

.crud-panel__title {
  margin-top: 0.85rem;
  font-size: 1.45rem;
  font-weight: 800;
  color: #f8fbff;
}

.crud-panel__desc {
  margin-top: 0.35rem;
  max-width: 46rem;
  color: rgba(206, 221, 249, 0.76);
  line-height: 1.55;
}

.crud-mini-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  min-width: 13rem;
}

.crud-mini-stat {
  border-radius: 1rem;
  border: 1px solid rgba(59, 103, 174, 0.28);
  background: rgba(7, 31, 69, 0.7);
  padding: 0.85rem 0.95rem;
}

.crud-mini-stat--violet {
  border-color: rgba(170, 98, 255, 0.22);
  background: rgba(28, 14, 71, 0.72);
}

.crud-mini-stat span {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(200, 219, 255, 0.74);
}

.crud-mini-stat strong {
  display: block;
  margin-top: 0.35rem;
  font-size: 1.8rem;
  font-weight: 900;
  color: #ffffff;
}

.crud-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  margin: 1rem 1.2rem 0;
  padding: 0.95rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(74, 134, 255, 0.28);
  background: rgba(17, 54, 112, 0.34);
  color: #cfe2ff;
}

.crud-alert p {
  line-height: 1.5;
}

.crud-form {
  padding: 1.2rem;
}

.crud-date-wrap,
.crud-notes-wrap {
  margin-bottom: 1.1rem;
}

.crud-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #cbddff;
}

.crud-date-box {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  max-width: 20rem;
  border-radius: 1rem;
  border: 1px solid rgba(76, 116, 184, 0.32);
  background: rgba(6, 23, 56, 0.72);
  padding: 0 0.9rem;
}

.crud-date-icon {
  color: #8fbbff;
}

.crud-team-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.1rem;
}

.crud-team-card {
  border-radius: 1.2rem;
  border: 1px solid rgba(68, 108, 173, 0.26);
  background:
    linear-gradient(180deg, rgba(11, 27, 58, 0.84), rgba(7, 18, 42, 0.84));
  padding: 1rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.crud-team-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.crud-team-card__head h4 {
  font-size: 1.05rem;
  font-weight: 800;
  color: #ffffff;
}

.crud-team-card__head p {
  margin-top: 0.2rem;
  color: rgba(200, 217, 248, 0.72);
}

.crud-team-pill {
  display: inline-flex;
  min-width: 2.5rem;
  justify-content: center;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  background: rgba(38, 96, 196, 0.22);
  color: #a9cfff;
  font-weight: 800;
}

.crud-field-group + .crud-field-group {
  margin-top: 0.85rem;
}

.crud-field-label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.45rem;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #9fc8ff;
}

.crud-field-label--violet {
  color: #d5b0ff;
}

.crud-input {
  width: 100%;
  border-radius: 0.9rem;
  border: 1px solid rgba(91, 129, 194, 0.3);
  background: rgba(3, 15, 39, 0.88);
  padding: 0.8rem 0.9rem;
  color: #f8fbff;
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
}

.crud-input:focus {
  border-color: rgba(74, 144, 255, 0.66);
  box-shadow: 0 0 0 4px rgba(36, 93, 190, 0.18);
  background: rgba(5, 21, 52, 0.96);
}

.crud-input::placeholder {
  color: rgba(173, 193, 232, 0.58);
}

.crud-input--date {
  border: 0;
  background: transparent;
  padding-left: 0;
  box-shadow: none;
}

.crud-input--date:focus {
  background: transparent;
  box-shadow: none;
}

.crud-input--textarea {
  min-height: 6.75rem;
  resize: vertical;
}

.crud-submit {
  width: 100%;
  border-radius: 1rem;
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 46%, #06b6d4 100%);
  padding: 0.95rem 1.2rem;
  font-size: 1rem;
  font-weight: 800;
  color: #ffffff;
  box-shadow: 0 18px 34px -20px rgba(37, 99, 235, 0.82);
  transition: transform 0.18s ease, filter 0.18s ease;
}

.crud-submit:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

@media (max-width: 1100px) {
  .crud-team-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .crud-panel__header {
    flex-direction: column;
  }

  .crud-mini-stats {
    min-width: 0;
  }

  .crud-team-grid {
    grid-template-columns: 1fr;
  }
}
</style>
