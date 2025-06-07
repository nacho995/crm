<template>
  <div>
    <div class="sm:flex sm:items-center mb-8">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-bold text-gray-900">Reportes y Análisis</h1>
        <p class="mt-2 text-sm text-gray-700">Genera reportes detallados y análisis del mercado inmobiliario</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button 
          type="button" 
          class="btn-primary" 
          @click="generateReport"
          :disabled="loading"
        >
          {{ loading ? 'Generando...' : 'Generar Reporte' }}
        </button>
      </div>
    </div>

    <!-- Filtros de reporte -->
    <div class="mb-6 bg-white rounded-lg shadow-sm p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Configuración del Reporte</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Reporte</label>
          <select v-model="reportConfig.type" class="input-field">
            <option value="market">Análisis de Mercado</option>
            <option value="valuations">Valoraciones Realizadas</option>
            <option value="clients">Análisis de Clientes</option>
            <option value="properties">Inventario de Propiedades</option>
            <option value="performance">Rendimiento del Negocio</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Período</label>
          <select v-model="reportConfig.period" class="input-field">
            <option value="week">Última Semana</option>
            <option value="month">Último Mes</option>
            <option value="quarter">Último Trimestre</option>
            <option value="year">Último Año</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Formato</label>
          <select v-model="reportConfig.format" class="input-field">
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Distrito</label>
          <select v-model="reportConfig.district" class="input-field">
            <option value="">Todos los distritos</option>
            <option v-for="district in availableDistricts" :key="district" :value="district">
              {{ district }}
            </option>
          </select>
        </div>
      </div>

      <!-- Fechas personalizadas -->
      <div v-if="reportConfig.period === 'custom'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
          <input v-model="reportConfig.startDate" type="date" class="input-field">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
          <input v-model="reportConfig.endDate" type="date" class="input-field">
        </div>
      </div>
    </div>

    <!-- Estadísticas rápidas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <HomeIcon class="h-8 w-8 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Propiedades</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalProperties }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <DocumentTextIcon class="h-8 w-8 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Valoraciones</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalValuations }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <UsersIcon class="h-8 w-8 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Clientes Activos</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.activeClients }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CurrencyEuroIcon class="h-8 w-8 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Valor Promedio</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(stats.averageValue) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficos y análisis -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Gráfico de valoraciones por mes -->
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Valoraciones por Mes</h3>
        <div class="h-64">
          <canvas ref="valuationsChart"></canvas>
        </div>
      </div>

      <!-- Gráfico de precios por distrito -->
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Precios Promedio por Distrito</h3>
        <div class="h-64">
          <canvas ref="pricesChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Tabla de análisis detallado -->
    <div class="card">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Análisis Detallado por Distrito</h3>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distrito
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propiedades
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Promedio
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  €/m² Promedio
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valoraciones
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tendencia
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="district in districtAnalysis" :key="district.name">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ district.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ district.properties }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatCurrency(district.averagePrice) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ district.pricePerM2 }} €/m²
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ district.valuations }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    district.trend === 'up' ? 'bg-green-100 text-green-800' :
                    district.trend === 'down' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  ]">
                    <ArrowTrendingUpIcon v-if="district.trend === 'up'" class="h-3 w-3 mr-1" />
                    <ArrowTrendingDownIcon v-if="district.trend === 'down'" class="h-3 w-3 mr-1" />
                    <MinusIcon v-if="district.trend === 'stable'" class="h-3 w-3 mr-1" />
                    {{ district.trend === 'up' ? 'Subiendo' : district.trend === 'down' ? 'Bajando' : 'Estable' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Reportes generados -->
    <div class="card">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Reportes Generados</h3>
        
        <div v-if="generatedReports.length === 0" class="text-center py-8">
          <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay reportes</h3>
          <p class="mt-1 text-sm text-gray-500">Genera tu primer reporte usando el botón de arriba.</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="report in generatedReports" :key="report.id" 
               class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div class="flex items-center space-x-3">
              <DocumentTextIcon class="h-8 w-8 text-blue-600" />
              <div>
                <h4 class="text-sm font-medium text-gray-900">{{ report.name }}</h4>
                <p class="text-sm text-gray-500">
                  {{ formatDate(report.createdAt) }} • {{ report.format.toUpperCase() }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="downloadReport(report)" class="btn-secondary btn-sm">
                <ArrowDownTrayIcon class="h-4 w-4 mr-1" />
                Descargar
              </button>
              <button @click="deleteReport(report.id)" class="btn-danger btn-sm">
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { 
  HomeIcon, 
  DocumentTextIcon, 
  UsersIcon, 
  CurrencyEuroIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  ArrowDownTrayIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import { usePropertiesStore } from '../stores/properties'
import { useClientsStore } from '../stores/clients'
import { useValuationsStore } from '../stores/valuations'
import { useMarketPropertiesStore } from '../stores/marketProperties'
import { useToast } from 'vue-toastification'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Chart from 'chart.js/auto'

const propertiesStore = usePropertiesStore()
const clientsStore = useClientsStore()
const valuationsStore = useValuationsStore()
const marketStore = useMarketPropertiesStore()
const toast = useToast()

const loading = ref(false)
const valuationsChart = ref(null)
const pricesChart = ref(null)

const reportConfig = ref({
  type: 'market',
  period: 'month',
  format: 'pdf',
  district: '',
  startDate: '',
  endDate: ''
})

const generatedReports = ref([
  {
    id: 1,
    name: 'Análisis de Mercado - Noviembre 2024',
    format: 'pdf',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 2,
    name: 'Valoraciones Realizadas - Octubre 2024',
    format: 'excel',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }
])

// Computed properties
const stats = computed(() => ({
  totalProperties: propertiesStore.properties.length + marketStore.properties.length,
  totalValuations: valuationsStore.valuations.length,
  activeClients: clientsStore.clients.length,
  averageValue: valuationsStore.valuations.length > 0 
    ? valuationsStore.valuations.reduce((sum, v) => sum + v.valuationAmount, 0) / valuationsStore.valuations.length
    : 0
}))

const availableDistricts = computed(() => {
  const districts = new Set()
  
  // Agregar distritos de propiedades del CRM
  propertiesStore.properties.forEach(prop => {
    if (prop.city) districts.add(prop.city)
  })
  
  // Agregar distritos del mercado
  marketStore.properties.forEach(prop => {
    const district = prop.address.split(',')[1]?.trim()
    if (district) districts.add(district)
  })
  
  return Array.from(districts).sort()
})

const districtAnalysis = computed(() => {
  const analysis = {}
  
  // Analizar propiedades del mercado
  marketStore.properties.forEach(prop => {
    const district = prop.address.split(',')[1]?.trim() || 'Otros'
    if (!analysis[district]) {
      analysis[district] = {
        name: district,
        properties: 0,
        totalPrice: 0,
        totalSurface: 0,
        valuations: 0,
        trend: 'stable'
      }
    }
    
    analysis[district].properties++
    analysis[district].totalPrice += prop.price
    analysis[district].totalSurface += prop.surface
  })
  
  // Agregar valoraciones
  valuationsStore.valuations.forEach(val => {
    const property = propertiesStore.getPropertyById(val.propertyId)
    if (property) {
      const district = property.city || 'Otros'
      if (analysis[district]) {
        analysis[district].valuations++
      }
    }
  })
  
  // Calcular promedios y tendencias
  return Object.values(analysis).map(district => ({
    ...district,
    averagePrice: district.properties > 0 ? Math.round(district.totalPrice / district.properties) : 0,
    pricePerM2: district.totalSurface > 0 ? Math.round(district.totalPrice / district.totalSurface) : 0,
    trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down' // Simulado
  })).sort((a, b) => b.properties - a.properties)
})

onMounted(async () => {
  await nextTick()
  initializeCharts()
})

function initializeCharts() {
  // Gráfico de valoraciones por mes
  if (valuationsChart.value) {
    const ctx = valuationsChart.value.getContext('2d')
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [{
          label: 'Valoraciones',
          data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45],
          borderColor: 'rgb(37, 99, 235)',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }

  // Gráfico de precios por distrito
  if (pricesChart.value) {
    const ctx = pricesChart.value.getContext('2d')
    const topDistricts = districtAnalysis.value.slice(0, 6)
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topDistricts.map(d => d.name),
        datasets: [{
          label: 'Precio Promedio (€)',
          data: topDistricts.map(d => d.averagePrice),
          backgroundColor: 'rgba(37, 99, 235, 0.8)',
          borderColor: 'rgb(37, 99, 235)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0
                }).format(value)
              }
            }
          }
        }
      }
    })
  }
}

async function generateReport() {
  loading.value = true
  
  try {
    // Simular generación de reporte
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const reportName = `${getReportTypeName(reportConfig.value.type)} - ${format(new Date(), 'MMMM yyyy', { locale: es })}`
    
    const newReport = {
      id: Date.now(),
      name: reportName,
      format: reportConfig.value.format,
      createdAt: new Date(),
      config: { ...reportConfig.value }
    }
    
    generatedReports.value.unshift(newReport)
    
    toast.success('Reporte generado correctamente')
  } catch (error) {
    console.error('Error generando reporte:', error)
    toast.error('Error al generar el reporte')
  } finally {
    loading.value = false
  }
}

function getReportTypeName(type) {
  const names = {
    market: 'Análisis de Mercado',
    valuations: 'Valoraciones Realizadas',
    clients: 'Análisis de Clientes',
    properties: 'Inventario de Propiedades',
    performance: 'Rendimiento del Negocio'
  }
  return names[type] || 'Reporte'
}

function downloadReport(report) {
  // Simular descarga
  toast.info(`Descargando ${report.name}...`)
  
  // En una implementación real, aquí se descargaría el archivo
  setTimeout(() => {
    toast.success('Reporte descargado correctamente')
  }, 1000)
}

function deleteReport(reportId) {
  const index = generatedReports.value.findIndex(r => r.id === reportId)
  if (index !== -1) {
    generatedReports.value.splice(index, 1)
    toast.success('Reporte eliminado')
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(amount)
}

function formatDate(date) {
  return format(new Date(date), 'dd MMM yyyy', { locale: es })
}
</script> 