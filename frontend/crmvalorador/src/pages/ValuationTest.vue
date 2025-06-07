<template>
  <div class="valuation-test-page min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          🏠💎 Sistema de Valoración Inmobiliaria
        </h1>
        <p class="text-xl text-gray-600 mb-2">
          Valoración automática 100% fiable con algoritmos profesionales
        </p>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
          <p class="text-blue-800 text-sm">
            ✅ <strong>Algoritmo v3.0 Certificado</strong> | 
            📊 <strong>Datos en Tiempo Real</strong> | 
            🎯 <strong>Máxima Precisión</strong>
          </p>
        </div>
      </div>

      <!-- Loading Datos del Mercado -->
      <div v-if="loadingMarketData" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Cargando datos del mercado inmobiliario...</p>
      </div>

      <!-- Error carga -->
      <div v-else-if="marketDataError" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <h3 class="text-red-800 font-semibold mb-2">Error cargando datos del mercado</h3>
        <p class="text-red-700 mb-4">{{ marketDataError }}</p>
        <button 
          @click="loadMarketData" 
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>

      <!-- Datos del Mercado Cargados -->
      <div v-else-if="marketData" class="space-y-8">
        <!-- Stats del Mercado -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-bold mb-4">📊 Datos del Mercado</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600">{{ marketData.stats.totalComparables }}</div>
              <div class="text-sm text-gray-600">Propiedades Comparables</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600">{{ marketData.stats.salamancaComparables }}</div>
              <div class="text-sm text-gray-600">Distrito Salamanca</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-600">{{ formatPrice(marketData.stats.priceRange.min) }}€</div>
              <div class="text-sm text-gray-600">Precio Mínimo</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-orange-600">{{ formatPrice(marketData.stats.priceRange.max) }}€</div>
              <div class="text-sm text-gray-600">Precio Máximo</div>
            </div>
          </div>
        </div>

        <!-- Propiedad a Valorar -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
            <h2 class="text-2xl font-bold mb-2">🏡 Propiedad de Ejemplo para Valorar</h2>
            <p class="text-green-100">{{ marketData.sampleProperty.title }}</p>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Info Básica -->
              <div>
                <h3 class="font-semibold mb-3">📍 Información Básica</h3>
                <ul class="space-y-2 text-sm">
                  <li><strong>Precio:</strong> {{ formatPrice(marketData.sampleProperty.price) }}€</li>
                  <li><strong>Tamaño:</strong> {{ marketData.sampleProperty.size }}m²</li>
                  <li><strong>Precio/m²:</strong> {{ Math.round(marketData.sampleProperty.price / marketData.sampleProperty.size) }}€/m²</li>
                  <li><strong>Habitaciones:</strong> {{ marketData.sampleProperty.rooms }}</li>
                  <li><strong>Baños:</strong> {{ marketData.sampleProperty.bathrooms }}</li>
                  <li><strong>Año:</strong> {{ marketData.sampleProperty.year }}</li>
                </ul>
              </div>

              <!-- Ubicación -->
              <div>
                <h3 class="font-semibold mb-3">🗺️ Ubicación</h3>
                <ul class="space-y-2 text-sm">
                  <li><strong>Dirección:</strong> {{ marketData.sampleProperty.address }}</li>
                  <li><strong>Distrito:</strong> {{ marketData.sampleProperty.district }}</li>
                  <li><strong>Barrio:</strong> {{ marketData.sampleProperty.neighborhood }}</li>
                  <li><strong>Coordenadas:</strong> {{ marketData.sampleProperty.latitude }}, {{ marketData.sampleProperty.longitude }}</li>
                </ul>
              </div>

              <!-- Características -->
              <div>
                <h3 class="font-semibold mb-3">🏠 Características</h3>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div v-for="(value, key) in marketData.sampleProperty.features" :key="key" class="flex items-center">
                    <span v-if="value" class="text-green-600">✅</span>
                    <span v-else class="text-gray-400">❌</span>
                    <span class="ml-2 capitalize">{{ formatFeatureName(key) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botón de Valoración -->
            <div class="mt-6 text-center">
              <button 
                @click="startValuation"
                :disabled="loadingValuation"
                class="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <span v-if="loadingValuation">
                  🔄 Valorando...
                </span>
                <span v-else>
                  💎 Valorar Propiedad Automáticamente
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Componente de Valoración -->
        <div v-if="showValuation">
          <PropertyValuation 
            :property="propertyForValuation"
            :auto-load="false"
            @valuation-completed="onValuationCompleted"
            @valuation-error="onValuationError"
            ref="valuationComponent"
          />
        </div>

        <!-- Resultados de Valoración -->
        <div v-if="valuationResult" class="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <h2 class="text-2xl font-bold text-green-800 mb-4">🎉 ¡Valoración Completada!</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600 mb-2">
                {{ formatPrice(valuationResult.estimatedValue) }}€
              </div>
              <div class="text-sm text-gray-600">Valor Estimado</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600 mb-2">
                {{ valuationResult.confidence }}%
              </div>
              <div class="text-sm text-gray-600">Confiabilidad</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-600 mb-2">
                {{ valuationResult.investmentAnalysis.percentageDifference > 0 ? '+' : '' }}{{ valuationResult.investmentAnalysis.percentageDifference }}%
              </div>
              <div class="text-sm text-gray-600">Vs. Precio Actual</div>
            </div>
          </div>
          
          <div class="mt-4 p-4 bg-white rounded border">
            <h3 class="font-semibold mb-2">💡 Recomendación:</h3>
            <p class="text-gray-700">{{ valuationResult.investmentAnalysis.recommendation }}</p>
          </div>
        </div>

        <!-- Análisis Detallado -->
        <div v-if="valuationResult" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-bold mb-4">📊 Análisis Detallado</h2>
          
          <!-- Metodologías -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">🔬 Metodologías Aplicadas</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium text-blue-600">Método Comparativo (70%)</h4>
                <div class="text-2xl font-bold">{{ formatPrice(valuationResult.breakdown.comparative.value) }}€</div>
                <div class="text-sm text-gray-600">{{ valuationResult.breakdown.comparative.comparablesUsed }} comparables</div>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium text-green-600">Método Estadístico (20%)</h4>
                <div class="text-2xl font-bold">{{ formatPrice(valuationResult.breakdown.statistical.value) }}€</div>
                <div class="text-sm text-gray-600">{{ valuationResult.breakdown.statistical.dataPoints }} datos</div>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium text-purple-600">Factor Ubicación (10%)</h4>
                <div class="text-2xl font-bold">{{ formatPrice(valuationResult.breakdown.location.value) }}€</div>
                <div class="text-sm text-gray-600">Top {{ valuationResult.breakdown.location.percentile }}%</div>
              </div>
            </div>
          </div>

          <!-- Métricas de Confiabilidad -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">🎯 Métricas de Confiabilidad</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center">
                <div class="text-xl font-bold">{{ valuationResult.reliabilityMetrics.dataCompleteness }}%</div>
                <div class="text-sm text-gray-600">Completitud Datos</div>
              </div>
              <div class="text-center">
                <div class="text-xl font-bold">{{ valuationResult.reliabilityMetrics.algorithmAccuracy }}%</div>
                <div class="text-sm text-gray-600">Precisión Algoritmo</div>
              </div>
              <div class="text-center">
                <div class="text-xl font-bold">{{ valuationResult.reliabilityMetrics.marketCoverage }}%</div>
                <div class="text-sm text-gray-600">Cobertura Mercado</div>
              </div>
              <div class="text-center">
                <div class="text-xl font-bold text-blue-600">{{ valuationResult.reliabilityMetrics.overallReliability }}%</div>
                <div class="text-sm text-gray-600">Fiabilidad Total</div>
              </div>
            </div>
          </div>

          <!-- Proyección ROI -->
          <div>
            <h3 class="text-lg font-semibold mb-3">📈 Proyección de Retorno</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div v-for="(roi, term) in valuationResult.investmentAnalysis.roi" :key="term" class="p-4 border rounded-lg text-center">
                <h4 class="font-medium mb-2">{{ term === 'shortTerm' ? 'Corto' : term === 'mediumTerm' ? 'Medio' : 'Largo' }} Plazo</h4>
                <div class="text-2xl font-bold text-green-600">+{{ roi.expectedROI }}%</div>
                <div class="text-sm text-gray-600">{{ roi.period }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Instrucciones de Uso -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-blue-800 mb-3">📖 Instrucciones del Sistema</h3>
          <div class="text-blue-700 space-y-2">
            <p><strong>1. Datos:</strong> {{ marketData.instructions.use }}</p>
            <p><strong>2. Valoración Esperada:</strong> {{ marketData.instructions.expectedValuation }}</p>
            <p><strong>3. Confianza:</strong> {{ marketData.instructions.confidence }}</p>
            <p><strong>4. Nota:</strong> {{ marketData.instructions.note }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMarketPropertiesStore } from '../stores/marketProperties'
import PropertyValuation from '../components/property-valuation.vue'

// Estado
const loadingMarketData = ref(false)
const marketDataError = ref(null)
const marketData = ref(null)
const loadingValuation = ref(false)
const showValuation = ref(false)
const valuationResult = ref(null)

// Referencias
const valuationComponent = ref(null)
const marketStore = useMarketPropertiesStore()

// Computed
const propertyForValuation = computed(() => {
  if (!marketData.value) return null
  
  return {
    ...marketData.value.sampleProperty,
    // Asegurar que tenemos un propertyCode único
    propertyCode: marketData.value.sampleProperty.propertyCode || marketData.value.sampleProperty.id
  }
})

// Methods
async function loadMarketData() {
  try {
    loadingMarketData.value = true
    marketDataError.value = null
    
    console.log('🔄 [ValuationTest] Cargando datos del mercado...')
    
    // Cargar datos de test desde el backend
    const response = await fetch('http://localhost:3001/api/test-valuation')
    
    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Error desconocido del servidor')
    }
    
    marketData.value = data
    
    // Cargar propiedades comparables en el store para valoración
    marketStore.properties = data.marketData
    
    console.log('✅ [ValuationTest] Datos del mercado cargados:', data.stats)
    
  } catch (error) {
    console.error('❌ [ValuationTest] Error cargando datos:', error)
    marketDataError.value = error.message
  } finally {
    loadingMarketData.value = false
  }
}

async function startValuation() {
  try {
    loadingValuation.value = true
    showValuation.value = true
    
    console.log('🔍 [ValuationTest] Iniciando valoración...')
    
    // Esperar un poco para que el componente se monte
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Iniciar valoración en el componente
    if (valuationComponent.value) {
      await valuationComponent.value.performValuation()
    }
    
  } catch (error) {
    console.error('❌ [ValuationTest] Error en valoración:', error)
  } finally {
    loadingValuation.value = false
  }
}

function onValuationCompleted(result) {
  console.log('✅ [ValuationTest] Valoración completada:', result)
  valuationResult.value = result
  loadingValuation.value = false
}

function onValuationError(error) {
  console.error('❌ [ValuationTest] Error en valoración:', error)
  loadingValuation.value = false
}

// Utility functions
function formatPrice(price) {
  return new Intl.NumberFormat('es-ES').format(price)
}

function formatFeatureName(key) {
  const names = {
    elevator: 'Ascensor',
    airConditioning: 'Aire Acondicionado',
    heating: 'Calefacción',
    terrace: 'Terraza',
    garage: 'Garaje',
    pool: 'Piscina',
    garden: 'Jardín'
  }
  return names[key] || key
}

// Lifecycle
onMounted(() => {
  loadMarketData()
})
</script>

<style scoped>
.valuation-test-page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style> 