<template>
  <div class="page-layout">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="page-title">Valoraciones</h1>
            <p class="page-description">Gestiona todas las valoraciones de propiedades</p>
          </div>
          <div class="mt-4 sm:mt-0">
            <router-link to="/valuations/new" class="btn btn-primary">
              <PlusIcon class="h-5 w-5 mr-2" />
              Nueva Valoración
            </router-link>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-6">
        <div class="card-body">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="form-group mb-0">
              <label class="form-label">Buscar</label>
              <input 
                type="text" 
                v-model="searchTerm" 
                placeholder="Buscar por cliente o propiedad..."
                class="form-input"
              >
            </div>
            <div class="form-group mb-0">
              <label class="form-label">Estado</label>
              <select v-model="statusFilter" class="form-select">
                <option value="">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Completada">Completada</option>
              </select>
            </div>
            <div class="form-group mb-0">
              <label class="form-label">Tipo</label>
              <select v-model="typeFilter" class="form-select">
                <option value="">Todos los tipos</option>
                <option value="Venta">Venta</option>
                <option value="Alquiler">Alquiler</option>
                <option value="Hipoteca">Hipoteca</option>
              </select>
            </div>
            <div class="form-group mb-0">
              <label class="form-label">Fecha</label>
              <input 
                type="date" 
                v-model="dateFilter" 
                class="form-input"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="p-3 bg-blue-100 rounded-lg">
                <DocumentTextIcon class="h-6 w-6 text-blue-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-600">Total</p>
                <p class="text-2xl font-semibold">{{ valuationsStore.totalValuations }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="p-3 bg-yellow-100 rounded-lg">
                <ClockIcon class="h-6 w-6 text-yellow-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-600">Pendientes</p>
                <p class="text-2xl font-semibold">{{ pendingCount }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon class="h-6 w-6 text-green-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-600">Completadas</p>
                <p class="text-2xl font-semibold">{{ completedCount }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="p-3 bg-purple-100 rounded-lg">
                <CurrencyEuroIcon class="h-6 w-6 text-purple-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-600">Valor Total</p>
                <p class="text-xl font-semibold">{{ formatCurrency(totalValue) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Valuations Table -->
      <div class="card">
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Propiedad</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Valor Estimado</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredValuations.length === 0">
                <td colspan="8" class="text-center py-12">
                  <DocumentTextIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p class="text-gray-500">No se encontraron valoraciones</p>
                  <router-link to="/valuations/new" class="btn btn-primary btn-sm mt-4">
                    Nueva Valoración
                  </router-link>
                </td>
              </tr>
              <tr v-for="valuation in paginatedValuations" :key="valuation.id">
                <td class="font-medium">#{{ valuation.id }}</td>
                <td>{{ getClientName(valuation.clientId) }}</td>
                <td>{{ getPropertyAddress(valuation.propertyId) }}</td>
                <td>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {{ valuation.type }}
                  </span>
                </td>
                <td>
                  <span :class="getStatusClass(valuation.status)">
                    {{ valuation.status }}
                  </span>
                </td>
                <td>{{ formatDate(valuation.requestDate) }}</td>
                <td class="font-semibold">{{ formatCurrency(valuation.estimatedValue) }}</td>
                <td class="text-right">
                  <div class="flex justify-end space-x-2">
                    <button 
                      @click="viewValuation(valuation)"
                      class="text-blue-600 hover:text-blue-700"
                      title="Ver detalles"
                    >
                      <EyeIcon class="h-5 w-5" />
                    </button>
                    <button 
                      @click="editValuation(valuation)"
                      class="text-gray-600 hover:text-gray-700"
                      title="Editar"
                    >
                      <PencilIcon class="h-5 w-5" />
                    </button>
                    <button 
                      @click="deleteValuation(valuation)"
                      class="text-red-600 hover:text-red-700"
                      title="Eliminar"
                    >
                      <TrashIcon class="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="card-footer">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Mostrando {{ startIndex + 1 }} a {{ endIndex }} de {{ filteredValuations.length }} resultados
            </div>
            <div class="flex space-x-2">
              <button 
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="btn btn-sm btn-secondary"
              >
                Anterior
              </button>
              <button 
                v-for="page in displayedPages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'btn btn-sm',
                  currentPage === page ? 'btn-primary' : 'btn-secondary'
                ]"
              >
                {{ page }}
              </button>
              <button 
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="btn btn-sm btn-secondary"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { 
  DocumentTextIcon, 
  PlusIcon, 
  ClockIcon, 
  CheckCircleIcon,
  CurrencyEuroIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import { useValuationsStore } from '../stores/valuations'
import { useClientsStore } from '../stores/clients'
import { usePropertiesStore } from '../stores/properties'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const valuationsStore = useValuationsStore()
const clientsStore = useClientsStore()
const propertiesStore = usePropertiesStore()

// Filters
const searchTerm = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const dateFilter = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Computed
const filteredValuations = computed(() => {
  return valuationsStore.valuations.filter(valuation => {
    const matchesSearch = searchTerm.value === '' || 
      getClientName(valuation.clientId).toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      getPropertyAddress(valuation.propertyId).toLowerCase().includes(searchTerm.value.toLowerCase())
    
    const matchesStatus = statusFilter.value === '' || valuation.status === statusFilter.value
    const matchesType = typeFilter.value === '' || valuation.type === typeFilter.value
    const matchesDate = dateFilter.value === '' || 
      format(new Date(valuation.requestDate), 'yyyy-MM-dd') === dateFilter.value
    
    return matchesSearch && matchesStatus && matchesType && matchesDate
  })
})

const totalPages = computed(() => 
  Math.ceil(filteredValuations.value.length / itemsPerPage)
)

const startIndex = computed(() => 
  (currentPage.value - 1) * itemsPerPage
)

const endIndex = computed(() => 
  Math.min(startIndex.value + itemsPerPage, filteredValuations.value.length)
)

const paginatedValuations = computed(() =>
  filteredValuations.value.slice(startIndex.value, endIndex.value)
)

const displayedPages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const pendingCount = computed(() => 
  valuationsStore.valuations.filter(v => v.status === 'Pendiente').length
)

const completedCount = computed(() => 
  valuationsStore.valuations.filter(v => v.status === 'Completada').length
)

const totalValue = computed(() => 
  valuationsStore.valuations.reduce((sum, v) => sum + (v.estimatedValue || 0), 0)
)

// Watch filters to reset page
watch([searchTerm, statusFilter, typeFilter, dateFilter], () => {
  currentPage.value = 1
})

// Methods
function getClientName(clientId) {
  const client = clientsStore.getClientById(clientId)
  return client ? client.name : 'Cliente no encontrado'
}

function getPropertyAddress(propertyId) {
  const property = propertiesStore.getPropertyById(propertyId)
  return property ? property.address : 'Propiedad no encontrada'
}

function formatDate(date) {
  return format(new Date(date), 'dd MMM yyyy', { locale: es })
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value || 0)
}

function getStatusClass(status) {
  const classes = {
    'Pendiente': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
    'En Proceso': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
    'Completada': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
  }
  return classes[status] || 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
}

function viewValuation(valuation) {
  router.push(`/valuations/${valuation.id}`)
}

function editValuation(valuation) {
  router.push(`/valuations/${valuation.id}/edit`)
}

async function deleteValuation(valuation) {
  if (confirm('¿Estás seguro de que deseas eliminar esta valoración?')) {
    try {
      valuationsStore.deleteValuation(valuation.id)
      toast.success('Valoración eliminada correctamente')
    } catch (error) {
      toast.error('Error al eliminar la valoración')
    }
  }
}
</script> 