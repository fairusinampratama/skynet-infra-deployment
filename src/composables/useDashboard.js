import { computed, ref, onMounted } from 'vue'

const logs = ref([])
const hasFetchedLogs = ref(false)
const fetchLogsFailed = ref(false)

const SHOWCASE_TEAMS = [
  { id: 1, name: 'Tim 1', pic: 'Ridwan', odp: 26, odc: 2, totalInstalled: 28 },
  { id: 3, name: 'Tim 3', pic: 'Tyo', odp: 24, odc: 3, totalInstalled: 27 },
  { id: 2, name: 'Tim 2', pic: 'Dappa', odp: 20, odc: 1, totalInstalled: 21 },
  { id: 4, name: 'Tim 4', pic: 'Rafly', odp: 4, odc: 1, totalInstalled: 5 }
]

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
        fetchLogsFailed.value = false
      } else {
        fetchLogsFailed.value = true
      }
    } catch (e) {
      fetchLogsFailed.value = true
      console.error('Failed to fetch logs:', e)
    } finally {
      hasFetchedLogs.value = true
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

  const emptyTeams = [
    { id: 1, name: 'Tim 1', pic: 'Ridwan', odp: 0, odc: 0, totalInstalled: 0 },
    { id: 2, name: 'Tim 2', pic: 'Dappa', odp: 0, odc: 0, totalInstalled: 0 },
    { id: 3, name: 'Tim 3', pic: 'Tyo', odp: 0, odc: 0, totalInstalled: 0 },
    { id: 4, name: 'Tim 4', pic: 'Rafly', odp: 0, odc: 0, totalInstalled: 0 }
  ]

  const teamTotals = computed(() => {
    if (!logs.value.length) {
      return fetchLogsFailed.value ? emptyTeams : [...SHOWCASE_TEAMS].sort((a, b) => a.id - b.id)
    }

    const totals = [
      { id: 1, name: 'Tim 1', pic: 'Ridwan', odp: 0, odc: 0 },
      { id: 2, name: 'Tim 2', pic: 'Dappa', odp: 0, odc: 0 },
      { id: 3, name: 'Tim 3', pic: 'Tyo', odp: 0, odc: 0 },
      { id: 4, name: 'Tim 4', pic: 'Rafly', odp: 0, odc: 0 }
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
    return totals.map((team) => ({
      ...team,
      totalInstalled: team.odp + team.odc
    }))
  })

  const teamRankings = computed(() => {
    if (!logs.value.length) {
      const sourceTeams = fetchLogsFailed.value ? emptyTeams : SHOWCASE_TEAMS

      return sourceTeams.map((team, index, arr) => ({
        ...team,
        rank: index + 1,
        previousRank: index + 1,
        rankChange: 0,
        trendDelta: 0,
        currentDaily: 0,
        previousDaily: 0,
        badges: [],
        gapToAbove: index > 0 ? arr[index - 1].totalInstalled - team.totalInstalled : 0,
        leadOverNext: index < arr.length - 1 ? team.totalInstalled - arr[index + 1].totalInstalled : 0
      }))
    }

    const teamKeys = ['tim1', 'tim2', 'tim3', 'tim4']

    const latestLog = logs.value[logs.value.length - 1] ?? null
    const previousLog = logs.value[logs.value.length - 2] ?? null

    const previousTotals = [
      { totalInstalled: 0, odp: 0, odc: 0 },
      { totalInstalled: 0, odp: 0, odc: 0 },
      { totalInstalled: 0, odp: 0, odc: 0 },
      { totalInstalled: 0, odp: 0, odc: 0 }
    ]

    logs.value.slice(0, -1).forEach((log) => {
      teamKeys.forEach((key, index) => {
        previousTotals[index].odp += Number(log[key]?.odp) || 0
        previousTotals[index].odc += Number(log[key]?.odc) || 0
        previousTotals[index].totalInstalled =
          previousTotals[index].odp + previousTotals[index].odc
      })
    })

    const previousRankingMap = [...teamTotals.value]
      .map((team, index) => ({
        id: team.id,
        name: team.name,
        pic: team.pic,
        odp: previousTotals[index].odp,
        odc: previousTotals[index].odc,
        totalInstalled: previousTotals[index].totalInstalled
      }))
      .sort((a, b) => {
        if (b.totalInstalled !== a.totalInstalled) return b.totalInstalled - a.totalInstalled
        if (b.odp !== a.odp) return b.odp - a.odp
        return b.odc - a.odc
      })
      .reduce((acc, team, index) => {
        acc[team.id] = index + 1
        return acc
      }, {})

    const maxOdp = Math.max(...teamTotals.value.map((team) => team.odp), 0)
    const maxOdc = Math.max(...teamTotals.value.map((team) => team.odc), 0)

    const latestDayTotals = teamKeys.map((key) => ({
      totalInstalled: ((Number(latestLog?.[key]?.odp) || 0) + (Number(latestLog?.[key]?.odc) || 0)),
      odp: Number(latestLog?.[key]?.odp) || 0,
      odc: Number(latestLog?.[key]?.odc) || 0
    }))

    const previousDayTotals = teamKeys.map((key) => ({
      totalInstalled: ((Number(previousLog?.[key]?.odp) || 0) + (Number(previousLog?.[key]?.odc) || 0)),
      odp: Number(previousLog?.[key]?.odp) || 0,
      odc: Number(previousLog?.[key]?.odc) || 0
    }))

    const momentumValues = latestDayTotals.map((team, index) => team.totalInstalled - previousDayTotals[index].totalInstalled)
    const maxMomentum = Math.max(...momentumValues, 0)

    const rankedTeams = [...teamTotals.value]
      .sort((a, b) => {
        if (b.totalInstalled !== a.totalInstalled) return b.totalInstalled - a.totalInstalled
        if (b.odp !== a.odp) return b.odp - a.odp
        return b.odc - a.odc
      })
      .map((team, index) => ({
        ...team,
        rank: index + 1
      }))

    return rankedTeams.map((team) => {
      const teamIndex = team.id - 1
      const currentDaily = latestDayTotals[teamIndex]?.totalInstalled || 0
      const previousDaily = previousDayTotals[teamIndex]?.totalInstalled || 0
      const trendDelta = currentDaily - previousDaily
      const previousRank = previousRankingMap[team.id] ?? team.rank
      const rankChange = previousRank - team.rank
      const badges = []

      if (team.odp > 0 && team.odp === maxOdp) badges.push('ODP Terbanyak')
      if (team.odc > 0 && team.odc === maxOdc) badges.push('ODC Terbanyak')
      if (trendDelta > 0 && trendDelta === maxMomentum) badges.push('Momentum Terbaik')

      return {
        ...team,
        previousRank,
        rankChange,
        trendDelta,
        currentDaily,
        previousDaily,
        badges
      }
    }).map((team, index, arr) => {
      const teamAbove = arr[index - 1] ?? null
      const teamBelow = arr[index + 1] ?? null

      return {
        ...team,
        gapToAbove: teamAbove ? teamAbove.totalInstalled - team.totalInstalled : 0,
        leadOverNext: teamBelow ? team.totalInstalled - teamBelow.totalInstalled : 0
      }
    })
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

  const remainingOdp = computed(() => Math.max(TARGET_ODP - totalOdp.value, 0))
  const remainingOdc = computed(() => Math.max(TARGET_ODC - totalOdc.value, 0))

  const chartData = computed(() => {
    if (!logs.value.length) {
      if (fetchLogsFailed.value) {
        return {
          labels: [],
          odpData: [],
          odcData: []
        }
      }

      const showcaseTotals = [...SHOWCASE_TEAMS]
        .sort((a, b) => a.id - b.id)
        .reduce((acc, team) => {
          acc.odp += team.odp
          acc.odc += team.odc
          return acc
        }, { odp: 0, odc: 0 })

      return {
        labels: ['Data Lokal'],
        odpData: [showcaseTotals.odp],
        odcData: [showcaseTotals.odc]
      }
    }

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
    hasFetchedLogs,
    fetchLogsFailed,
    augmentedLogs,
    teamTotals,
    teamRankings,
    addLog,
    updateLog,
    deleteLog,
    totalOdp,
    totalOdc,
    totalInstalled,
    progressPercent,
    remainingDays,
    remainingOdp,
    remainingOdc,
    chartData
  }
}
