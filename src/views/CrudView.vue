<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDashboard } from '../composables/useDashboard'
import DailyInputForm from '../components/DailyInputForm.vue'
import LogsTable from '../components/LogsTable.vue'
import PinModal from '../components/PinModal.vue'
import { Lock } from 'lucide-vue-next'

const {
  augmentedLogs,
  addLog,
  deleteLog
} = useDashboard()

// PIN verification state
const isPinVerified = ref(false)
const showPinModal = ref(false)
const verifiedAt = ref(null)

// Check if PIN is already verified in session
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
  // If not verified, keep modal open (user must enter PIN or navigate away)
  if (!isPinVerified.value) {
    // Don't close - user needs to enter PIN
    return
  }
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
  <div class="space-y-8">
    <!-- PIN Modal -->
    <PinModal 
      :is-open="showPinModal" 
      @verified="handlePinVerified"
      @close="handlePinClose"
    />

    <!-- Verified Status Banner -->
    <div v-if="isVerified" class="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Lock class="text-emerald-600" :size="18" />
        <span class="text-sm text-emerald-800 font-medium">
          Mode Admin Aktif
        </span>
        <span v-if="verifiedAt" class="text-xs text-emerald-600">
          ({{ formatVerifiedTime(verifiedAt) }})
        </span>
      </div>
      <button
        @click="handleLogout"
        class="text-xs text-emerald-600 hover:text-emerald-800 font-medium underline"
      >
        Keluar
      </button>
    </div>

    <!-- Main Content (only shown when verified) -->
    <section v-if="isVerified">
      <DailyInputForm :logs="augmentedLogs" @submit="addLog" />
    </section>
    
    <section v-if="isVerified">
      <LogsTable :logs="augmentedLogs" @delete="deleteLog" />
    </section>

    <!-- Locked Message (shown when not verified) -->
    <div v-if="!isVerified" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Lock class="text-gray-400" :size="40" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">
        Akses Terbatas
      </h3>
      <p class="text-gray-500 mb-6 max-w-md mx-auto">
        Halaman Pencatatan Harian hanya dapat diakses oleh admin yang berwenang. 
        Silakan masukkan PIN untuk melanjutkan.
      </p>
      <button
        @click="showPinModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
      >
        Masukkan PIN
      </button>
    </div>
  </div>
</template>
