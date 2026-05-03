import { computed, ref, onMounted } from 'vue'

const logs = ref([])
const hasFetchedLogs = ref(false)
const fetchLogsFailed = ref(false)

const TEAM_CONFIG = [
  { id: 1, key: 'tim1', name: 'Tim 1', pic: 'Riduwan', baseOdp: 0, baseOdc: 0, rankingEligible: true },
  { id: 2, key: 'tim2', name: 'Tim 2', pic: 'Daffa', baseOdp: 0, baseOdc: 0, rankingEligible: true },
  { id: 3, key: 'tim3', name: 'Tim 3', pic: 'Mr. Sukun', baseOdp: 0, baseOdc: 0, rankingEligible: true },
  { id: 4, key: 'tim4', name: 'Tim 4', pic: 'Rafly', baseOdp: 0, baseOdc: 0, rankingEligible: true },
  { id: 5, key: 'tim5', name: 'Tim 5', pic: 'Mr.X', baseOdp: 95, baseOdc: 11, rankingEligible: false }
]

const SHOWCASE_TEAMS = [
  { id: 1, name: 'Tim 1', pic: 'Riduwan', odp: 26, odc: 2, totalInstalled: 28 },
  { id: 3, name: 'Tim 3', pic: 'Mr. Sukun', odp: 24, odc: 3, totalInstalled: 27 },
  { id: 2, name: 'Tim 2', pic: 'Daffa', odp: 20, odc: 1, totalInstalled: 21 },
  { id: 4, name: 'Tim 4', pic: 'Rafly', odp: 4, odc: 1, totalInstalled: 5 },
  { id: 5, name: 'Tim 5', pic: 'Mr.X', odp: 95, odc: 11, totalInstalled: 106, rankingEligible: false }
]

const AREA_CONFIG = [
  {
    id: 'randuagung',
    name: 'Randuagung',
    shortName: 'Randuagung',
    targetOdp: 460,
    targetOdc: 57,
    targetHomepass: 3680,
    hasKnownTarget: true,
    usesTeamProgress: true
  },
  {
    id: 'pasar-gadang',
    name: 'Pasar Gadang',
    shortName: 'Pasar Gadang',
    targetOdp: 375,
    targetOdc: 47,
    targetHomepass: 3000,
    hasKnownTarget: true,
    usesTeamProgress: true
  },
  {
    id: 'mangliawan',
    name: 'Mangliawan',
    shortName: 'Mangliawan',
    targetOdp: 24,
    targetOdc: 3,
    targetHomepass: 192,
    hasKnownTarget: true,
    usesTeamProgress: true
  }
]

export function useDashboard() {
  const selectedAreaId = ref('randuagung')
  const TOTAL_DAYS = 12

  const getLogAreaId = (log) => log.areaId || 'randuagung'

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

  onMounted(() => {
    fetchLogs()
  })

  const addLog = async (log) => {
    try {
      const areaId = log.areaId || selectedAreaId.value || 'randuagung'
      const newLog = {
        ...log,
        areaId,
        id: log.id || `${areaId}-${log.date}`
      }

      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
      })

      if (res.ok) {
        const existingIndex = logs.value.findIndex(l => getLogAreaId(l) === areaId && l.date === log.date)
        if (existingIndex !== -1) {
          logs.value[existingIndex] = newLog
        } else {
          logs.value.push(newLog)
        }
        logs.value.sort((a, b) => {
          const dateDiff = new Date(a.date) - new Date(b.date)
          if (dateDiff !== 0) return dateDiff
          return getLogAreaId(a).localeCompare(getLogAreaId(b))
        })
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

  const emptyTeams = TEAM_CONFIG.map((team) => ({
    id: team.id,
    name: team.name,
    pic: team.pic,
    odp: team.baseOdp,
    odc: team.baseOdc,
    totalInstalled: team.baseOdp + team.baseOdc,
    rankingEligible: team.rankingEligible
  }))

  const blankTeams = TEAM_CONFIG.map((team) => ({
    id: team.id,
    name: team.name,
    pic: team.pic,
    odp: 0,
    odc: 0,
    totalInstalled: 0,
    rankingEligible: team.rankingEligible
  }))

  const activeArea = computed(() =>
    AREA_CONFIG.find((area) => area.id === selectedAreaId.value) ?? AREA_CONFIG[0]
  )

  const activeAreaLogs = computed(() =>
    logs.value.filter((log) => getLogAreaId(log) === activeArea.value.id)
  )

  const getAreaTeamSeed = (areaId) =>
    TEAM_CONFIG.map((team) => ({
      id: team.id,
      name: team.name,
      pic: team.pic,
      odp: areaId === 'randuagung' ? team.baseOdp : 0,
      odc: areaId === 'randuagung' ? team.baseOdc : 0,
      rankingEligible: team.rankingEligible
    }))

  const buildTeamTotals = (areaId, areaLogs) => {
    const totals = getAreaTeamSeed(areaId)

    areaLogs.forEach(log => {
      TEAM_CONFIG.forEach((team, index) => {
        totals[index].odp += Number(log[team.key]?.odp) || 0
        totals[index].odc += Number(log[team.key]?.odc) || 0
      })
    })

    return totals.map((team) => ({
      ...team,
      totalInstalled: team.odp + team.odc
    }))
  }

  const randuagungLogs = computed(() =>
    logs.value.filter((log) => getLogAreaId(log) === 'randuagung')
  )

  const randuagungTeamTotals = computed(() => {
    if (!randuagungLogs.value.length) {
      return fetchLogsFailed.value ? emptyTeams : [...SHOWCASE_TEAMS].sort((a, b) => a.id - b.id)
    }

    return buildTeamTotals('randuagung', randuagungLogs.value)
  })

  const teamTotals = computed(() => {
    if (activeArea.value.id === 'randuagung') {
      return randuagungTeamTotals.value
    }

    return buildTeamTotals(activeArea.value.id, activeAreaLogs.value)
  })

  const teamRankings = computed(() => {
    const sourceLogs = activeAreaLogs.value

    if (!sourceLogs.length) {
      const areaEmptyTeams = buildTeamTotals(activeArea.value.id, [])
      const sourceTeams = (activeArea.value.id === 'randuagung' && !fetchLogsFailed.value ? SHOWCASE_TEAMS : areaEmptyTeams)
        .filter((team) => team.rankingEligible !== false)

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

    const rankingTeamTotals = teamTotals.value.filter((team) => team.rankingEligible !== false)
    const rankingTeamConfig = TEAM_CONFIG.filter((team) => team.rankingEligible !== false)
    const teamKeys = rankingTeamConfig.map((team) => team.key)

    const latestLog = sourceLogs[sourceLogs.length - 1] ?? null
    const previousLog = sourceLogs[sourceLogs.length - 2] ?? null

    const previousTotals = rankingTeamConfig.map((team) => ({
      totalInstalled: activeArea.value.id === 'randuagung' ? team.baseOdp + team.baseOdc : 0,
      odp: activeArea.value.id === 'randuagung' ? team.baseOdp : 0,
      odc: activeArea.value.id === 'randuagung' ? team.baseOdc : 0
    }))

    sourceLogs.slice(0, -1).forEach((log) => {
      teamKeys.forEach((key, index) => {
        previousTotals[index].odp += Number(log[key]?.odp) || 0
        previousTotals[index].odc += Number(log[key]?.odc) || 0
        previousTotals[index].totalInstalled =
          previousTotals[index].odp + previousTotals[index].odc
      })
    })

    const previousRankingMap = [...rankingTeamTotals]
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

    const maxOdp = Math.max(...rankingTeamTotals.map((team) => team.odp), 0)
    const maxOdc = Math.max(...rankingTeamTotals.map((team) => team.odc), 0)

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

    const rankedTeams = [...rankingTeamTotals]
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
      const teamIndex = rankingTeamConfig.findIndex((config) => config.id === team.id)
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

  const randuagungTotalOdp = computed(() =>
    randuagungTeamTotals.value.reduce((sum, t) => sum + t.odp, 0)
  )

  const randuagungTotalOdc = computed(() =>
    randuagungTeamTotals.value.reduce((sum, t) => sum + t.odc, 0)
  )

  const totalOdp = computed(() => {
    if (activeArea.value.id === 'randuagung') {
      return randuagungTotalOdp.value
    }

    return teamTotals.value.reduce((sum, t) => sum + t.odp, 0)
  })

  const totalOdc = computed(() => {
    if (activeArea.value.id === 'randuagung') {
      return randuagungTotalOdc.value
    }

    return teamTotals.value.reduce((sum, t) => sum + t.odc, 0)
  })

  const totalInstalled = computed(() => {
    return totalOdp.value + totalOdc.value
  })

  const TARGET_ODP = computed(() => activeArea.value.targetOdp)
  const TARGET_ODC = computed(() => activeArea.value.targetOdc)
  const TARGET_HOMEPASS = computed(() => activeArea.value.targetHomepass)
  const TOTAL_TARGET = computed(() => TARGET_ODP.value + TARGET_ODC.value)

  const progressPercent = computed(() => {
    if (!TOTAL_TARGET.value) return 0

    const percent = (totalInstalled.value / TOTAL_TARGET.value) * 100
    return Math.min(Math.round(percent * 10) / 10, 100)
  })

  const remainingDays = computed(() => {
    const currentDay = Math.max(activeAreaLogs.value.length - 1, 0)
    return Math.max(TOTAL_DAYS - currentDay, 0)
  })

  const remainingOdp = computed(() => Math.max(TARGET_ODP.value - totalOdp.value, 0))
  const remainingOdc = computed(() => Math.max(TARGET_ODC.value - totalOdc.value, 0))

  const buildAreaSummary = (area) => {
    const areaTotals = area.id === 'randuagung'
      ? randuagungTeamTotals.value
      : buildTeamTotals(area.id, logs.value.filter((log) => getLogAreaId(log) === area.id))
    const installedOdp = areaTotals.reduce((sum, team) => sum + team.odp, 0)
    const installedOdc = areaTotals.reduce((sum, team) => sum + team.odc, 0)
    const target = area.targetOdp + area.targetOdc
    const installed = installedOdp + installedOdc

    return {
      ...area,
      target,
      installedOdp,
      installedOdc,
      installed,
      progress: target ? Math.min(Math.round((installed / target) * 1000) / 10, 100) : 0,
      targetLabel: area.hasKnownTarget ? `${target} titik` : 'Belum diisi',
      splitTargetLabel: area.hasKnownTarget ? `ODP ${area.targetOdp} | ODC ${area.targetOdc} | HP ${area.targetHomepass}` : 'Target ODP, ODC & homepass menyusul'
    }
  }

  const areaSummaries = computed(() =>
    AREA_CONFIG.map(buildAreaSummary)
  )

  const areaOptions = computed(() => AREA_CONFIG.map(buildAreaSummary))

  const chartData = computed(() => {
    if (!activeAreaLogs.value.length) {
      if (fetchLogsFailed.value) {
        return {
          labels: [],
          odpData: [],
          odcData: []
        }
      }

      if (activeArea.value.id !== 'randuagung') {
        return {
          labels: ['Belum ada data'],
          odpData: [0],
          odcData: [0]
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

    const labels = activeAreaLogs.value.map(log => log.date)
    const odpData = []
    const odcData = []

    let currentOdp = activeArea.value.id === 'randuagung'
      ? TEAM_CONFIG.reduce((sum, team) => sum + team.baseOdp, 0)
      : 0
    let currentOdc = activeArea.value.id === 'randuagung'
      ? TEAM_CONFIG.reduce((sum, team) => sum + team.baseOdc, 0)
      : 0

    activeAreaLogs.value.forEach(log => {
      const dailyOdp = TEAM_CONFIG.reduce((sum, team) => sum + (Number(log[team.key]?.odp) || 0), 0)
      const dailyOdc = TEAM_CONFIG.reduce((sum, team) => sum + (Number(log[team.key]?.odc) || 0), 0)

      currentOdp += dailyOdp
      currentOdc += dailyOdc
      odpData.push(currentOdp)
      odcData.push(currentOdc)
    })

    return { labels, odpData, odcData }
  })

  const augmentedLogs = computed(() => {
    let accOdp = activeArea.value.id === 'randuagung'
      ? TEAM_CONFIG.reduce((sum, team) => sum + team.baseOdp, 0)
      : 0
    let accOdc = activeArea.value.id === 'randuagung'
      ? TEAM_CONFIG.reduce((sum, team) => sum + team.baseOdc, 0)
      : 0

    return activeAreaLogs.value.map((log, index) => {
      const dailyOdp = TEAM_CONFIG.reduce((sum, team) => sum + (Number(log[team.key]?.odp) || 0), 0)
      const dailyOdc = TEAM_CONFIG.reduce((sum, team) => sum + (Number(log[team.key]?.odc) || 0), 0)

      accOdp += dailyOdp
      accOdc += dailyOdc

      return {
        ...log,
        hariIndex: index,
        dailyOdp,
        dailyOdc,
        accOdp,
        accOdc,
        progressOdp: accOdp / (TARGET_ODP.value || 1),
        progressOdc: accOdc / (TARGET_ODC.value || 1)
      }
    })
  })

  return {
    TARGET_ODP,
    TARGET_ODC,
    TARGET_HOMEPASS,
    TOTAL_TARGET,
    TOTAL_DAYS,
    AREA_CONFIG,
    activeArea,
    selectedAreaId,
    areaOptions,
    areaSummaries,
    logs,
    activeAreaLogs,
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
