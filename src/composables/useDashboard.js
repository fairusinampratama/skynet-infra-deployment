import { computed, ref, onMounted } from 'vue'
import * as xlsx from 'xlsx'

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

  const importData = async (jsonData) => {
    try {
      const parsedData = JSON.parse(jsonData)
      if (Array.isArray(parsedData)) {
        // Sequentially post all imported data to the API
        for (const log of parsedData) {
          await addLog(log)
        }
        return true
      }
      return false
    } catch (e) {
      console.error('Invalid JSON format or failed to import', e)
      return false
    }
  }

  const exportData = () => {
    // 1. Create "Daily ODP & ODC" Sheet
    const dailyData = []
    
    // Header for Daily Sheet
    dailyData.push([
      'Hari', 'Tanggal', 
      'Tim 1\r\n(ODP)', 'Tim 1\r\n(ODC)', 
      'Tim 2\r\n(ODP)', 'Tim 2\r\n(ODC)', 
      'Tim 3\r\n(ODP)', 'Tim 3\r\n(ODC)', 
      'Tim 4\r\n(ODP)', 'Tim 4\r\n(ODC)', 
      'Total Harian\r\n(ODP)\r\nTarget : 365 BOX', 'Total Harian\r\n(ODC)\r\nTarget : 46 BOX', 
      'Akumulasi\r\n(ODP)', 'Akumulasi\r\n(ODC)', 
      'Progress\r\nODP (%)', 'Progress\r\nODC (%)', 
      'Keterangan'
    ])
    
    let accOdp = 0
    let accOdc = 0

    logs.value.forEach((log, index) => {
      const date = new Date(log.date)
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear().toString().substr(-2)}`
      
      const t1odp = Number(log.tim1?.odp) || 0
      const t1odc = Number(log.tim1?.odc) || 0
      const t2odp = Number(log.tim2?.odp) || 0
      const t2odc = Number(log.tim2?.odc) || 0
      const t3odp = Number(log.tim3?.odp) || 0
      const t3odc = Number(log.tim3?.odc) || 0
      const t4odp = Number(log.tim4?.odp) || 0
      const t4odc = Number(log.tim4?.odc) || 0

      const dailyOdp = t1odp + t2odp + t3odp + t4odp
      const dailyOdc = t1odc + t2odc + t3odc + t4odc
      
      accOdp += dailyOdp
      accOdc += dailyOdc

      dailyData.push([
        index,
        formattedDate, // Just basic formatting to mimic excel
        t1odp, t1odc,
        t2odp, t2odc,
        t3odp, t3odc,
        t4odp, t4odc,
        dailyOdp, dailyOdc,
        accOdp, accOdc,
        accOdp / TARGET_ODP,
        accOdc / TARGET_ODC,
        log.notes || ''
      ])
    })

    // 2. Create "Rekap ODP & ODC" Sheet
    const rekapData = []
    rekapData.push(['REKAP TOTAL\r\n(Pembangunan ODP & ODC RA Skynet)'])
    rekapData.push([])
    rekapData.push(['', '', '', '', new Date().toISOString().split('T')[0]])
    rekapData.push(['TIM', 'TOTAL ODP', '% ODP(dari 365 Box)', 'TOTAL ODC', '% ODC(dari 46 Box)'])
    
    let totalTim1Odp = 0, totalTim1Odc = 0
    let totalTim2Odp = 0, totalTim2Odc = 0
    let totalTim3Odp = 0, totalTim3Odc = 0
    let totalTim4Odp = 0, totalTim4Odc = 0

    logs.value.forEach(log => {
      totalTim1Odp += Number(log.tim1?.odp) || 0; totalTim1Odc += Number(log.tim1?.odc) || 0
      totalTim2Odp += Number(log.tim2?.odp) || 0; totalTim2Odc += Number(log.tim2?.odc) || 0
      totalTim3Odp += Number(log.tim3?.odp) || 0; totalTim3Odc += Number(log.tim3?.odc) || 0
      totalTim4Odp += Number(log.tim4?.odp) || 0; totalTim4Odc += Number(log.tim4?.odc) || 0
    })

    const grandOdp = totalTim1Odp + totalTim2Odp + totalTim3Odp + totalTim4Odp
    const grandOdc = totalTim1Odc + totalTim2Odc + totalTim3Odc + totalTim4Odc

    rekapData.push([1, totalTim1Odp, totalTim1Odp / TARGET_ODP, totalTim1Odc, totalTim1Odc / TARGET_ODC])
    rekapData.push([2, totalTim2Odp, totalTim2Odp / TARGET_ODP, totalTim2Odc, totalTim2Odc / TARGET_ODC])
    rekapData.push([3, totalTim3Odp, totalTim3Odp / TARGET_ODP, totalTim3Odc, totalTim3Odc / TARGET_ODC])
    rekapData.push([4, totalTim4Odp, totalTim4Odp / TARGET_ODP, totalTim4Odc, totalTim4Odc / TARGET_ODC])
    rekapData.push(['TOTAL', grandOdp, grandOdp / TARGET_ODP, grandOdc, grandOdc / TARGET_ODC])

    rekapData.push([])
    rekapData.push(['TARGET\r\n(ODP+ODC)', 'TOTAL \r\nODP+ODC\r\n(Terpasang)', 'PROGRESS TOTAL\r\nODP+ODC\r\n(Terpasang)', 'SISA HARI'])
    rekapData.push([TOTAL_TARGET, grandOdp + grandOdc, (grandOdp + grandOdc) / TOTAL_TARGET, Math.max(TOTAL_DAYS - logs.value.length, 0)])

    // Generate workbook
    const wb = xlsx.utils.book_new()
    const wsDaily = xlsx.utils.aoa_to_sheet(dailyData)
    const wsRekap = xlsx.utils.aoa_to_sheet(rekapData)
    
    xlsx.utils.book_append_sheet(wb, wsDaily, "Daily ODP & ODC")
    xlsx.utils.book_append_sheet(wb, wsRekap, "Rekap ODP & ODC")
    
    xlsx.writeFile(wb, `Skynet_Dashboard_Export_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const teamTotals = computed(() => {
    const totals = [
      { id: 1, name: 'Tim 1', odp: 0, odc: 0 },
      { id: 2, name: 'Tim 2', odp: 0, odc: 0 },
      { id: 3, name: 'Tim 3', odp: 0, odc: 0 },
      { id: 4, name: 'Tim 4', odp: 0, odc: 0 }
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
    return Math.max(TOTAL_DAYS - logs.value.length, 0)
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
    importData,
    exportData,
    totalOdp,
    totalOdc,
    totalInstalled,
    progressPercent,
    remainingDays,
    chartData
  }
}
