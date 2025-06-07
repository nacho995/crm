import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Clients from '../views/Clients.vue'
import Properties from '../views/Properties.vue'
import Valuations from '../pages/Valuations.vue'
import ValuationTest from '../pages/ValuationTest.vue'
import MapView from '../views/MapView.vue'
import Documents from '../views/Documents.vue'
import Reports from '../views/Reports.vue'
import Settings from '../views/Settings.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/clients',
    name: 'Clients',
    component: Clients
  },
  {
    path: '/properties',
    name: 'Properties',
    component: Properties
  },
  {
    path: '/valuations',
    name: 'Valuations',
    component: Valuations,
    meta: {
      title: 'Valoraciones Inmobiliarias',
      description: 'Sistema profesional de valoración automática'
    }
  },
  {
    path: '/valuation-test',
    name: 'ValuationTest',
    component: ValuationTest,
    meta: {
      title: 'Demo de Valoración',
      description: 'Prueba el sistema de valoración con datos de ejemplo'
    }
  },
  {
    path: '/map',
    name: 'Map',
    component: MapView
  },
  {
    path: '/documents',
    name: 'Documents',
    component: Documents
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router 