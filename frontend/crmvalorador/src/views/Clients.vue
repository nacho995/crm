<template>
  <div class="space-responsive">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
      <div>
        <h1 class="text-responsive-lg font-bold text-gray-900">Clientes</h1>
        <p class="mt-2 text-responsive-base text-gray-700">Gestiona todos tus clientes inmobiliarios</p>
      </div>
      <div class="flex-shrink-0">
        <button type="button" class="btn-primary w-full sm:w-auto" @click="openModal()">
          <PlusIcon class="h-4 w-4 mr-2 sm:hidden" />
          Agregar Cliente
        </button>
      </div>
    </div>

    <!-- Search and filters -->
    <div class="mb-6">
      <div class="w-full sm:max-w-lg">
        <label for="search" class="sr-only">Buscar clientes</label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="search"
            v-model="searchQuery"
            type="search"
            placeholder="Buscar por nombre, email, DNI o teléfono..."
            class="input-field pl-9 sm:pl-10"
          />
        </div>
      </div>
    </div>

    <!-- Clients list -->
    <div class="card p-0">
      <div v-if="filteredClients.length === 0" class="text-center py-12 sm:py-16 px-4">
        <div class="h-16 w-16 sm:h-20 sm:w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UsersIcon class="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
        </div>
        <h3 class="text-sm sm:text-base font-medium text-gray-900">
          {{ searchQuery ? 'No se encontraron clientes' : 'No hay clientes' }}
        </h3>
        <p class="mt-1 text-xs sm:text-sm text-gray-500">
          {{ searchQuery ? 'Intenta con otros términos de búsqueda.' : 'Comienza agregando tu primer cliente.' }}
        </p>
        <div v-if="!searchQuery" class="mt-6">
          <button type="button" class="btn-primary btn-sm" @click="openModal()">
            Agregar Cliente
          </button>
        </div>
      </div>

      <!-- Desktop Table -->
      <div v-else class="hidden lg:block overflow-hidden">
        <div class="table-responsive">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DNI
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th class="relative px-6 py-3">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="client in filteredClients" :key="client.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span class="text-sm font-medium text-primary-600">{{ client.name.charAt(0) }}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ client.name }}</div>
                      <div class="text-sm text-gray-500 truncate max-w-xs">{{ client.address }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ client.email }}</div>
                  <div class="text-sm text-gray-500">{{ client.phone }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ client.dni }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(client.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="openModal(client)" class="text-primary-600 hover:text-primary-900 mr-4 transition-colors">
                    Editar
                  </button>
                  <button @click="deleteClient(client)" class="text-red-600 hover:text-red-900 transition-colors">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mobile/Tablet Cards -->
      <div v-else class="lg:hidden">
        <div class="divide-y divide-gray-200">
          <div 
            v-for="client in filteredClients" 
            :key="client.id" 
            class="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start space-x-4">
              <!-- Avatar -->
              <div class="flex-shrink-0">
                <div class="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary-100 flex items-center justify-center">
                  <span class="text-base sm:text-lg font-medium text-primary-600">{{ client.name.charAt(0) }}</span>
                </div>
              </div>
              
              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-base sm:text-lg font-medium text-gray-900 truncate">{{ client.name }}</h3>
                    <p class="text-sm text-gray-500 truncate">{{ client.email }}</p>
                    <p class="text-sm text-gray-500">{{ client.phone }}</p>
                  </div>
                  
                  <!-- Actions -->
                  <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 ml-4">
                    <button 
                      @click="openModal(client)" 
                      class="btn-sm btn-secondary text-xs"
                    >
                      <PencilIcon class="h-3 w-3 mr-1" />
                      Editar
                    </button>
                    <button 
                      @click="deleteClient(client)" 
                      class="btn-sm btn-danger text-xs"
                    >
                      <TrashIcon class="h-3 w-3 mr-1" />
                      Eliminar
                    </button>
                  </div>
                </div>
                
                <!-- Additional Info -->
                <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span class="font-medium text-gray-500">DNI:</span>
                    <span class="ml-1 text-gray-900">{{ client.dni }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-gray-500">Registro:</span>
                    <span class="ml-1 text-gray-900">{{ formatDate(client.createdAt) }}</span>
                  </div>
                </div>
                
                <!-- Address -->
                <div class="mt-2">
                  <span class="font-medium text-gray-500 text-sm">Dirección:</span>
                  <p class="text-sm text-gray-900 mt-1">{{ client.address }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <ClientModal
      :show="showModal"
      :client="selectedClient"
      @close="closeModal"
      @save="saveClient"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { 
  MagnifyingGlassIcon, 
  UsersIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import { useClientsStore } from '../stores/clients'
import { useToast } from 'vue-toastification'
import ClientModal from '../components/modals/ClientModal.vue'

const clientsStore = useClientsStore()
const toast = useToast()

const searchQuery = ref('')
const showModal = ref(false)
const selectedClient = ref(null)

const filteredClients = computed(() => {
  if (!searchQuery.value) {
    return clientsStore.clients
  }
  return clientsStore.searchClients(searchQuery.value)
})

function openModal(client = null) {
  selectedClient.value = client
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedClient.value = null
}

function saveClient(clientData) {
  try {
    if (selectedClient.value) {
      clientsStore.updateClient(selectedClient.value.id, clientData)
      toast.success('Cliente actualizado correctamente')
    } else {
      clientsStore.addClient(clientData)
      toast.success('Cliente agregado correctamente')
    }
    closeModal()
  } catch (error) {
    toast.error('Error al guardar el cliente')
  }
}

function deleteClient(client) {
  if (confirm(`¿Estás seguro de que quieres eliminar a ${client.name}?`)) {
    try {
      clientsStore.deleteClient(client.id)
      toast.success('Cliente eliminado correctamente')
    } catch (error) {
      toast.error('Error al eliminar el cliente')
    }
  }
}

function formatDate(date) {
  return format(new Date(date), 'dd MMM yyyy', { locale: es })
}
</script> 