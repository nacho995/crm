<template>
  <div v-if="show" class="relative z-50">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl sm:p-6">
          <div>
            <div class="mt-3 text-center sm:mt-0 sm:text-left">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold leading-6 text-gray-900">
                  Vista Previa del Documento
                </h3>
                <button
                  type="button"
                  class="rounded-md bg-white text-gray-400 hover:text-gray-500"
                  @click="$emit('close')"
                >
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>

              <div v-if="document" class="bg-white border border-gray-200 rounded-lg p-8 max-h-[70vh] overflow-y-auto">
                <!-- Encabezado del documento -->
                <div class="text-center mb-8">
                  <h1 class="text-2xl font-bold text-gray-900 mb-2">INFORME DE VALORACIÓN</h1>
                  <h2 class="text-lg font-semibold text-gray-700">{{ document.type }}</h2>
                  <div class="mt-4 text-sm text-gray-500">
                    <p>Fecha: {{ formatDate(document.createdAt) }}</p>
                    <p>Referencia: {{ document.filename.replace('.pdf', '') }}</p>
                  </div>
                </div>

                <!-- Información del cliente -->
                <div class="mb-8">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    1. DATOS DEL CLIENTE
                  </h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-600">Cliente:</p>
                      <p class="font-medium">{{ document.clientName }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Fecha de solicitud:</p>
                      <p class="font-medium">{{ formatDate(document.createdAt) }}</p>
                    </div>
                  </div>
                </div>

                <!-- Información de la propiedad -->
                <div class="mb-8">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    2. DESCRIPCIÓN DE LA PROPIEDAD
                  </h3>
                  <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-3">
                      <div>
                        <p class="text-sm text-gray-600">Dirección:</p>
                        <p class="font-medium">{{ document.propertyAddress }}</p>
                      </div>
                      <div v-if="document.content?.property">
                        <p class="text-sm text-gray-600">Tipo de inmueble:</p>
                        <p class="font-medium">{{ document.content.property.type }}</p>
                      </div>
                      <div v-if="document.content?.property">
                        <p class="text-sm text-gray-600">Superficie útil:</p>
                        <p class="font-medium">{{ document.content.property.surface }} m²</p>
                      </div>
                    </div>
                    <div class="space-y-3" v-if="document.content?.property">
                      <div>
                        <p class="text-sm text-gray-600">Habitaciones:</p>
                        <p class="font-medium">{{ document.content.property.rooms }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-600">Baños:</p>
                        <p class="font-medium">{{ document.content.property.bathrooms }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-600">Año de construcción:</p>
                        <p class="font-medium">{{ document.content.property.constructionYear }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-600">Certificado energético:</p>
                        <p class="font-medium">{{ document.content.property.energyRating }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Metodología de valoración -->
                <div class="mb-8" v-if="document.content?.valuation">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    3. METODOLOGÍA DE VALORACIÓN
                  </h3>
                  <p class="text-gray-700 mb-4">
                    Para la valoración de este inmueble se ha aplicado el <strong>{{ document.content.valuation.methodology }}</strong>, 
                    que consiste en analizar las transacciones de inmuebles similares en la zona, ajustando las diferencias 
                    existentes entre el inmueble objeto de valoración y los inmuebles comparables.
                  </p>
                </div>

                <!-- Inmuebles comparables -->
                <div class="mb-8" v-if="document.content?.comparables && document.content.comparables.length > 0">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    4. INMUEBLES COMPARABLES
                  </h3>
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dirección</th>
                          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Superficie</th>
                          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">€/m²</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(comparable, index) in document.content.comparables" :key="index">
                          <td class="px-4 py-2 text-sm text-gray-900">{{ comparable.address }}</td>
                          <td class="px-4 py-2 text-sm text-gray-900">{{ comparable.surface }} m²</td>
                          <td class="px-4 py-2 text-sm text-gray-900">{{ formatCurrency(comparable.price) }}</td>
                          <td class="px-4 py-2 text-sm text-gray-900">{{ comparable.pricePerM2 }} €/m²</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Resultado de la valoración -->
                <div class="mb-8" v-if="document.content?.valuation">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    5. RESULTADO DE LA VALORACIÓN
                  </h3>
                  <div class="bg-blue-50 p-6 rounded-lg">
                    <div class="grid grid-cols-2 gap-6">
                      <div class="space-y-3">
                        <div>
                          <p class="text-sm text-gray-600">Valor de mercado:</p>
                          <p class="text-lg font-bold text-blue-600">{{ formatCurrency(document.content.valuation.marketValue) }}</p>
                        </div>
                        <div>
                          <p class="text-sm text-gray-600">Valor hipotecario:</p>
                          <p class="text-lg font-bold text-blue-600">{{ formatCurrency(document.content.valuation.mortgageValue) }}</p>
                        </div>
                      </div>
                      <div class="space-y-3">
                        <div>
                          <p class="text-sm text-gray-600">Valor final de tasación:</p>
                          <p class="text-2xl font-bold text-green-600">{{ formatCurrency(document.content.valuation.finalValue) }}</p>
                        </div>
                        <div>
                          <p class="text-sm text-gray-600">Precio por m²:</p>
                          <p class="text-lg font-bold text-green-600">{{ document.content.valuation.pricePerM2 }} €/m²</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Información del tasador -->
                <div class="mb-8" v-if="document.content?.valuation">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    6. DATOS DEL TASADOR
                  </h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-600">Tasador:</p>
                      <p class="font-medium">{{ document.content.valuation.appraiser }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Número colegial:</p>
                      <p class="font-medium">{{ document.content.valuation.collegialNumber }}</p>
                    </div>
                  </div>
                </div>

                <!-- Pie del documento -->
                <div class="mt-12 pt-8 border-t border-gray-200">
                  <div class="text-center text-sm text-gray-500">
                    <p>Este documento ha sido generado automáticamente por el sistema CRM Valorador</p>
                    <p class="mt-2">{{ formatDate(document.createdAt) }}</p>
                  </div>
                </div>
              </div>

              <div class="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  class="btn-secondary"
                  @click="$emit('close')"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  class="btn-primary"
                  @click="downloadDocument"
                >
                  Descargar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  show: Boolean,
  document: Object
})

const emit = defineEmits(['close'])

function formatDate(date) {
  return format(new Date(date), 'dd MMMM yyyy', { locale: es })
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

function downloadDocument() {
  // Simular descarga de PDF
  const blob = new Blob(['Contenido del documento PDF simulado'], { type: 'application/pdf' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = props.document.filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
  
  toast.success('Documento descargado correctamente')
}
</script>

<style scoped>
/* Estilos para simular un documento impreso */
.document-preview {
  font-family: 'Times New Roman', serif;
  line-height: 1.6;
}

@media print {
  .document-preview {
    margin: 0;
    padding: 20px;
  }
}
</style> 