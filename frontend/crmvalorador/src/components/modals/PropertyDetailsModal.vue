<template>
  <div v-if="show" class="relative z-50">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
          <div>
            <div class="mt-3 text-center sm:mt-0 sm:text-left">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold leading-6 text-gray-900">
                  Detalles de la Propiedad
                </h3>
                <button
                  type="button"
                  class="rounded-md bg-white text-gray-400 hover:text-gray-500"
                  @click="$emit('close')"
                >
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>

              <div v-if="property" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Información principal -->
                <div class="space-y-6">
                  <div>
                    <h4 class="text-lg font-medium text-gray-900 mb-4">Información General</h4>
                    <div class="card p-4 space-y-3">
                      <div class="flex justify-between">
                        <span class="text-gray-500">Dirección:</span>
                        <span class="font-medium">{{ property.address }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-500">Distrito/Ciudad:</span>
                        <span class="font-medium">{{ property.district || property.city }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-500">Tipo:</span>
                        <span class="font-medium">{{ property.type }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-500">Estado:</span>
                        <span :class="[
                          'font-medium',
                          property.isForSale ? 'text-green-600' : 'text-red-600'
                        ]">
                          {{ property.isForSale ? 'En venta' : 'Vendida' }}
                        </span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-500">Fuente:</span>
                        <span class="font-medium">{{ property.source }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Características -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-900 mb-4">Características</h4>
                    <div class="card p-4">
                      <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-3">
                          <div class="flex justify-between">
                            <span class="text-gray-500">Superficie:</span>
                            <span class="font-medium">{{ property.surface }} m²</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-500">Habitaciones:</span>
                            <span class="font-medium">{{ property.rooms || 'N/A' }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-500">Baños:</span>
                            <span class="font-medium">{{ property.bathrooms || 'N/A' }}</span>
                          </div>
                        </div>
                        <div class="space-y-3">
                          <div class="flex justify-between">
                            <span class="text-gray-500">Planta:</span>
                            <span class="font-medium">{{ property.floor || 'N/A' }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-500">Año construcción:</span>
                            <span class="font-medium">{{ property.constructionYear || 'N/A' }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-500">Cert. energético:</span>
                            <span class="font-medium">{{ property.energyRating || 'N/A' }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Características adicionales -->
                      <div v-if="property.features && property.features.length > 0" class="mt-4 pt-4 border-t">
                        <h5 class="text-sm font-medium text-gray-700 mb-2">Características adicionales:</h5>
                        <div class="flex flex-wrap gap-2">
                          <span 
                            v-for="feature in property.features" 
                            :key="feature"
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {{ feature }}
                          </span>
                        </div>
                      </div>

                      <!-- Características booleanas para propiedades del CRM -->
                      <div v-else-if="hasAdditionalFeatures" class="mt-4 pt-4 border-t">
                        <h5 class="text-sm font-medium text-gray-700 mb-2">Características adicionales:</h5>
                        <div class="flex flex-wrap gap-2">
                          <span 
                            v-if="property.elevator"
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            Ascensor
                          </span>
                          <span 
                            v-if="property.parking"
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            Parking
                          </span>
                          <span 
                            v-if="property.terrace"
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            Terraza
                          </span>
                          <span 
                            v-if="property.garden"
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            Jardín
                          </span>
                          <span 
                            v-if="property.pool"
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            Piscina
                          </span>
                          <span 
                            v-if="property.airConditioning"
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            Aire acondicionado
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Información económica y valoración -->
                <div class="space-y-6">
                  <!-- Precio -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-900 mb-4">Información Económica</h4>
                    <div class="card p-4 bg-green-50">
                      <div class="text-center">
                        <div class="text-3xl font-bold text-green-600">
                          {{ formatCurrency(property.price) }}
                        </div>
                        <div class="text-lg text-green-500 mt-1">
                          {{ property.pricePerM2 || Math.round(property.price / property.surface) }} €/m²
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Análisis de mercado -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-900 mb-4">Análisis de Mercado</h4>
                    <div class="card p-4 space-y-3">
                      <div class="flex justify-between">
                        <span class="text-gray-500">Precio por m²:</span>
                        <span class="font-medium">{{ property.pricePerM2 || Math.round(property.price / property.surface) }} €/m²</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-500">Precio promedio zona:</span>
                        <span class="font-medium">{{ averageZonePrice }} €/m²</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-500">Diferencia:</span>
                        <span :class="[
                          'font-medium',
                          priceDifference > 0 ? 'text-red-600' : 'text-green-600'
                        ]">
                          {{ priceDifference > 0 ? '+' : '' }}{{ priceDifference }}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Valoración automática -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-900 mb-4">Valoración Automática</h4>
                    <div class="card p-4">
                      <div class="flex items-center justify-between mb-3">
                        <span class="text-sm font-medium text-gray-700">Estimación de valor:</span>
                        <button
                          type="button"
                          @click="calculateEstimatedValue"
                          class="btn-secondary text-xs py-1 px-2"
                        >
                          Calcular
                        </button>
                      </div>
                      
                      <div v-if="estimatedValue" class="space-y-2">
                        <div class="flex justify-between">
                          <span class="text-gray-500">Valor estimado:</span>
                          <span class="font-medium">{{ formatCurrency(estimatedValue.value) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-500">€/m² estimado:</span>
                          <span class="font-medium">{{ estimatedValue.pricePerM2 }} €/m²</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-500">Diferencia con precio:</span>
                          <span :class="[
                            'font-medium',
                            estimatedValue.difference > 0 ? 'text-red-600' : 'text-green-600'
                          ]">
                            {{ estimatedValue.difference > 0 ? '+' : '' }}{{ estimatedValue.difference }}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Información adicional -->
                  <div v-if="property.listingDate">
                    <h4 class="text-lg font-medium text-gray-900 mb-4">Información Adicional</h4>
                    <div class="card p-4 space-y-3">
                      <div class="flex justify-between">
                        <span class="text-gray-500">Fecha de publicación:</span>
                        <span class="font-medium">{{ formatDate(property.listingDate) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-500">Días en mercado:</span>
                        <span class="font-medium">{{ daysOnMarket }} días</span>
                      </div>
                    </div>
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
                  v-if="property?.source === 'Mi CRM'"
                  type="button"
                  class="btn-primary"
                  @click="editProperty"
                >
                  Editar Propiedad
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
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useMarketPropertiesStore } from '../../stores/marketProperties'

const marketStore = useMarketPropertiesStore()

const props = defineProps({
  show: Boolean,
  property: Object
})

const emit = defineEmits(['close', 'edit'])

const estimatedValue = ref(null)

const hasAdditionalFeatures = computed(() => {
  if (!props.property) return false
  return props.property.elevator || props.property.parking || props.property.terrace || 
         props.property.garden || props.property.pool || props.property.airConditioning
})

const averageZonePrice = computed(() => {
  if (!props.property) return 0
  const district = props.property.district || props.property.city
  return marketStore.averagePriceByDistrict[district] || 4000
})

const priceDifference = computed(() => {
  if (!props.property) return 0
  const propertyPricePerM2 = props.property.pricePerM2 || Math.round(props.property.price / props.property.surface)
  const avgPrice = averageZonePrice.value
  return Math.round(((propertyPricePerM2 - avgPrice) / avgPrice) * 100)
})

const daysOnMarket = computed(() => {
  if (!props.property?.listingDate) return 0
  const today = new Date()
  const listingDate = new Date(props.property.listingDate)
  const diffTime = Math.abs(today - listingDate)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

function calculateEstimatedValue() {
  if (!props.property) return

  // Usar el mismo algoritmo de valoración que en ValuationProcessModal
  const basePrice = getBasePriceByLocation(props.property.city || props.property.district)
  let adjustedPrice = basePrice

  // Ajustes por características
  adjustedPrice *= getAgeAdjustment(props.property.constructionYear)
  adjustedPrice *= getEnergyRatingAdjustment(props.property.energyRating)
  adjustedPrice *= getFloorAdjustment(props.property.floor)
  adjustedPrice *= getAmenitiesAdjustment(props.property)

  const estimatedTotal = Math.round(adjustedPrice * props.property.surface)
  const estimatedPricePerM2 = Math.round(adjustedPrice)
  const difference = Math.round(((props.property.price - estimatedTotal) / estimatedTotal) * 100)

  estimatedValue.value = {
    value: estimatedTotal,
    pricePerM2: estimatedPricePerM2,
    difference
  }
}

function getBasePriceByLocation(location) {
  const madridPrices = {
    'Centro': 6500, 'Salamanca': 7800, 'Chamberí': 6200, 'Retiro': 6800,
    'Chamartín': 5800, 'Moncloa-Aravaca': 5500, 'Tetuán': 4800,
    'Fuencarral-El Pardo': 4500, 'Arganzuela': 5200, 'Latina': 4200,
    'Carabanchel': 3800, 'Usera': 3500, 'Puente de Vallecas': 3200,
    'Moratalaz': 4000, 'Ciudad Lineal': 3800, 'Hortaleza': 4200,
    'Villaverde': 3000, 'Villa de Vallecas': 2800, 'Vicálvaro': 2600,
    'San Blas-Canillejas': 3500, 'Barajas': 3800,
    'Alcobendas': 4200, 'Alcorcón': 3200, 'Getafe': 2600, 'Leganés': 2800,
    'Móstoles': 2600, 'Fuenlabrada': 2800, 'Majadahonda': 5200,
    'Pozuelo de Alarcón': 6800, 'Las Rozas': 5500, 'Tres Cantos': 4500
  }
  
  return madridPrices[location] || 4000
}

function getAgeAdjustment(constructionYear) {
  if (!constructionYear) return 1.0
  
  const currentYear = new Date().getFullYear()
  const age = currentYear - constructionYear

  if (age <= 5) return 1.1
  if (age <= 10) return 1.05
  if (age <= 20) return 1.0
  if (age <= 30) return 0.95
  if (age <= 50) return 0.9
  return 0.85
}

function getEnergyRatingAdjustment(rating) {
  const adjustments = {
    'A': 1.08, 'B': 1.05, 'C': 1.02, 'D': 1.0,
    'E': 0.98, 'F': 0.95, 'G': 0.92
  }
  return adjustments[rating] || 1.0
}

function getFloorAdjustment(floor) {
  if (!floor) return 1.0
  
  if (floor === 0) return 0.95
  if (floor <= 2) return 1.0
  if (floor <= 5) return 1.02
  if (floor <= 8) return 1.05
  return 1.08
}

function getAmenitiesAdjustment(property) {
  let adjustment = 1.0

  // Para propiedades del mercado (con array de features)
  if (property.features) {
    if (property.features.includes('Ascensor')) adjustment += 0.03
    if (property.features.includes('Parking')) adjustment += 0.08
    if (property.features.includes('Terraza')) adjustment += 0.05
    if (property.features.includes('Jardín')) adjustment += 0.1
    if (property.features.includes('Piscina')) adjustment += 0.12
    if (property.features.includes('Aire acondicionado')) adjustment += 0.04
  } else {
    // Para propiedades del CRM (con propiedades booleanas)
    if (property.elevator) adjustment += 0.03
    if (property.parking) adjustment += 0.08
    if (property.terrace) adjustment += 0.05
    if (property.garden) adjustment += 0.1
    if (property.pool) adjustment += 0.12
    if (property.airConditioning) adjustment += 0.04
  }

  return adjustment
}

function editProperty() {
  emit('edit', props.property)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

function formatDate(date) {
  return format(new Date(date), 'dd MMM yyyy', { locale: es })
}
</script> 