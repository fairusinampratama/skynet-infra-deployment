<script setup>
import { useDashboard } from '../composables/useDashboard'
import SummaryCards from '../components/SummaryCards.vue'
import ProgressCharts from '../components/ProgressCharts.vue'
import TeamRekapTable from '../components/TeamRekapTable.vue'

const {
  TARGET_ODP,
  TARGET_ODC,
  TOTAL_TARGET,
  totalOdp,
  totalOdc,
  totalInstalled,
  progressPercent,
  remainingDays,
  chartData,
  teamTotals
} = useDashboard()
</script>

<template>
  <div class="space-y-8">
    <!-- Summary Cards -->
    <section>
      <SummaryCards 
        :target="TOTAL_TARGET"
        :target-odp="TARGET_ODP"
        :target-odc="TARGET_ODC"
        :installed="totalInstalled"
        :installed-odp="totalOdp"
        :installed-odc="totalOdc"
        :progress="progressPercent"
        :days-remaining="remainingDays"
      />
    </section>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Left Column: Rekap Table -->
      <div class="xl:col-span-1">
        <TeamRekapTable 
          :team-totals="teamTotals"
          :target-odp="TARGET_ODP"
          :target-odc="TARGET_ODC"
        />
      </div>

      <!-- Right Column: Charts -->
      <div class="xl:col-span-2">
        <ProgressCharts 
          :labels="chartData.labels"
          :odp-data="chartData.odpData"
          :odc-data="chartData.odcData"
          :target-odp="TARGET_ODP"
          :target-odc="TARGET_ODC"
        />
      </div>
    </div>
  </div>
</template>
