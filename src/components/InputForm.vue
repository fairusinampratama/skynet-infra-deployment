<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit'])

const today = new Date().toISOString().split('T')[0]

const formData = ref({
  date: today,
  team: 'Tim 1 (Riduwan)',
  odp: 0,
  odc: 0,
  notes: ''
})

const teams = [
  'Tim 1 (Riduwan)',
  'Tim 2 (Daffa)',
  'Tim 3 (Mr. Sukun)',
  'Tim 4 (Rafly)',
  'Tim 5 (Mr.X)'
]

const handleSubmit = () => {
  emit('submit', { ...formData.value })
  // Reset numeric fields, keep date and team
  formData.value.odp = 0
  formData.value.odc = 0
  formData.value.notes = ''
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
      <h3 class="font-semibold text-gray-800">Input Data Harian</h3>
    </div>
    
    <form @submit.prevent="handleSubmit" class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
          <input 
            type="date" 
            v-model="formData.date" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tim Installer</label>
          <select 
            v-model="formData.team"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          >
            <option v-for="team in teams" :key="team" :value="team">{{ team }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Total ODP</label>
          <input 
            type="number" 
            v-model.number="formData.odp" 
            min="0"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Total ODC</label>
          <input 
            type="number" 
            v-model.number="formData.odc" 
            min="0"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          >
        </div>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">Keterangan (Opsional)</label>
        <textarea 
          v-model="formData.notes" 
          rows="2"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          placeholder="Tuliskan catatan tambahan jika ada..."
        ></textarea>
      </div>

      <button 
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:ring-4 focus:ring-blue-200 outline-none"
      >
        Simpan Data
      </button>
    </form>
  </div>
</template>
