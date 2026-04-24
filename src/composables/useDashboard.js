import { computed, ref, onMounted } from 'vue'

const logs = ref([])

export function useDashboard() {
  const TARGET_ODP = 365
  const TARGET_ODC = 46
  const TOTAL_TARGET = 411
  const TOTAL_DAYS = 12

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs')
      if (res.ok) {
        logs.value = await res.json()
      }
    } catch (e) {
      console.error('Failed to fetch logs:', e)
    }
  }

  // Fetch logs when composable is used (typically in App.vue or router views)
  onMounted(() => {
    fetchLogs()
  })

  const addLog = async (log) => {
    try {
      const newLog = {
        id: log.id || Date.now().toString(),
        ...log
      }
      
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
      })
      
      if (res.ok) {
        // Optimistic UI update
        const existingIndex = logs.value.findIndex(l => l.date === log.date)
        if (existingIndex !== -1) {
          logs.value[existingIndex] = newLog
        } else {
          logs.value.push(newLog)
        }
        logs.value.sort((a, b) => new Date(a.date) - new Date(b.date))
      }
    } catch (e) {
      console.error('Failed to save log:', e)
    }
  }
  
  const updateLog = async (id, log) => {
    await addLog({ id, ...log })
  }

  const deleteLog = async (id) => {
    try {
      const res = await fetch(`/api/logs/${id}`, { method: 'DELETE' })
      if (res.ok) {
        logs.value = logs.value.filter(l => l.id !== id)
      }
    } catch (e) {
      console.error('Failed to delete log:', e)
    }
  }

  const teamTotals = computed(() => {
    const totals = [
      { id: 1, name: 'Tim 1', pic: 'Ridwan', odp: 0, odc: 0 },
      { id: 2, name: 'Tim 2', pic: 'Dappa', odp: 0, odc: 0 },
      { id: 3, name: 'Tim 3', pic: 'Tyo', odp: 0, odc: 0 },
      { id: 4, name: 'Tim 4', pic: 'Baim', odp: 0, odc: 0 }
    ]
    logs.value.forEach(log => {
      totals[0].odp += Number(log.tim1?.odp) || 0
      totals[0].odc += Number(log.tim1?.odc) || 0
      totals[1].odp += Number(log.tim2?.odp) || 0
      totals[1].odc += Number(log.tim2?.odc) || 0
      totals[2].odp += Number(log.tim3?.odp) || 0
      totals[2].odc += Number(log.tim3?.odc) || 0
      totals[3].odp += Number(log.tim4?.odp) || 0
      totals[3].odc += Number(log.tim4?.odc) || 0
    })
    return totals
  })

  const totalOdp = computed(() => {
    return teamTotals.value.reduce((sum, t) => sum + t.odp, 0)
  })

  const totalOdc = computed(() => {
    return teamTotals.value.reduce((sum, t) => sum + t.odc, 0)
  })

  const totalInstalled = computed(() => {
    return totalOdp.value + totalOdc.value
  })

  const progressPercent = computed(() => {
    const percent = (totalInstalled.value / TOTAL_TARGET) * 100
    return Math.min(Math.round(percent * 10) / 10, 100)
  })

  const remainingDays = computed(() => {
    // logs.value.length includes Day 0.
    // The current actual progress day is logs.value.length - 1
    const currentDay = Math.max(logs.value.length - 1, 0)
    return Math.max(TOTAL_DAYS - currentDay, 0)
  })

  const chartData = computed(() => {
    const labels = logs.value.map(log => log.date)
    const odpData = []
    const odcData = []
    
    let currentOdp = 0
    let currentOdc = 0

    logs.value.forEach(log => {
      const dailyOdp = (Number(log.tim1?.odp)||0) + (Number(log.tim2?.odp)||0) + (Number(log.tim3?.odp)||0) + (Number(log.tim4?.odp)||0)
      const dailyOdc = (Number(log.tim1?.odc)||0) + (Number(log.tim2?.odc)||0) + (Number(log.tim3?.odc)||0) + (Number(log.tim4?.odc)||0)
      
      currentOdp += dailyOdp
      currentOdc += dailyOdc
      odpData.push(currentOdp)
      odcData.push(currentOdc)
    })

    return { labels, odpData, odcData }
  })
  
  const augmentedLogs = computed(() => {
    let accOdp = 0
    let accOdc = 0
    return logs.value.map((log, index) => {
      const dailyOdp = (Number(log.tim1?.odp)||0) + (Number(log.tim2?.odp)||0) + (Number(log.tim3?.odp)||0) + (Number(log.tim4?.odp)||0)
      const dailyOdc = (Number(log.tim1?.odc)||0) + (Number(log.tim2?.odc)||0) + (Number(log.tim3?.odc)||0) + (Number(log.tim4?.odc)||0)
      
      accOdp += dailyOdp
      accOdc += dailyOdc
      
      return {
        ...log,
        hariIndex: index,
        dailyOdp,
        dailyOdc,
        accOdp,
        accOdc,
        progressOdp: accOdp / TARGET_ODP,
        progressOdc: accOdc / TARGET_ODC
      }
    })
  })

  return {
    TARGET_ODP,
    TARGET_ODC,
    TOTAL_TARGET,
    TOTAL_DAYS,
    logs,
    augmentedLogs,
    teamTotals,
    addLog,
    updateLog,
    deleteLog,
    totalOdp,
    totalOdc,
    totalInstalled,
    progressPercent,
    remainingDays,
    chartData
  }
}
