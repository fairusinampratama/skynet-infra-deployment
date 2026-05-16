import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import CrudView from '../views/CrudView.vue'
import GrafanaAnalyzerView from '../views/GrafanaAnalyzerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      redirect: '/randuagung'
    },
    {
      path: '/randuagung',
      name: 'dashboard-randuagung',
      component: DashboardView,
      meta: { areaId: 'randuagung' }
    },
    {
      path: '/gadang',
      name: 'dashboard-gadang',
      component: DashboardView,
      meta: { areaId: 'pasar-gadang' }
    },
    {
      path: '/mangliawan',
      name: 'dashboard-mangliawan',
      component: DashboardView,
      meta: { areaId: 'mangliawan' }
    },
    {
      path: '/crud',
      redirect: '/crud/randuagung'
    },
    {
      path: '/crud/:areaId',
      name: 'crud-area',
      component: CrudView
    },
    {
      path: '/grafana',
      name: 'grafana',
      component: GrafanaAnalyzerView
    },
    {
      path: '/grafana-analyzer',
      redirect: '/grafana'
    }
  ]
})

export default router
