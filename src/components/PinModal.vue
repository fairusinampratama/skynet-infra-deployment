<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Lock } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['verified', 'close'])

const pin = ref('')
const error = ref('')
const isLoading = ref(false)
const inputRef = ref(null)

const handleSubmit = async () => {
  if (pin.value.length !== 4) {
    error.value = 'PIN harus 4 digit'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const res = await fetch('/api/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: pin.value })
    })

    const data = await res.json()

    if (res.ok && data.success) {
      // Store verification in sessionStorage
      sessionStorage.setItem('pinVerified', 'true')
      sessionStorage.setItem('pinVerifiedAt', new Date().toISOString())
      emit('verified')
      pin.value = ''
    } else {
      error.value = data.message || 'PIN salah'
    }
  } catch (e) {
    error.value = 'Gagal terhubung ke server'
    console.error('PIN verification error:', e)
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  pin.value = ''
  error.value = ''
  emit('close')
}

// Focus input when modal opens
onMounted(() => {
  if (props.isOpen && inputRef.value) {
    setTimeout(() => inputRef.value?.focus(), 100)
  }
})

// Handle escape key
const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="pin-modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="handleClose"
        ></div>

        <!-- Modal -->
        <div 
          class="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4"
          role="dialog"
          aria-labelledby="pin-modal-title"
        >
          <!-- Header -->
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock class="text-blue-600" :size="32" />
            </div>
            <h2 id="pin-modal-title" class="text-xl font-bold text-gray-900">
              Akses Terbatas
            </h2>
            <p class="text-sm text-gray-500 mt-2">
              Masukkan PIN admin untuk mengakses halaman Pencatatan Harian
            </p>
          </div>

          <!-- PIN Input -->
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <input
                ref="inputRef"
                v-model="pin"
                type="password"
                maxlength="4"
                inputmode="numeric"
                pattern="[0-9]*"
                class="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="••••"
                :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-200': error }"
                @keydown="handleKeydown"
              />
            </div>

            <!-- Error Message -->
            <div v-if="error" class="text-center">
              <p class="text-sm text-red-600 font-medium">
                {{ error }}
              </p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isLoading || pin.length === 0"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-xl transition-colors focus:ring-4 focus:ring-blue-200 outline-none"
            >
              {{ isLoading ? 'Memverifikasi...' : 'Buka Akses' }}
            </button>
          </form>

          <!-- Footer -->
          <div class="mt-6 text-center">
            <p class="text-xs text-gray-400">
              Hanya admin yang berwenang yang dapat mengakses halaman ini
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.pin-modal-enter-active,
.pin-modal-leave-active {
  transition: opacity 0.2s ease;
}

.pin-modal-enter-active > div:first-child,
.pin-modal-leave-active > div:first-child {
  transition: opacity 0.2s ease;
}

.pin-modal-enter-active > div:last-child,
.pin-modal-leave-active > div:last-child {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.pin-modal-enter-from,
.pin-modal-leave-to {
  opacity: 0;
}

.pin-modal-enter-from > div:last-child,
.pin-modal-leave-to > div:last-child {
  transform: scale(0.95);
  opacity: 0;
}
</style>