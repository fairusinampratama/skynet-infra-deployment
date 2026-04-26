<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { KeyRound, ShieldCheck } from 'lucide-vue-next'

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

const focusInput = () => {
  setTimeout(() => inputRef.value?.focus(), 100)
}

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

const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  if (props.isOpen) focusInput()
})

watch(() => props.isOpen, (open) => {
  if (open) focusInput()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="pin-modal">
      <div v-if="isOpen" class="pin-overlay">
        <div class="pin-backdrop" @click="handleClose"></div>

        <div class="pin-dialog" role="dialog" aria-labelledby="pin-modal-title">
          <div class="pin-dialog__shine"></div>

          <div class="pin-dialog__header">
            <div class="pin-icon-shell">
              <ShieldCheck class="pin-icon-shell__icon" :size="30" />
            </div>
            <h2 id="pin-modal-title">Akses Terbatas</h2>
            <p>Masukkan PIN admin untuk membuka halaman Pencatatan Harian.</p>
          </div>

          <form @submit.prevent="handleSubmit" class="pin-form">
            <label class="pin-label">
              <KeyRound :size="14" />
              PIN Admin
            </label>
            <input
              ref="inputRef"
              v-model="pin"
              type="password"
              maxlength="4"
              inputmode="numeric"
              pattern="[0-9]*"
              class="pin-input"
              :class="{ 'pin-input--error': error }"
              placeholder="••••"
            >

            <p v-if="error" class="pin-error">{{ error }}</p>

            <button
              type="submit"
              :disabled="isLoading || pin.length === 0"
              class="pin-submit"
            >
              {{ isLoading ? 'Memverifikasi...' : 'Buka Akses' }}
            </button>
          </form>

          <p class="pin-footnote">Hanya admin yang berwenang yang dapat mengakses area ini.</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.pin-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pin-backdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top, rgba(37, 99, 235, 0.22), transparent 38%),
    rgba(2, 6, 23, 0.74);
  backdrop-filter: blur(10px);
}

.pin-dialog {
  position: relative;
  width: 100%;
  max-width: 24rem;
  overflow: hidden;
  border-radius: 1.55rem;
  border: 1px solid rgba(71, 116, 199, 0.32);
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 25%),
    linear-gradient(180deg, rgba(7, 20, 48, 0.98), rgba(2, 10, 30, 0.98));
  padding: 1.5rem;
  color: #f8fbff;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 28px 60px -34px rgba(2, 6, 23, 0.96);
}

.pin-dialog__shine {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), transparent 28%, transparent 70%, rgba(255, 255, 255, 0.04));
}

.pin-dialog__header {
  position: relative;
  text-align: center;
}

.pin-icon-shell {
  display: flex;
  width: 4.2rem;
  height: 4.2rem;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  border-radius: 1.25rem;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.28), rgba(6, 182, 212, 0.2));
  border: 1px solid rgba(120, 168, 255, 0.24);
}

.pin-icon-shell__icon {
  color: #d7e7ff;
}

.pin-dialog__header h2 {
  font-size: 1.45rem;
  font-weight: 900;
}

.pin-dialog__header p {
  margin-top: 0.45rem;
  line-height: 1.6;
  color: rgba(205, 220, 248, 0.76);
}

.pin-form {
  position: relative;
  margin-top: 1.2rem;
}

.pin-label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.55rem;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #a9cfff;
}

.pin-input {
  width: 100%;
  border-radius: 1rem;
  border: 1px solid rgba(88, 128, 194, 0.3);
  background: rgba(4, 17, 41, 0.88);
  padding: 0.95rem 1rem;
  text-align: center;
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: 0.4em;
  color: #ffffff;
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.pin-input:focus {
  border-color: rgba(74, 144, 255, 0.66);
  box-shadow: 0 0 0 4px rgba(36, 93, 190, 0.18);
}

.pin-input--error {
  border-color: rgba(255, 112, 117, 0.56);
  box-shadow: 0 0 0 4px rgba(163, 39, 53, 0.14);
}

.pin-error {
  margin-top: 0.7rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffb4b7;
  text-align: center;
}

.pin-submit {
  width: 100%;
  margin-top: 1rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 46%, #06b6d4 100%);
  padding: 0.95rem 1.2rem;
  font-weight: 800;
  color: #ffffff;
  box-shadow: 0 18px 34px -20px rgba(37, 99, 235, 0.82);
  transition: transform 0.18s ease, filter 0.18s ease, opacity 0.18s ease;
}

.pin-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

.pin-submit:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.pin-footnote {
  position: relative;
  margin-top: 1rem;
  text-align: center;
  color: rgba(182, 201, 235, 0.58);
  font-size: 0.8rem;
}

.pin-modal-enter-active,
.pin-modal-leave-active {
  transition: opacity 0.2s ease;
}

.pin-modal-enter-active .pin-dialog,
.pin-modal-leave-active .pin-dialog {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.pin-modal-enter-from,
.pin-modal-leave-to {
  opacity: 0;
}

.pin-modal-enter-from .pin-dialog,
.pin-modal-leave-to .pin-dialog {
  transform: scale(0.96);
  opacity: 0;
}
</style>
