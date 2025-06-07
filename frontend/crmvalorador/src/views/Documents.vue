<template>
  <div>
    <div class="sm:flex sm:items-center mb-8">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-bold text-gray-900">Documentos</h1>
        <p class="mt-2 text-sm text-gray-700">Gestiona todos los documentos de valoración generados</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button type="button" class="btn-primary" @click="generateSampleDocument">
          Generar Documento de Ejemplo
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div>
        <label for="search" class="sr-only">Buscar documentos</label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="search"
            v-model="searchQuery"
            type="search"
            placeholder="Buscar por cliente, propiedad o tipo..."
            class="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      
      <div>
        <select v-model="typeFilter" class="input-field">
          <option value="">Todos los tipos</option>
          <option value="Tasación Hipotecaria">Tasación Hipotecaria</option>
          <option value="Tasación de Mercado">Tasación de Mercado</option>
          <option value="Tasación Judicial">Tasación Judicial</option>
          <option value="Valoración Catastral">Valoración Catastral</option>
        </select>
      </div>

      <div>
        <select v-model="statusFilter" class="input-field">
          <option value="">Todos los estados</option>
          <option value="Generado">Generado</option>
          <option value="Enviado">Enviado</option>
          <option value="Firmado">Firmado</option>
        </select>
      </div>
    </div>

    <!-- Lista de documentos -->
    <div class="card">
      <div v-if="filteredDocuments.length === 0" class="text-center py-12">
        <FolderIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          {{ hasFilters ? 'No se encontraron documentos' : 'No hay documentos' }}
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ hasFilters ? 'Intenta con otros filtros de búsqueda.' : 'Los documentos se generan automáticamente al completar valoraciones.' }}
        </p>
        <div v-if="!hasFilters" class="mt-6">
          <button type="button" class="btn-primary" @click="generateSampleDocument">
            Generar Documento de Ejemplo
          </button>
        </div>
      </div>

      <div v-else class="overflow-hidden">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documento
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente/Propiedad
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th class="relative px-6 py-3">
                <span class="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="document in filteredDocuments" :key="document.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <DocumentTextIcon class="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ document.title }}</div>
                    <div class="text-sm text-gray-500">{{ document.filename }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ document.clientName }}</div>
                  <div class="text-sm text-gray-500">{{ document.propertyAddress }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ document.type }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  document.status === 'Firmado' ? 'bg-green-100 text-green-800' :
                  document.status === 'Enviado' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  {{ document.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(document.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="downloadDocument(document)" class="text-primary-600 hover:text-primary-900 mr-4">
                  Descargar
                </button>
                <button @click="previewDocument(document)" class="text-blue-600 hover:text-blue-900 mr-4">
                  Vista previa
                </button>
                <button @click="deleteDocument(document)" class="text-red-600 hover:text-red-900">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de vista previa -->
    <DocumentPreviewModal
      :show="showPreviewModal"
      :document="selectedDocument"
      @close="closePreviewModal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { 
  MagnifyingGlassIcon, 
  FolderIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'
import { useValuationsStore } from '../stores/valuations'
import { useClientsStore } from '../stores/clients'
import { usePropertiesStore } from '../stores/properties'
import { useToast } from 'vue-toastification'
import DocumentPreviewModal from '../components/modals/DocumentPreviewModal.vue'

const valuationsStore = useValuationsStore()
const clientsStore = useClientsStore()
const propertiesStore = usePropertiesStore()
const toast = useToast()

const searchQuery = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const showPreviewModal = ref(false)
const selectedDocument = ref(null)

// Simulamos documentos generados a partir de valoraciones completadas
const documents = ref([])

const hasFilters = computed(() => {
  return searchQuery.value || typeFilter.value || statusFilter.value
})

const filteredDocuments = computed(() => {
  let filtered = documents.value

  if (searchQuery.value) {
    const searchTerm = searchQuery.value.toLowerCase()
    filtered = filtered.filter(doc => 
      doc.title.toLowerCase().includes(searchTerm) ||
      doc.clientName.toLowerCase().includes(searchTerm) ||
      doc.propertyAddress.toLowerCase().includes(searchTerm) ||
      doc.type.toLowerCase().includes(searchTerm)
    )
  }

  if (typeFilter.value) {
    filtered = filtered.filter(doc => doc.type === typeFilter.value)
  }

  if (statusFilter.value) {
    filtered = filtered.filter(doc => doc.status === statusFilter.value)
  }

  return filtered
})

function generateSampleDocument() {
  const sampleDoc = {
    id: Date.now(),
    title: 'Tasación Hipotecaria - Ejemplo',
    filename: `tasacion_ejemplo_${Date.now()}.pdf`,
    type: 'Tasación Hipotecaria',
    clientName: 'Cliente Ejemplo',
    propertyAddress: 'Calle Ejemplo 123, Madrid',
    status: 'Generado',
    createdAt: new Date(),
    valuationAmount: 450000,
    content: generateDocumentContent()
  }

  documents.value.unshift(sampleDoc)
  toast.success('Documento de ejemplo generado correctamente')
}

function generateDocumentContent() {
  return {
    property: {
      address: 'Calle Ejemplo 123, Madrid',
      type: 'Piso',
      surface: 120,
      rooms: 3,
      bathrooms: 2,
      floor: 4,
      constructionYear: 2005,
      energyRating: 'C'
    },
    valuation: {
      marketValue: 450000,
      mortgageValue: 441000,
      finalValue: 441000,
      pricePerM2: 3675,
      methodology: 'Método de Comparación',
      appraiser: 'Tasador Ejemplo',
      collegialNumber: 'COL-12345',
      date: new Date()
    },
    comparables: [
      {
        address: 'Calle Similar 45, Madrid',
        surface: 115,
        price: 425000,
        pricePerM2: 3696
      },
      {
        address: 'Avenida Parecida 78, Madrid',
        surface: 125,
        price: 465000,
        pricePerM2: 3720
      }
    ]
  }
}

function downloadDocument(document) {
  // Simular descarga de PDF
  const blob = new Blob(['Contenido del documento PDF simulado'], { type: 'application/pdf' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = document.filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
  
  toast.success('Documento descargado correctamente')
}

function previewDocument(document) {
  selectedDocument.value = document
  showPreviewModal.value = true
}

function closePreviewModal() {
  showPreviewModal.value = false
  selectedDocument.value = null
}

function deleteDocument(document) {
  if (confirm(`¿Estás seguro de que quieres eliminar el documento "${document.title}"?`)) {
    const index = documents.value.findIndex(doc => doc.id === document.id)
    if (index !== -1) {
      documents.value.splice(index, 1)
      toast.success('Documento eliminado correctamente')
    }
  }
}

function formatDate(date) {
  return format(new Date(date), 'dd MMM yyyy', { locale: es })
}

// Generar algunos documentos de ejemplo al cargar
function initializeSampleDocuments() {
  const sampleDocs = [
    {
      id: 1,
      title: 'Tasación Hipotecaria - Piso Centro',
      filename: 'tasacion_centro_001.pdf',
      type: 'Tasación Hipotecaria',
      clientName: 'María García López',
      propertyAddress: 'Gran Vía 45, Centro, Madrid',
      status: 'Firmado',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      valuationAmount: 650000
    },
    {
      id: 2,
      title: 'Valoración de Mercado - Chalet Pozuelo',
      filename: 'valoracion_pozuelo_002.pdf',
      type: 'Tasación de Mercado',
      clientName: 'Carlos Rodríguez Martín',
      propertyAddress: 'Calle de las Flores 12, Pozuelo de Alarcón',
      status: 'Enviado',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      valuationAmount: 850000
    },
    {
      id: 3,
      title: 'Tasación Judicial - Local Comercial',
      filename: 'tasacion_judicial_003.pdf',
      type: 'Tasación Judicial',
      clientName: 'Inmobiliaria ABC S.L.',
      propertyAddress: 'Calle Serrano 89, Salamanca, Madrid',
      status: 'Generado',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      valuationAmount: 320000
    }
  ]

  documents.value = sampleDocs
}

// Inicializar documentos de ejemplo
initializeSampleDocuments()
</script> 