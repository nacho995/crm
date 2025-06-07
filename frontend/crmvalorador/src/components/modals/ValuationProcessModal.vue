<template>
  <div v-if="show" class="relative z-50">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl sm:p-6">
          <div>
            <div class="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 class="text-lg font-semibold leading-6 text-gray-900">
                Completar Valoración - {{ property?.address }}
              </h3>
              <div class="mt-6">
                <form @submit.prevent="handleSubmit">
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Información de la propiedad -->
                    <div class="space-y-6">
                      <h4 class="text-md font-medium text-gray-900">Información de la Propiedad</h4>
                      
                      <div class="card p-4 bg-gray-50">
                        <div class="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span class="text-gray-500">Tipo:</span>
                            <span class="font-medium ml-1">{{ property?.type }}</span>
                          </div>
                          <div>
                            <span class="text-gray-500">Superficie:</span>
                            <span class="font-medium ml-1">{{ property?.surface }} m²</span>
                          </div>
                          <div>
                            <span class="text-gray-500">Habitaciones:</span>
                            <span class="font-medium ml-1">{{ property?.rooms }}</span>
                          </div>
                          <div>
                            <span class="text-gray-500">Baños:</span>
                            <span class="font-medium ml-1">{{ property?.bathrooms }}</span>
                          </div>
                          <div>
                            <span class="text-gray-500">Año construcción:</span>
                            <span class="font-medium ml-1">{{ property?.constructionYear }}</span>
                          </div>
                          <div>
                            <span class="text-gray-500">Calificación energética:</span>
                            <span class="font-medium ml-1">{{ property?.energyRating || 'N/A' }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Valoración automática -->
                      <div class="space-y-4">
                        <div class="flex items-center justify-between">
                          <h5 class="text-sm font-medium text-gray-700">Valoración Automática</h5>
                          <button
                            type="button"
                            @click="calculateAutomaticValuation"
                            class="btn-secondary text-xs py-1 px-2"
                          >
                            Calcular
                          </button>
                        </div>
                        
                        <div v-if="automaticValuation" class="card p-4 bg-blue-50">
                          <div class="text-center">
                            <div class="text-2xl font-bold text-blue-600">
                              {{ formatCurrency(automaticValuation.estimatedValue) }}
                            </div>
                            <div class="text-sm text-blue-500 mt-1">
                              {{ automaticValuation.pricePerM2 }} €/m²
                            </div>
                            <div class="text-xs text-gray-500 mt-2">
                              Basado en: {{ automaticValuation.methodology }}
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Comparables -->
                      <div class="space-y-4">
                        <h5 class="text-sm font-medium text-gray-700">Inmuebles Comparables</h5>
                        <div class="space-y-3">
                          <div v-for="(comparable, index) in form.comparables" :key="index" class="card p-3">
                            <div class="grid grid-cols-2 gap-3">
                              <div>
                                <label class="block text-xs font-medium text-gray-700">Dirección</label>
                                <input
                                  v-model="comparable.address"
                                  type="text"
                                  class="input-field text-sm"
                                  placeholder="Dirección del comparable"
                                />
                              </div>
                              <div>
                                <label class="block text-xs font-medium text-gray-700">Superficie (m²)</label>
                                <input
                                  v-model.number="comparable.surface"
                                  type="number"
                                  class="input-field text-sm"
                                  placeholder="120"
                                />
                              </div>
                              <div>
                                <label class="block text-xs font-medium text-gray-700">Precio (€)</label>
                                <input
                                  v-model.number="comparable.price"
                                  type="number"
                                  class="input-field text-sm"
                                  placeholder="450000"
                                  @input="calculatePricePerM2(comparable)"
                                />
                              </div>
                              <div>
                                <label class="block text-xs font-medium text-gray-700">€/m²</label>
                                <input
                                  v-model.number="comparable.pricePerM2"
                                  type="number"
                                  class="input-field text-sm"
                                  readonly
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              @click="removeComparable(index)"
                              class="mt-2 text-red-600 hover:text-red-900 text-xs"
                            >
                              Eliminar
                            </button>
                          </div>
                          <button
                            type="button"
                            @click="addComparable"
                            class="btn-secondary text-sm w-full"
                          >
                            Agregar Comparable
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Resultados de valoración -->
                    <div class="space-y-6">
                      <h4 class="text-md font-medium text-gray-900">Resultados de Valoración</h4>
                      
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label for="marketValue" class="block text-sm font-medium text-gray-700">
                            Valor de mercado (€) *
                          </label>
                          <input
                            id="marketValue"
                            v-model.number="form.marketValue"
                            type="number"
                            min="0"
                            step="1000"
                            required
                            class="input-field mt-1"
                            placeholder="450000"
                          />
                        </div>

                        <div>
                          <label for="mortgageValue" class="block text-sm font-medium text-gray-700">
                            Valor hipotecario (€)
                          </label>
                          <input
                            id="mortgageValue"
                            v-model.number="form.mortgageValue"
                            type="number"
                            min="0"
                            step="1000"
                            class="input-field mt-1"
                            placeholder="445000"
                          />
                        </div>
                      </div>

                      <div>
                        <label for="valuationAmount" class="block text-sm font-medium text-gray-700">
                          Valor final de tasación (€) *
                        </label>
                        <input
                          id="valuationAmount"
                          v-model.number="form.valuationAmount"
                          type="number"
                          min="0"
                          step="1000"
                          required
                          class="input-field mt-1"
                          placeholder="445000"
                        />
                      </div>

                      <div>
                        <label for="methodology" class="block text-sm font-medium text-gray-700">
                          Metodología aplicada
                        </label>
                        <select
                          id="methodology"
                          v-model="form.methodology"
                          class="input-field mt-1"
                        >
                          <option value="Comparación">Método de Comparación</option>
                          <option value="Coste">Método del Coste</option>
                          <option value="Residual">Método Residual</option>
                          <option value="Capitalización">Método de Capitalización</option>
                          <option value="Mixto">Método Mixto</option>
                        </select>
                      </div>

                      <div>
                        <label for="observations" class="block text-sm font-medium text-gray-700">
                          Observaciones finales
                        </label>
                        <textarea
                          id="observations"
                          v-model="form.observations"
                          rows="4"
                          class="input-field mt-1"
                          placeholder="Observaciones sobre el estado de la propiedad, factores que afectan el valor, etc."
                        ></textarea>
                      </div>

                      <!-- Resumen de valoración -->
                      <div class="card p-4 bg-green-50">
                        <h5 class="text-sm font-medium text-gray-700 mb-3">Resumen de Valoración</h5>
                        <div class="space-y-2 text-sm">
                          <div class="flex justify-between">
                            <span>Valor por m²:</span>
                            <span class="font-medium">{{ pricePerM2 }} €/m²</span>
                          </div>
                          <div class="flex justify-between">
                            <span>Superficie:</span>
                            <span class="font-medium">{{ property?.surface }} m²</span>
                          </div>
                          <div class="flex justify-between border-t pt-2">
                            <span class="font-medium">Valor total:</span>
                            <span class="font-bold text-green-600">{{ formatCurrency(form.valuationAmount || 0) }}</span>
                          </div>
                        </div>
                      </div>

                      <div class="flex items-center">
                        <input
                          id="documentGenerated"
                          v-model="form.documentGenerated"
                          type="checkbox"
                          class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label for="documentGenerated" class="ml-2 text-sm text-gray-700">
                          Generar documento de valoración
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="mt-8 flex justify-end space-x-3">
                    <button
                      type="button"
                      class="btn-secondary"
                      @click="$emit('close')"
                    >
                      Cancelar
                    </button>
                    <button
                      v-if="props.valuation?.status === 'Completada'"
                      type="button"
                      class="btn-primary flex items-center gap-2"
                      @click="generatePDF"
                      :disabled="isGeneratingPDF"
                    >
                      <DocumentArrowDownIcon class="h-4 w-4" />
                      {{ isGeneratingPDF ? 'Generando PDF...' : 'Descargar PDF' }}
                    </button>
                    <button
                      v-else
                      type="button"
                      class="btn-primary flex items-center gap-2"
                      @click="completeValuation"
                      :disabled="!selectedProperty || !valuationData.valuationAmount"
                    >
                      <CheckIcon class="h-4 w-4" />
                      Completar Valoración
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PDF Preview Modal -->
    <div v-if="showPDFPreview" class="fixed inset-0 z-[60] overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="showPDFPreview = false"></div>
        <div class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div class="p-4 border-b">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Vista Previa del Documento</h3>
              <button @click="showPDFPreview = false" class="text-gray-400 hover:text-gray-500">
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>
          </div>
          <div class="p-4 overflow-y-auto max-h-[70vh]">
            <PDFGenerator
              v-if="selectedProperty && selectedClient"
              ref="pdfGeneratorRef"
              :property="selectedProperty"
              :valuation="{
                ...props.valuation,
                ...valuationData,
                comparables: comparables
              }"
              :client="selectedClient"
            />
          </div>
          <div class="p-4 border-t flex justify-end space-x-3">
            <button
              type="button"
              class="btn-secondary"
              @click="showPDFPreview = false"
            >
              Cerrar
            </button>
            <button
              type="button"
              class="btn-primary flex items-center gap-2"
              @click="generatePDFWithPreview"
              :disabled="isGeneratingPDF"
            >
              <DocumentArrowDownIcon class="h-4 w-4" />
              {{ isGeneratingPDF ? 'Generando...' : 'Descargar PDF' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { XMarkIcon, CheckIcon, DocumentArrowDownIcon } from '@heroicons/vue/24/outline'
import { useValuationsStore } from '../../stores/valuations'
import { usePropertiesStore } from '../../stores/properties'
import { useClientsStore } from '../../stores/clients'
import { useMarketPropertiesStore } from '../../stores/marketProperties'
import { useToast } from 'vue-toastification'
import { PDFService } from '../../services/pdfService'
import PDFGenerator from '../PDFGenerator.vue'

const valuationsStore = useValuationsStore()
const propertiesStore = usePropertiesStore()
const clientsStore = useClientsStore()
const marketStore = useMarketPropertiesStore()
const toast = useToast()

const props = defineProps({
  show: Boolean,
  valuation: Object
})

const emit = defineEmits(['close', 'save'])

const form = ref({
  marketValue: null,
  mortgageValue: null,
  valuationAmount: null,
  methodology: 'Comparación',
  observations: '',
  comparables: [],
  documentGenerated: true
})

const automaticValuation = ref(null)

const property = computed(() => {
  if (!props.valuation?.propertyId) return null
  return propertiesStore.getPropertyById(props.valuation.propertyId)
})

const isFormValid = computed(() => {
  return form.value.marketValue && form.value.valuationAmount
})

const pricePerM2 = computed(() => {
  if (!form.value.valuationAmount || !property.value?.surface) return 0
  return Math.round(form.value.valuationAmount / property.value.surface)
})

watch(() => props.valuation, (newValuation) => {
  if (newValuation) {
    form.value = {
      marketValue: newValuation.marketValue || null,
      mortgageValue: newValuation.mortgageValue || null,
      valuationAmount: newValuation.valuationAmount || null,
      methodology: newValuation.methodology || 'Comparación',
      observations: newValuation.observations || '',
      comparables: newValuation.comparables || [],
      documentGenerated: newValuation.documentGenerated || true
    }
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => props.show, (show) => {
  if (!show) {
    resetForm()
    automaticValuation.value = null
  }
})

function resetForm() {
  form.value = {
    marketValue: null,
    mortgageValue: null,
    valuationAmount: null,
    methodology: 'Comparación',
    observations: '',
    comparables: [],
    documentGenerated: true
  }
}

function addComparable() {
  form.value.comparables.push({
    address: '',
    surface: null,
    price: null,
    pricePerM2: null
  })
}

function removeComparable(index) {
  form.value.comparables.splice(index, 1)
}

function calculatePricePerM2(comparable) {
  if (comparable.price && comparable.surface) {
    comparable.pricePerM2 = Math.round(comparable.price / comparable.surface)
  }
}

function calculateAutomaticValuation() {
  if (!property.value) return

  // Algoritmo de valoración automática basado en características de la propiedad
  const basePrice = getBasePriceByLocation(property.value.city, property.value.postalCode)
  let adjustedPrice = basePrice

  // Ajustes por características
  adjustedPrice *= getAgeAdjustment(property.value.constructionYear)
  adjustedPrice *= getEnergyRatingAdjustment(property.value.energyRating)
  adjustedPrice *= getFloorAdjustment(property.value.floor)
  adjustedPrice *= getAmenitiesAdjustment(property.value)

  const estimatedValue = Math.round(adjustedPrice * property.value.surface)
  const pricePerM2 = Math.round(adjustedPrice)

  automaticValuation.value = {
    estimatedValue,
    pricePerM2,
    methodology: 'Algoritmo automático basado en características'
  }

  // Auto-rellenar los campos con la valoración automática
  form.value.marketValue = estimatedValue
  form.value.valuationAmount = Math.round(estimatedValue * 0.98) // Valor hipotecario típicamente 2% menor
  form.value.mortgageValue = form.value.valuationAmount
}

function getBasePriceByLocation(city, postalCode) {
  // Precios base por m² en Madrid y alrededores (datos aproximados)
  const madridPrices = {
    // Madrid centro
    '28001': 6500, '28002': 5800, '28003': 5200, '28004': 6200, '28005': 4800,
    '28006': 7200, '28007': 5500, '28008': 5800, '28009': 6800, '28010': 7500,
    '28011': 4200, '28012': 5800, '28013': 6500, '28014': 6200, '28015': 5500,
    '28016': 8500, '28017': 4800, '28018': 4500, '28019': 4200, '28020': 4000,
    '28021': 4500, '28022': 7800, '28023': 8200, '28024': 4200, '28025': 4000,
    '28026': 3800, '28027': 8500, '28028': 5200, '28029': 4800, '28030': 4500,
    '28031': 4200, '28032': 4000, '28033': 3800, '28034': 3500, '28035': 3200,
    '28036': 4800, '28037': 4200, '28038': 4000, '28039': 3800, '28040': 3500,
    '28041': 3200, '28042': 3000, '28043': 2800, '28044': 2600, '28045': 2800,
    '28046': 2600, '28047': 2400, '28048': 2200, '28049': 2000, '28050': 2200
  }

  // Precios para municipios de la Comunidad de Madrid
  const madridRegionPrices = {
    'Alcalá de Henares': 2800, 'Alcobendas': 4200, 'Alcorcón': 3200, 'Aranjuez': 2200,
    'Boadilla del Monte': 4800, 'Collado Villalba': 3200, 'Coslada': 3000, 'Fuenlabrada': 2800,
    'Getafe': 2600, 'Leganés': 2800, 'Majadahonda': 5200, 'Móstoles': 2600,
    'Parla': 2200, 'Pozuelo de Alarcón': 6800, 'Rivas-Vaciamadrid': 3200, 'San Sebastián de los Reyes': 3800,
    'Torrejón de Ardoz': 2800, 'Tres Cantos': 4500, 'Valdemoro': 2800, 'Las Rozas': 5500
  }

  if (city === 'Madrid' && madridPrices[postalCode]) {
    return madridPrices[postalCode]
  }

  if (madridRegionPrices[city]) {
    return madridRegionPrices[city]
  }

  // Precio por defecto para otras ubicaciones
  return 3000
}

function getAgeAdjustment(constructionYear) {
  if (!constructionYear) return 1.0
  
  const currentYear = new Date().getFullYear()
  const age = currentYear - constructionYear

  if (age <= 5) return 1.1      // Muy nuevo
  if (age <= 10) return 1.05    // Nuevo
  if (age <= 20) return 1.0     // Moderno
  if (age <= 30) return 0.95    // Algo antiguo
  if (age <= 50) return 0.9     // Antiguo
  return 0.85                   // Muy antiguo
}

function getEnergyRatingAdjustment(rating) {
  const adjustments = {
    'A': 1.08,
    'B': 1.05,
    'C': 1.02,
    'D': 1.0,
    'E': 0.98,
    'F': 0.95,
    'G': 0.92
  }
  return adjustments[rating] || 1.0
}

function getFloorAdjustment(floor) {
  if (!floor) return 1.0
  
  if (floor === 0) return 0.95      // Planta baja
  if (floor <= 2) return 1.0        // Plantas bajas-medias
  if (floor <= 5) return 1.02       // Plantas medias
  if (floor <= 8) return 1.05       // Plantas altas
  return 1.08                       // Plantas muy altas
}

function getAmenitiesAdjustment(property) {
  let adjustment = 1.0

  if (property.elevator) adjustment += 0.03
  if (property.parking) adjustment += 0.08
  if (property.terrace) adjustment += 0.05
  if (property.garden) adjustment += 0.1
  if (property.pool) adjustment += 0.12
  if (property.airConditioning) adjustment += 0.04

  return adjustment
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

function handleSubmit() {
  if (isFormValid.value) {
    emit('save', { ...form.value })
  }
}

const showPDFPreview = ref(false)
const pdfGeneratorRef = ref(null)
const isGeneratingPDF = ref(false)

async function completeValuation() {
  if (!property.value || !form.value.valuationAmount) {
    toast.error('Por favor completa todos los campos requeridos')
    return
  }

  try {
    const completedValuation = {
      ...props.valuation,
      ...form.value,
      status: 'Completada',
      completedAt: new Date(),
      marketValue: form.value.marketValue || form.value.valuationAmount,
      mortgageValue: form.value.mortgageValue || Math.round(form.value.valuationAmount * 0.98),
      comparables: form.value.comparables
    }

    await valuationsStore.updateValuation(completedValuation.id, completedValuation)
    
    toast.success('Valoración completada correctamente')
    
    // Mostrar opción de descarga de PDF
    showPDFOptions()
    
  } catch (error) {
    toast.error('Error al completar la valoración')
  }
}

function showPDFOptions() {
  // Mostrar modal de confirmación para generar PDF
  if (confirm('¿Deseas generar y descargar el documento PDF de la valoración?')) {
    generatePDF()
  } else {
    emit('close')
  }
}

async function generatePDF() {
  if (!property.value) {
    toast.error('Faltan datos para generar el PDF')
    return
  }

  try {
    isGeneratingPDF.value = true
    
    // Obtener el cliente asociado a la valoración
    const client = clientsStore.clients.find(c => c.id === props.valuation.clientId) || {
      name: 'Cliente',
      email: 'cliente@email.com'
    }
    
    // Usar el servicio PDF avanzado
    const filename = await PDFService.generateAdvancedValuationPDF(
      property.value,
      {
        ...props.valuation,
        ...form.value,
        comparables: form.value.comparables,
        appraiser: form.value.appraiser || 'Tasador Profesional',
        collegialNumber: form.value.collegialNumber || 'COL-12345'
      },
      client
    )
    
    toast.success(`Documento PDF generado: ${filename}`)
    emit('close')
    
  } catch (error) {
    console.error('Error generando PDF:', error)
    toast.error('Error al generar el documento PDF')
  } finally {
    isGeneratingPDF.value = false
  }
}

async function generatePDFWithPreview() {
  if (!property.value) {
    toast.error('Faltan datos para generar el PDF')
    return
  }

  try {
    isGeneratingPDF.value = true
    showPDFPreview.value = true
    
    // Esperar a que el componente PDF se renderice
    await nextTick()
    
    if (pdfGeneratorRef.value && pdfGeneratorRef.value.$el) {
      const filename = `Valoracion_${property.value.address.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
      
      await PDFService.generateValuationPDF(pdfGeneratorRef.value.$el, filename)
      
      toast.success('Documento PDF generado correctamente')
      showPDFPreview.value = false
      emit('close')
    }
    
  } catch (error) {
    console.error('Error generando PDF:', error)
    toast.error('Error al generar el documento PDF')
    showPDFPreview.value = false
  } finally {
    isGeneratingPDF.value = false
  }
}
</script> 