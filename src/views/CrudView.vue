<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDashboard } from '../composables/useDashboard'
import DailyInputForm from '../components/DailyInputForm.vue'
import LogsTable from '../components/LogsTable.vue'
import PinModal from '../components/PinModal.vue'
import { Lock, ShieldCheck, Sparkles } from 'lucide-vue-next'

const {
  augmentedLogs,
  areaOptions,
  selectedAreaId,
  addLog,
  deleteLog
} = useDashboard()

const route = useRoute()
const router = useRouter()
const isPinVerified = ref(false)
const showPinModal = ref(false)
const verifiedAt = ref(null)
const validAreaIds = computed(() => areaOptions.value.map((area) => area.id))

const selectedCrudAreaId = computed({
  get: () => selectedAreaId.value,
  set: (areaId) => {
    selectedAreaId.value = areaId

    if (route.params.areaId !== areaId) {
      router.replace(`/crud/${areaId}`)
    }
  }
})

watch(
  () => route.params.areaId,
  (areaId) => {
    const nextAreaId = typeof areaId === 'string' ? areaId : 'randuagung'

    if (!validAreaIds.value.includes(nextAreaId)) {
      router.replace('/crud/randuagung')
      return
    }

    selectedAreaId.value = nextAreaId
  },
  { immediate: true }
)


onMounted(() => {
  const verified = sessionStorage.getItem('pinVerified')
  const verifiedTime = sessionStorage.getItem('pinVerifiedAt')

  if (verified === 'true') {
    isPinVerified.value = true
    verifiedAt.value = verifiedTime
  } else {
    showPinModal.value = true
  }
})

const isVerified = computed(() => isPinVerified.value)

const handlePinVerified = () => {
  isPinVerified.value = true
  verifiedAt.value = new Date().toISOString()
  showPinModal.value = false
}

const handlePinClose = () => {
  if (!isPinVerified.value) return
  showPinModal.value = false
}

const handleLogout = () => {
  sessionStorage.removeItem('pinVerified')
  sessionStorage.removeItem('pinVerifiedAt')
  isPinVerified.value = false
  verifiedAt.value = null
  showPinModal.value = true
}

const formatVerifiedTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date)
}
</script>

<template>
  <div class="crud-view">
    <PinModal
      :is-open="showPinModal"
      @verified="handlePinVerified"
      @close="handlePinClose"
    />

    <section class="crud-hero">
      <div>
        <div class="crud-hero__chip">
          <Sparkles :size="14" />
          Area Admin
        </div>
        <h2 class="crud-hero__title">Pencatatan Harian Proyek</h2>
        <p class="crud-hero__desc">Kelola input instalasi lapangan, revisi data per tanggal, dan pantau histori progres dari satu workspace yang lebih fokus.</p>
      </div>

      <div v-if="isVerified" class="crud-status">
        <div class="crud-status__icon">
          <ShieldCheck :size="20" />
        </div>
        <div>
          <p>Mode Admin Aktif</p>
          <span v-if="verifiedAt">{{ formatVerifiedTime(verifiedAt) }} WIB</span>
        </div>
        <button @click="handleLogout" class="crud-status__logout">Keluar</button>
      </div>
    </section>

    <template v-if="isVerified">
      <section>
        <DailyInputForm
          :logs="augmentedLogs"
          :area-options="areaOptions"
          v-model:selected-area-id="selectedCrudAreaId"
          @submit="addLog"
        />
      </section>

      <section>
        <LogsTable :logs="augmentedLogs" @delete="deleteLog" />
      </section>
    </template>

    <div v-else class="crud-locked">
      <div class="crud-locked__icon">
        <Lock :size="40" />
      </div>
      <h3>Akses Terbatas</h3>
      <p>Halaman Pencatatan Harian hanya bisa dibuka setelah verifikasi PIN admin berhasil.</p>
      <button @click="showPinModal = true" class="crud-locked__button">Masukkan PIN</button>
    </div>
  </div>
</template>

<style scoped>
.crud-view {
  display: grid;
  gap: 1.2rem;
}

.crud-hero {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.25rem 1.35rem;
  border-radius: 1.6rem;
  border: 1px solid rgba(69, 114, 191, 0.26);
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 24%),
    linear-gradient(180deg, rgba(6, 18, 45, 0.98), rgba(3, 11, 30, 0.98));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 24px 48px -34px rgba(2, 6, 23, 0.94);
}

.crud-hero__chip {
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

.crud-hero__title {
  margin-top: 0.85rem;
  font-size: 1.9rem;
  font-weight: 900;
  color: #f8fbff;
}

.crud-hero__desc {
  margin-top: 0.4rem;
  max-width: 48rem;
  color: rgba(206, 221, 249, 0.76);
  line-height: 1.55;
}

.crud-status {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.8rem;
  align-items: center;
  min-width: 18rem;
  border-radius: 1.15rem;
  border: 1px solid rgba(60, 176, 131, 0.22);
  background: rgba(7, 52, 43, 0.72);
  padding: 0.8rem 0.9rem;
}

.crud-status__icon {
  display: inline-flex;
  width: 2.45rem;
  height: 2.45rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.9rem;
  background: rgba(30, 139, 101, 0.18);
  color: #bdf4dd;
}

.crud-status p {
  font-weight: 800;
  color: #edfff8;
}

.crud-status span {
  display: block;
  margin-top: 0.15rem;
  color: rgba(188, 240, 217, 0.78);
  font-size: 0.82rem;
}

.crud-status__logout {
  color: #d4fff0;
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: underline;
}

.crud-locked {
  padding: 2.4rem 1.5rem;
  border-radius: 1.6rem;
  border: 1px solid rgba(69, 114, 191, 0.26);
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 24%),
    linear-gradient(180deg, rgba(6, 18, 45, 0.98), rgba(3, 11, 30, 0.98));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 24px 48px -34px rgba(2, 6, 23, 0.94);
  text-align: center;
}

.crud-locked__icon {
  display: flex;
  width: 5.4rem;
  height: 5.4rem;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.2rem;
  border-radius: 1.5rem;
  background: rgba(13, 31, 69, 0.74);
  color: rgba(198, 219, 255, 0.8);
}

.crud-locked h3 {
  font-size: 1.4rem;
  font-weight: 900;
  color: #ffffff;
}

.crud-locked p {
  max-width: 33rem;
  margin: 0.55rem auto 0;
  color: rgba(205, 220, 248, 0.74);
  line-height: 1.6;
}

.crud-locked__button {
  margin-top: 1.2rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 46%, #06b6d4 100%);
  padding: 0.9rem 1.5rem;
  color: #ffffff;
  font-weight: 800;
  box-shadow: 0 18px 34px -20px rgba(37, 99, 235, 0.82);
}

@media (max-width: 900px) {
  .crud-hero {
    flex-direction: column;
  }

  .crud-status {
    min-width: 0;
    width: 100%;
  }
}
</style>
