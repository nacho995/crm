<template>
  <div class="space-responsive">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
      <div>
        <h1 class="text-responsive-lg font-bold text-gray-900">Propiedades</h1>
        <p class="mt-2 text-responsive-base text-gray-700">Gestiona todas las propiedades inmobiliarias</p>
      </div>
      <div class="flex-shrink-0">
        <button type="button" class="btn-primary w-full sm:w-auto" @click="openModal()">
          <PlusIcon class="h-4 w-4 mr-2 sm:hidden" />
          Agregar Propiedad
        </button>
      </div>
    </div>

    <!-- Search and filters -->
    <div class="mb-6 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-4">
      <!-- Search -->
      <div class="md:col-span-1">
        <label for="search" class="sr-only">Buscar propiedades</label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="search"
            v-model="searchQuery"
            type="search"
            placeholder="Buscar por dirección, ciudad..."
            class="input-field pl-9 sm:pl-10"
          />
        </div>
      </div>
      
      <!-- Type Filter -->
      <div>
        <select v-model="typeFilter" class="input-field">
          <option value="">Todos los tipos</option>
          <option value="Piso">Piso</option>
          <option value="Casa">Casa</option>
          <option value="Chalet">Chalet</option>
          <option value="Local">Local</option>
          <option value="Oficina">Oficina</option>
          <option value="Garaje">Garaje</option>
        </select>
      </div>

      <!-- Client Filter -->
      <div>
        <select v-model="clientFilter" class="input-field">
          <option value="">Todos los clientes</option>
          <option v-for="client in clientsStore.clients" :key="client.id" :value="client.id">
            {{ client.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Properties grid -->
    <div v-if="filteredProperties.length === 0" class="text-center py-12 sm:py-16 card">
      <div class="h-16 w-16 sm:h-20 sm:w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <BuildingOfficeIcon class="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
      </div>
      <h3 class="text-sm sm:text-base font-medium text-gray-900">
        {{ searchQuery || typeFilter || clientFilter ? 'No se encontraron propiedades' : 'No hay propiedades' }}
      </h3>
      <p class="mt-1 text-xs sm:text-sm text-gray-500">
        {{ searchQuery || typeFilter || clientFilter ? 'Intenta con otros filtros de búsqueda.' : 'Comienza agregando tu primera propiedad.' }}
      </p>
      <div v-if="!searchQuery && !typeFilter && !clientFilter" class="mt-6">
        <button type="button" class="btn-primary btn-sm" @click="openModal()">
          Agregar Propiedad
        </button>
      </div>
    </div>

    <div v-else class="grid-responsive">
      <div 
        v-for="property in filteredProperties" 
        :key="property.id" 
        class="card p-0 overflow-hidden hover:shadow-lg transition-shadow duration-200"
      >
        <!-- Card Header -->
        <div class="p-4 sm:p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1 min-w-0">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {{ property.type }}
              </span>
            </div>
            <div class="flex space-x-2 ml-2">
              <button 
                @click="openModal(property)" 
                class="p-1.5 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-md transition-colors"
              >
                <PencilIcon class="h-4 w-4" />
              </button>
              <button 
                @click="deleteProperty(property)" 
                class="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <!-- Property Info -->
          <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-2 line-clamp-2">{{ property.address }}</h3>
          <p class="text-sm text-gray-500 mb-4">{{ property.city }}, {{ property.province }}</p>
          
          <!-- Property Details Grid -->
          <div class="grid grid-cols-2 gap-3 sm:gap-4 text-sm mb-4">
            <div class="flex items-center">
              <span class="text-gray-500">Superficie:</span>
              <span class="font-medium ml-1">{{ property.surface }} m²</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500">Habitaciones:</span>
              <span class="font-medium ml-1">{{ property.rooms }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500">Baños:</span>
              <span class="font-medium ml-1">{{ property.bathrooms }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500">Año:</span>
              <span class="font-medium ml-1">{{ property.constructionYear }}</span>
            </div>
          </div>
          
          <!-- Additional Features (Mobile) -->
          <div class="sm:hidden mb-4">
            <div class="flex flex-wrap gap-2">
              <span v-if="property.hasElevator" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Ascensor
              </span>
              <span v-if="property.hasParking" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Parking
              </span>
              <span v-if="property.hasTerrace" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                Terraza
              </span>
              <span v-if="property.hasGarden" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Jardín
              </span>
            </div>
          </div>
        </div>
        
        <!-- Card Footer -->
        <div class="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs sm:text-sm text-gray-500">Cliente:</span>
            <span class="text-xs sm:text-sm font-medium text-gray-900 truncate ml-2">{{ getClientName(property.clientId) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs sm:text-sm text-gray-500">Valor actual:</span>
            <span class="text-base sm:text-lg font-bold text-primary-600">{{ formatCurrency(property.currentValue) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Results Summary (Mobile) -->
    <div v-if="filteredProperties.length > 0" class="mt-6 sm:hidden">
      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-sm text-gray-600 text-center">
          Mostrando {{ filteredProperties.length }} 
          {{ filteredProperties.length === 1 ? 'propiedad' : 'propiedades' }}
          {{ (searchQuery || typeFilter || clientFilter) ? 'filtradas' : 'en total' }}
        </p>
      </div>
    </div>

    <!-- Modal -->
    <PropertyModal
      :show="showModal"
      :property="selectedProperty"
      @close="closeModal"
      @save="saveProperty"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  MagnifyingGlassIcon, 
  BuildingOfficeIcon, 
  PencilIcon, 
  TrashIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'
import { usePropertiesStore } from '../stores/properties'
import { useClientsStore } from '../stores/clients'
import { useToast } from 'vue-toastification'
import PropertyModal from '../components/modals/PropertyModal.vue'

const propertiesStore = usePropertiesStore()
const clientsStore = useClientsStore()
const toast = useToast()

const searchQuery = ref('')
const typeFilter = ref('')
const clientFilter = ref('')
const showModal = ref(false)
const selectedProperty = ref(null)

const filteredProperties = computed(() => {
  let filtered = propertiesStore.properties

  if (searchQuery.value) {
    filtered = propertiesStore.searchProperties(searchQuery.value)
  }

  if (typeFilter.value) {
    filtered = filtered.filter(property => property.type === typeFilter.value)
  }

  if (clientFilter.value) {
    filtered = filtered.filter(property => property.clientId === parseInt(clientFilter.value))
  }

  return filtered
})

function openModal(property = null) {
  selectedProperty.value = property
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedProperty.value = null
}

function saveProperty(propertyData) {
  try {
    if (selectedProperty.value) {
      propertiesStore.updateProperty(selectedProperty.value.id, propertyData)
      toast.success('Propiedad actualizada correctamente')
    } else {
      propertiesStore.addProperty(propertyData)
      toast.success('Propiedad agregada correctamente')
    }
    closeModal()
  } catch (error) {
    toast.error('Error al guardar la propiedad')
  }
}

function deleteProperty(property) {
  if (confirm(`¿Estás seguro de que quieres eliminar la propiedad en ${property.address}?`)) {
    try {
      propertiesStore.deleteProperty(property.id)
      toast.success('Propiedad eliminada correctamente')
    } catch (error) {
      toast.error('Error al eliminar la propiedad')
    }
  }
}

function getClientName(clientId) {
  const client = clientsStore.getClientById(clientId)
  return client ? client.name : 'Cliente no encontrado'
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 