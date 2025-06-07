<template>
  <div class="page-layout">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-description">Bienvenido a tu panel de control del CRM Valorador</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                <UsersIcon class="h-6 w-6 text-blue-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Clientes</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.totalClients }}</p>
              </div>
            </div>
            <div class="mt-4">
              <span class="text-green-600 text-sm font-medium">+12%</span>
              <span class="text-gray-500 text-sm ml-2">desde el último mes</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0 p-3 bg-green-100 rounded-lg">
                <HomeIcon class="h-6 w-6 text-green-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Propiedades Activas</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.activeProperties }}</p>
              </div>
            </div>
            <div class="mt-4">
              <span class="text-green-600 text-sm font-medium">+5%</span>
              <span class="text-gray-500 text-sm ml-2">desde el último mes</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0 p-3 bg-purple-100 rounded-lg">
                <ChartBarIcon class="h-6 w-6 text-purple-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Valoraciones</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.valuations }}</p>
              </div>
            </div>
            <div class="mt-4">
              <span class="text-green-600 text-sm font-medium">+18%</span>
              <span class="text-gray-500 text-sm ml-2">desde el último mes</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0 p-3 bg-amber-100 rounded-lg">
                <CurrencyEuroIcon class="h-6 w-6 text-amber-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Valor Total Cartera</p>
                <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(stats.totalValue) }}</p>
              </div>
            </div>
            <div class="mt-4">
              <span class="text-green-600 text-sm font-medium">+8%</span>
              <span class="text-gray-500 text-sm ml-2">desde el último mes</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity & Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Activity -->
        <div class="lg:col-span-2">
          <div class="card">
            <div class="card-header">
              <h2 class="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
            </div>
            <div class="card-body">
              <div class="space-y-4">
                <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center space-x-3 py-3 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                  <div :class="getActivityIconClass(activity.type)" class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center">
                    <component :is="getActivityIcon(activity.type)" class="h-5 w-5" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                    <p class="text-sm text-gray-500">{{ activity.description }}</p>
                  </div>
                  <span class="text-xs text-gray-400">{{ formatTime(activity.time) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div>
          <div class="card">
            <div class="card-header">
              <h2 class="text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
            </div>
            <div class="card-body">
              <div class="space-y-3">
                <router-link to="/valuations" class="btn btn-primary w-full">
                  <CalculatorIcon class="h-5 w-5 mr-2" />
                  Nueva Valoración
                </router-link>
                <router-link to="/properties/new" class="btn btn-secondary w-full">
                  <PlusIcon class="h-5 w-5 mr-2" />
                  Añadir Propiedad
                </router-link>
                <router-link to="/clients/new" class="btn btn-secondary w-full">
                  <UserPlusIcon class="h-5 w-5 mr-2" />
                  Nuevo Cliente
                </router-link>
                <router-link to="/reports" class="btn btn-secondary w-full">
                  <DocumentTextIcon class="h-5 w-5 mr-2" />
                  Ver Reportes
                </router-link>
              </div>
            </div>
          </div>

          <!-- Market Summary -->
          <div class="card mt-6">
            <div class="card-header">
              <h2 class="text-lg font-semibold text-gray-900">Resumen del Mercado</h2>
            </div>
            <div class="card-body">
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm text-gray-600">Precio medio/m²</span>
                    <span class="text-sm font-semibold text-gray-900">3,250€</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" style="width: 65%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm text-gray-600">Tiempo medio venta</span>
                    <span class="text-sm font-semibold text-gray-900">45 días</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-600 h-2 rounded-full" style="width: 80%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm text-gray-600">Rentabilidad media</span>
                    <span class="text-sm font-semibold text-gray-900">4.5%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-purple-600 h-2 rounded-full" style="width: 45%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  UsersIcon, 
  HomeIcon, 
  ChartBarIcon, 
  CurrencyEuroIcon,
  CalculatorIcon,
  PlusIcon,
  UserPlusIcon,
  DocumentTextIcon,
  BellIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

// Stats data
const stats = ref({
  totalClients: 127,
  activeProperties: 43,
  valuations: 89,
  totalValue: 12500000
})

// Recent activities
const recentActivities = ref([
  {
    id: 1,
    type: 'valuation',
    title: 'Nueva valoración completada',
    description: 'Piso en Salamanca, Madrid - 850,000€',
    time: new Date()
  },
  {
    id: 2,
    type: 'client',
    title: 'Nuevo cliente añadido',
    description: 'María García - Interesada en comprar',
    time: new Date(Date.now() - 3600000)
  },
  {
    id: 3,
    type: 'property',
    title: 'Propiedad actualizada',
    description: 'Chalet en Pozuelo - Precio reducido',
    time: new Date(Date.now() - 7200000)
  },
  {
    id: 4,
    type: 'document',
    title: 'Documento generado',
    description: 'Informe de valoración PDF exportado',
    time: new Date(Date.now() - 10800000)
  }
])

// Helper functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value)
}

const formatTime = (date) => {
  const diff = Date.now() - date.getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) {
    const minutes = Math.floor(diff / 60000)
    return `Hace ${minutes} min`
  } else if (hours < 24) {
    return `Hace ${hours}h`
  } else {
    const days = Math.floor(hours / 24)
    return `Hace ${days} días`
  }
}

const getActivityIcon = (type) => {
  const icons = {
    valuation: ChartBarIcon,
    client: UsersIcon,
    property: HomeIcon,
    document: DocumentTextIcon
  }
  return icons[type] || BellIcon
}

const getActivityIconClass = (type) => {
  const classes = {
    valuation: 'bg-purple-100 text-purple-600',
    client: 'bg-blue-100 text-blue-600',
    property: 'bg-green-100 text-green-600',
    document: 'bg-amber-100 text-amber-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}
</script> 