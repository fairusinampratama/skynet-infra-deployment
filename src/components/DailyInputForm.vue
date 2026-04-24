<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  logs: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['submit'])

const today = new Date().toISOString().split('T')[0]

const getInitialState = (date = today) => ({
  date: date,
  tim1: { odp: 0, odc: 0 },
  tim2: { odp: 0, odc: 0 },
  tim3: { odp: 0, odc: 0 },
  tim4: { odp: 0, odc: 0 },
  notes: ''
})

const formData = ref(getInitialState())
const isEditMode = ref(false)

// Dinamis: Ketika tanggal berubah, periksa apakah data untuk tanggal tersebut sudah ada
watch(() => formData.value.date, (newDate) => {
  const existingLog = props.logs.find(l => l.date === newDate)
  if (existingLog) {
    // Jika data ada, isi form dengan data tersebut
    formData.value = JSON.parse(JSON.stringify(existingLog))
    isEditMode.value = true
  } else {
    // Jika tidak ada, reset form tetapi pertahankan tanggal
    formData.value = getInitialState(newDate)
    isEditMode.value = false
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('submit', JSON.parse(JSON.stringify(formData.value)))
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
      <h3 class="font-semibold text-gray-800">Input Pencatatan Harian</h3>
    </div>
    
    <div v-if="isEditMode" class="bg-blue-50 border-l-4 border-blue-500 p-4 mx-6 mt-6 rounded-r-lg">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-blue-700 font-medium">
            📝 Data untuk tanggal ini sudah ada. Anda sedang dalam mode Edit.
          </p>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="p-6">
      <div class="mb-6 max-w-xs">
        <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
        <input 
          type="date" 
          v-model="formData.date" 
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
        >
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <!-- Tim 1 -->
        <div class="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100 transition-colors focus-within:bg-blue-50/30 focus-within:border-blue-100">
          <h4 class="font-medium text-gray-800">Tim 1 <span class="text-sm font-normal text-gray-500">(Ridwan)</span></h4>
          <div>
            <label class="block text-xs text-gray-500 mb-1">ODP</label>
            <input type="number" v-model.number="formData.tim1.odp" min="0" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-shadow">
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">ODC</label>
            <input type="number" v-model.number="formData.tim1.odc" min="0" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 outline-none transition-shadow">
          </div>
        </div>

        <!-- Tim 2 -->
        <div class="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100 transition-colors focus-within:bg-blue-50/30 focus-within:border-blue-100">
          <h4 class="font-medium text-gray-800">Tim 2 <span class="text-sm font-normal text-gray-500">(Dappa)</span></h4>
          <div>
            <label class="block text-xs text-gray-500 mb-1">ODP</label>
            <input type="number" v-model.number="formData.tim2.odp" min="0" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-shadow">
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">ODC</label>
            <input type="number" v-model.number="formData.tim2.odc" min="0" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 outline-none transition-shadow">
          </div>
        </div>

        <!-- Tim 3 -->
        <div class="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100 transition-colors focus-within:bg-blue-50/30 focus-within:border-blue-100">
          <h4 class="font-medium text-gray-800">Tim 3 <span class="text-sm font-normal text-gray-500">(Tyo)</span></h4>
          <div>
            <label class="block text-xs text-gray-500 mb-1">ODP</label>
            <input type="number" v-model.number="formData.tim3.odp" min="0" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-shadow">
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">ODC</label>
            <input type="number" v-model.number="formData.tim3.odc" min="0" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 outline-none transition-shadow">
          </div>
        </div>

        <!-- Tim 4 -->
        <div class="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100 transition-colors focus-within:bg-blue-50/30 focus-within:border-blue-100">
          <h4 class="font-medium text-gray-800">Tim 4 <span class="text-sm font-normal text-gray-500">(Baim)</span></h4>
          <div>
            <label class="block text-xs text-gray-500 mb-1">ODP</label>
            <input type="number" v-model.number="formData.tim4.odp" min="0" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-shadow">
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">ODC</label>
            <input type="number" v-model.number="formData.tim4.odc" min="0" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 outline-none transition-shadow">
          </div>
        </div>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">Keterangan Harian (Opsional)</label>
        <textarea 
          v-model="formData.notes" 
          rows="2"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          placeholder="Tuliskan catatan tambahan (misal: Pemasangan Tim 1 di RW 1, dll)..."
        ></textarea>
      </div>

      <button 
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:ring-4 focus:ring-blue-200 outline-none"
      >
        Simpan Data Harian
      </button>
    </form>
  </div>
</template>
