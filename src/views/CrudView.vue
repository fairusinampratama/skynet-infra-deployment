<script setup>
import { useDashboard } from '../composables/useDashboard'
import DailyInputForm from '../components/DailyInputForm.vue'
import LogsTable from '../components/LogsTable.vue'

const {
  augmentedLogs,
  addLog,
  deleteLog
} = useDashboard()
</script>

<template>
  <div class="space-y-8">
    <section>
      <DailyInputForm :logs="augmentedLogs" @submit="addLog" />
    </section>
    
    <section>
      <LogsTable :logs="augmentedLogs" @delete="deleteLog" />
    </section>
  </div>
</template>
