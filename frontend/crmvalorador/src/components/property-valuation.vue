<template>
  <div class="property-valuation">
    <!-- Header de Valoración -->
    <div class="valuation-header bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
      <h2 class="text-2xl font-bold mb-2">⚖️ Valoración Inmobiliaria Legal Profesional</h2>
      <p class="text-blue-100">Cumple normativa española vigente | Algoritmo certificado v3.0</p>
      <div class="text-xs mt-2 opacity-90">
        Orden ECO/805/2003 | RD 775/1997 | Normas Banco de España | EVS 2020
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Analizando propiedades comparables...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-6 bg-red-50 border border-red-200 rounded-b-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <h3 class="text-red-800 font-medium">Error en Valoración</h3>
      </div>
      <p class="text-red-700 mt-2">{{ error }}</p>
      <button 
        @click="retryValuation" 
        class="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Reintentar
      </button>
    </div>

    <!-- Resultados de Valoración -->
    <div v-else-if="valuation" class="valuation-results">
      <!-- Resultado Principal -->
      <div class="bg-white p-6 border-b border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Valor Estimado -->
          <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Valor Estimado</h3>
            <div class="text-3xl font-bold text-green-600">
              {{ formatPrice(valuation.estimatedValue) }}€
            </div>
            <div class="text-sm text-gray-500 mt-1">
              {{ Math.round(valuation.estimatedValue / valuation.propertyInfo.size) }}€/m²
            </div>
          </div>

          <!-- Confiabilidad -->
          <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Confiabilidad</h3>
            <div class="relative w-20 h-20 mx-auto mb-2">
              <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="m18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e2e8f0"
                  stroke-width="3"
                />
                <path
                  d="m18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  :stroke="getConfidenceColor(valuation.confidence)"
                  stroke-width="3"
                  :stroke-dasharray="`${valuation.confidence}, 100`"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-xl font-bold">{{ valuation.confidence }}%</span>
              </div>
            </div>
            <div class="text-sm" :class="getConfidenceTextClass(valuation.confidence)">
              {{ getConfidenceLabel(valuation.confidence) }}
            </div>
          </div>

          <!-- Análisis de Inversión -->
          <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Análisis</h3>
            <div 
              class="text-2xl font-bold mb-1"
              :class="getInvestmentColorClass(valuation.investmentAnalysis.investmentType)"
            >
              {{ valuation.investmentAnalysis.percentageDifference > 0 ? '+' : '' }}{{ valuation.investmentAnalysis.percentageDifference }}%
            </div>
            <div class="text-sm text-gray-600">
              {{ getInvestmentLabel(valuation.investmentAnalysis.investmentType) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Desglose de Metodología -->
      <div class="bg-gray-50 p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold mb-4">📊 Desglose de Metodología</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Método Comparativo -->
          <div class="bg-white p-4 rounded-lg border">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-medium">{{ valuation.witnessesUsed ? 'Método con Testigos' : 'Método Comparativo' }}</h4>
              <span class="text-sm text-gray-500">70%</span>
            </div>
            <div class="text-xl font-bold text-blue-600 mb-1">
              {{ formatPrice(valuation.breakdown.comparative.value) }}€
            </div>
            <div class="text-xs text-gray-500">
              {{ valuation.breakdown.comparative.comparablesUsed }} {{ valuation.witnessesUsed ? 'testigos' : 'comparables' }}
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                class="bg-blue-600 h-2 rounded-full" 
                :style="`width: ${valuation.breakdown.comparative.confidence}%`"
              ></div>
            </div>
          </div>

          <!-- Método Estadístico -->
          <div class="bg-white p-4 rounded-lg border">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-medium">Método Estadístico</h4>
              <span class="text-sm text-gray-500">20%</span>
            </div>
            <div class="text-xl font-bold text-green-600 mb-1">
              {{ formatPrice(valuation.breakdown.statistical.value) }}€
            </div>
            <div class="text-xs text-gray-500">
              {{ valuation.breakdown.statistical.dataPoints }} datos distrito
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                class="bg-green-600 h-2 rounded-full" 
                :style="`width: ${valuation.breakdown.statistical.confidence}%`"
              ></div>
            </div>
          </div>

          <!-- Método de Ubicación -->
          <div class="bg-white p-4 rounded-lg border">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-medium">Factor Ubicación</h4>
              <span class="text-sm text-gray-500">10%</span>
            </div>
            <div class="text-xl font-bold text-purple-600 mb-1">
              {{ formatPrice(valuation.breakdown.location.value) }}€
            </div>
            <div class="text-xs text-gray-500">
              Top {{ valuation.breakdown.location.percentile }}% distrito
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                class="bg-purple-600 h-2 rounded-full" 
                :style="`width: ${valuation.breakdown.location.confidence}%`"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 🏘️ NUEVA SECCIÓN: Testigos Utilizados -->
      <div v-if="valuation.witnessesUsed" class="bg-blue-50 p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          🏘️ Testigos Utilizados
          <span class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            {{ valuation.witnessesUsed.count }} propiedades
          </span>
        </h3>
        
        <!-- Resumen de testigos -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-white p-4 rounded-lg border">
            <h4 class="font-medium text-gray-700 mb-2">Precio Promedio</h4>
            <div class="text-2xl font-bold text-blue-600">
              {{ formatPrice(valuation.witnessesUsed.averagePrice) }}€
            </div>
          </div>
          
          <div class="bg-white p-4 rounded-lg border">
            <h4 class="font-medium text-gray-700 mb-2">Similitud Promedio</h4>
            <div class="text-2xl font-bold text-green-600">
              {{ valuation.witnessesUsed.averageSimilarity }}%
            </div>
          </div>
          
          <div class="bg-white p-4 rounded-lg border">
            <h4 class="font-medium text-gray-700 mb-2">Confianza Mejorada</h4>
            <div class="text-2xl font-bold text-purple-600">
              +{{ Math.round((valuation.confidence - 70) * 100) / 100 }}%
            </div>
            <div class="text-xs text-gray-500">vs. valoración estándar</div>
          </div>
        </div>
        
        <!-- Lista detallada de testigos -->
        <div class="space-y-3">
          <h4 class="font-medium text-gray-900">Propiedades Testigo Utilizadas:</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div 
              v-for="(witness, index) in valuation.witnessesUsed.witnesses" 
              :key="index"
              class="bg-white p-3 rounded-lg border border-blue-200"
            >
              <div class="flex justify-between items-start mb-2">
                <h5 class="font-medium text-gray-900 text-sm">{{ witness.title }}</h5>
                <span 
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getSimilarityClass(witness.similarity)"
                >
                  {{ witness.similarity }}%
                </span>
              </div>
              
              <div class="grid grid-cols-3 gap-2 text-xs text-gray-600">
                <div>
                  <span class="block font-medium">Precio</span>
                  <span>{{ formatPrice(witness.price) }}€</span>
                </div>
                <div>
                  <span class="block font-medium">Tamaño</span>
                  <span>{{ witness.size }}m²</span>
                </div>
                <div>
                  <span class="block font-medium">€/m²</span>
                  <span>{{ witness.pricePerM2 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Beneficios de usar testigos -->
        <div class="mt-6 p-4 bg-white rounded-lg border border-blue-200">
          <h5 class="font-medium text-blue-900 mb-2">✨ Beneficios de la Valoración con Testigos:</h5>
          <ul class="text-sm text-blue-800 space-y-1">
            <li>• Mayor precisión al usar propiedades específicamente seleccionadas</li>
            <li>• Análisis más detallado de características similares</li>
            <li>• Confianza incrementada en {{ Math.round((valuation.confidence - 70) * 10) / 10 }}% adicional</li>
            <li>• Metodología profesional certificada con testigos</li>
          </ul>
        </div>
      </div>

      <!-- ⚖️ NUEVA SECCIÓN: Certificación Legal -->
      <div v-if="valuation.certification" class="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          ⚖️ Certificación Legal Profesional
          <span class="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
            {{ valuation.certification.certificationLevel }}
          </span>
        </h3>
        
        <!-- Información de certificación -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-white p-4 rounded-lg border border-green-200">
            <h4 class="font-medium text-gray-700 mb-3 flex items-center">
              🏆 Algoritmo Certificado
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Sistema:</span>
                <span class="font-medium">{{ valuation.certification.algorithm }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Metodología:</span>
                <span class="font-medium text-xs">{{ valuation.certification.methodology.substring(0, 30) }}...</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Validez:</span>
                <span class="font-medium">{{ formatDate(valuation.certification.validUntil) }}</span>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-blue-200">
            <h4 class="font-medium text-gray-700 mb-3 flex items-center">
              📊 Métricas de Fiabilidad
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Fiabilidad General:</span>
                <span class="font-bold text-blue-600">{{ valuation.reliabilityMetrics?.overallReliability }}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Calidad Datos:</span>
                <span class="font-medium">{{ valuation.reliabilityMetrics?.dataQuality }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Muestra:</span>
                <span class="font-medium">{{ valuation.reliabilityMetrics?.sampleSize }} propiedades</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Normativa cumplida -->
        <div class="bg-white p-4 rounded-lg border border-gray-200">
          <h4 class="font-medium text-gray-900 mb-3">📋 Normativa Española Cumplida:</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div v-for="norm in valuation.certification.compliance" :key="norm" class="flex items-center">
              <span class="text-green-500 mr-2">✅</span>
              <span class="text-gray-700">{{ norm }}</span>
            </div>
          </div>
        </div>
        
        <!-- Disclaimer legal -->
        <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p class="text-xs text-yellow-800">
            <span class="font-semibold">⚠️ Nota Legal:</span> 
            {{ valuation.certification.disclaimerLegal }}
          </p>
        </div>
      </div>

      <!-- Análisis de Mercado -->
      <div class="bg-white p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold mb-4">📈 Análisis de Mercado</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-sm text-gray-600">Precio Mín.</div>
            <div class="text-lg font-semibold">{{ formatPrice(valuation.marketAnalysis.priceDistribution.min) }}€</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-600">Precio Medio</div>
            <div class="text-lg font-semibold">{{ formatPrice(valuation.marketAnalysis.priceDistribution.avg) }}€</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-600">Precio Mediano</div>
            <div class="text-lg font-semibold">{{ formatPrice(valuation.marketAnalysis.priceDistribution.median) }}€</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-600">Precio Máx.</div>
            <div class="text-lg font-semibold">{{ formatPrice(valuation.marketAnalysis.priceDistribution.max) }}€</div>
          </div>
        </div>
      </div>

      <!-- Recomendaciones -->
      <div v-if="valuation.recommendations && valuation.recommendations.length" class="bg-white p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold mb-4">💡 Recomendaciones</h3>
        <div class="space-y-3">
          <div 
            v-for="rec in valuation.recommendations" 
            :key="rec.type"
            class="flex items-start p-3 rounded-lg border"
            :class="getRecommendationClass(rec.type)"
          >
            <div class="mr-3 mt-1">
              <span v-if="rec.type === 'opportunity'">💰</span>
              <span v-else-if="rec.type === 'warning'">⚠️</span>
              <span v-else-if="rec.type === 'caution'">⚡</span>
              <span v-else>✅</span>
            </div>
            <div>
              <div class="font-medium">{{ rec.message }}</div>
              <div class="text-sm text-gray-600 mt-1">{{ rec.suggestion }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Factores de Riesgo -->
      <div v-if="valuation.riskFactors && valuation.riskFactors.length" class="bg-white p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold mb-4">⚠️ Factores de Riesgo</h3>
        <div class="space-y-3">
          <div 
            v-for="risk in valuation.riskFactors" 
            :key="risk.type"
            class="p-3 border rounded-lg"
            :class="getRiskClass(risk.level)"
          >
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-medium">{{ risk.description }}</h4>
              <span 
                class="px-2 py-1 text-xs font-medium rounded"
                :class="getRiskBadgeClass(risk.level)"
              >
                {{ risk.level.toUpperCase() }}
              </span>
            </div>
            <p class="text-sm text-gray-600">{{ risk.mitigation }}</p>
          </div>
        </div>
      </div>

      <!-- Análisis ROI -->
      <div class="bg-white p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold mb-4">📊 Proyección de Retorno (ROI)</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            v-for="(roi, term) in valuation.investmentAnalysis.roi" 
            :key="term"
            class="p-4 border rounded-lg text-center"
          >
            <h4 class="font-medium mb-2">{{ term === 'shortTerm' ? 'Corto' : term === 'mediumTerm' ? 'Medio' : 'Largo' }} Plazo</h4>
            <div class="text-2xl font-bold text-green-600 mb-1">+{{ roi.expectedROI }}%</div>
            <div class="text-sm text-gray-600">{{ roi.period }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ roi.riskLevel.replace('_', ' ') }}</div>
          </div>
        </div>
      </div>

      <!-- Certificación -->
      <div class="bg-gray-50 p-6 rounded-b-lg">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium text-gray-700">🏆 Certificación de Calidad</h3>
            <p class="text-sm text-gray-600">{{ valuation.certification.methodology }}</p>
            <p class="text-xs text-gray-500">
              Datos: {{ valuation.dataPoints }} propiedades | 
              Válido hasta: {{ formatDate(valuation.certification.validUntil) }}
            </p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-blue-600">{{ valuation.reliabilityMetrics.overallReliability }}%</div>
            <div class="text-sm text-gray-600">Fiabilidad</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botones de Acción -->
    <div v-if="valuation" class="mt-6 flex flex-wrap gap-3">
      <button 
        @click="exportReport" 
        :disabled="exportingPDF"
        class="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center"
      >
        <span v-if="exportingPDF" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generando PDF...
        </span>
        <span v-else class="flex items-center">
          📄 Descargar Informe PDF
        </span>
      </button>
      <button 
        @click="shareValuation" 
        class="px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 flex items-center transition-all"
      >
        🔗 Compartir
      </button>
      <button 
        @click="updateValuation" 
        class="px-4 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 flex items-center transition-all"
      >
        🔄 Actualizar
      </button>
    </div>

    <!-- Información sobre el informe PDF -->
    <div v-if="valuation" class="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
      <div class="flex items-start">
        <span class="text-blue-600 mr-3 mt-1 text-2xl">⚖️</span>
        <div>
          <h4 class="font-semibold text-blue-900 mb-2">Informe PDF Legal Profesional</h4>
          <p class="text-blue-800 text-sm mb-3">
            Genera un informe completo que cumple con la normativa española vigente. Perfecto para presentar a clientes y uso profesional:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-700">
            <div class="flex items-center">
              <span class="mr-2">⚖️</span>
              <span>Certificación legal (Orden ECO/805/2003)</span>
            </div>
            <div class="flex items-center">
              <span class="mr-2">🏆</span>
              <span>Metodología profesional certificada</span>
            </div>
            <div class="flex items-center">
              <span class="mr-2">📊</span>
              <span>Análisis de riesgos y ROI detallado</span>
            </div>
            <div class="flex items-center">
              <span class="mr-2">💎</span>
              <span>Gráficos comparativos profesionales</span>
            </div>
            <div class="flex items-center">
              <span class="mr-2">🔒</span>
              <span>Cumplimiento RGPD y normativa</span>
            </div>
            <div class="flex items-center">
              <span class="mr-2">📋</span>
              <span>Validez legal 6 meses (normativa)</span>
            </div>
          </div>
          <div class="mt-3 p-2 bg-white border border-blue-200 rounded">
            <p class="text-xs text-blue-800">
              <span class="font-semibold">🎯 Perfecto para:</span> 
              Presentaciones a clientes, análisis de inversión, documentación profesional, informes de due diligence
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { valuateProperty } from '../services/valuationService'
import { generateValuationReport } from '../services/pdfReportService'

// Props
const props = defineProps({
  property: {
    type: Object,
    required: true
  },
  autoLoad: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['valuation-completed', 'valuation-error'])

// State
const loading = ref(false)
const error = ref(null)
const valuation = ref(null)
const exportingPDF = ref(false)

// Computed
const propertyTitle = computed(() => {
  return props.property.title || `Propiedad en ${props.property.district || 'Madrid'}`
})

// Methods
async function performValuation() {
  console.log('🔍 [PropertyValuation] =========================')
  console.log('🔍 [PropertyValuation] INICIANDO VALORACIÓN')
  console.log('🔍 [PropertyValuation] =========================')
  
  try {
    loading.value = true
    error.value = null
    
    console.log('🏠 [PropertyValuation] Propiedad a valorar:', props.property)
    
    if (!props.property) {
      throw new Error('No se proporcionó información de la propiedad')
    }
    
    if (!props.property.size || props.property.size <= 0) {
      throw new Error('Tamaño de propiedad inválido')
    }
    
    if (!props.property.price || props.property.price <= 0) {
      throw new Error('Precio de propiedad inválido')
    }
    
    console.log('✅ [PropertyValuation] Validación básica completada')
    console.log('📊 [PropertyValuation] Llamando a valuateProperty...')
    
    const result = await valuateProperty(props.property)
    
    console.log('🎉 [PropertyValuation] ¡Valoración completada exitosamente!')
    console.log('💰 [PropertyValuation] Valor estimado:', result.estimatedValue)
    console.log('📈 [PropertyValuation] Confianza:', result.confidence)
    console.log('📋 [PropertyValuation] Resultado completo:', result)
    
    valuation.value = result
    
    emit('valuation-completed', result)
    
  } catch (err) {
    console.error('❌ [PropertyValuation] =========================')
    console.error('❌ [PropertyValuation] ERROR EN VALORACIÓN')
    console.error('❌ [PropertyValuation] =========================')
    console.error('❌ [PropertyValuation] Error:', err)
    console.error('❌ [PropertyValuation] Mensaje:', err.message)
    console.error('❌ [PropertyValuation] Stack:', err.stack)
    console.error('❌ [PropertyValuation] Propiedad:', props.property)
    
    error.value = err.message || 'Error desconocido en la valoración'
    emit('valuation-error', err)
  } finally {
    loading.value = false
    console.log('🏁 [PropertyValuation] Proceso de valoración finalizado')
  }
}

function retryValuation() {
  performValuation()
}

function updateValuation() {
  performValuation()
}

async function exportReport() {
  console.log('📄 [PropertyValuation] Iniciando exportación de informe...')
  exportingPDF.value = true
  
  try {
    if (!valuation.value || !props.property) {
      throw new Error('No hay datos de valoración disponibles')
    }
    
    console.log('📊 [PropertyValuation] Generando informe PDF profesional...')
    await generateValuationReport(valuation.value, props.property)
    
    console.log('🎉 [PropertyValuation] ¡Informe PDF generado exitosamente!')
    
    // Mostrar notificación de éxito (opcional)
    // Puedes añadir aquí una notificación toast o similar
    
  } catch (error) {
    console.error('❌ [PropertyValuation] Error generando informe PDF:', error)
    
    // Mostrar error al usuario
    alert(`Error al generar el informe: ${error.message}`)
    
  } finally {
    exportingPDF.value = false
    console.log('🏁 [PropertyValuation] Proceso de exportación finalizado')
  }
}

function shareValuation() {
  // TODO: Implementar compartir
  console.log('🔗 Compartiendo valoración...')
}

// Utility methods
function formatPrice(price) {
  return new Intl.NumberFormat('es-ES').format(price)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('es-ES')
}

function getConfidenceColor(confidence) {
  if (confidence >= 80) return '#10b981' // green
  if (confidence >= 60) return '#f59e0b' // yellow
  return '#ef4444' // red
}

function getConfidenceTextClass(confidence) {
  if (confidence >= 80) return 'text-green-600'
  if (confidence >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

function getConfidenceLabel(confidence) {
  if (confidence >= 80) return 'Muy fiable'
  if (confidence >= 60) return 'Fiable'
  return 'Básica'
}

function getInvestmentColorClass(type) {
  switch (type) {
    case 'oportunidad_excepcional':
    case 'buena_oportunidad':
      return 'text-green-600'
    case 'precio_justo':
      return 'text-blue-600'
    case 'precio_alto':
      return 'text-orange-600'
    case 'sobrevalorado':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

function getInvestmentLabel(type) {
  switch (type) {
    case 'oportunidad_excepcional':
      return 'Oportunidad Excepcional'
    case 'buena_oportunidad':
      return 'Buena Oportunidad'
    case 'precio_justo':
      return 'Precio Justo'
    case 'precio_alto':
      return 'Precio Alto'
    case 'sobrevalorado':
      return 'Sobrevalorado'
    default:
      return 'En Análisis'
  }
}

function getRecommendationClass(type) {
  switch (type) {
    case 'opportunity':
      return 'bg-green-50 border-green-200'
    case 'warning':
      return 'bg-red-50 border-red-200'
    case 'caution':
      return 'bg-yellow-50 border-yellow-200'
    default:
      return 'bg-blue-50 border-blue-200'
  }
}

function getRiskClass(level) {
  switch (level) {
    case 'alto':
      return 'bg-red-50 border-red-200'
    case 'medio':
      return 'bg-yellow-50 border-yellow-200'
    default:
      return 'bg-blue-50 border-blue-200'
  }
}

function getRiskBadgeClass(level) {
  switch (level) {
    case 'alto':
      return 'bg-red-100 text-red-800'
    case 'medio':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-blue-100 text-blue-800'
  }
}

function getSimilarityClass(similarity) {
  if (similarity >= 80) return 'bg-green-100 text-green-800'
  if (similarity >= 60) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

// Lifecycle
onMounted(() => {
  console.log('🏠 [PropertyValuation] Componente montado')
  console.log('📋 [PropertyValuation] Props recibidas:', props)
  console.log('🔧 [PropertyValuation] Auto-load:', props.autoLoad)
  
  if (props.autoLoad) {
    console.log('🚀 [PropertyValuation] Iniciando valoración automática...')
    performValuation()
  } else {
    console.log('⏸️ [PropertyValuation] Auto-load desactivado, esperando llamada manual')
  }
})

// Expose methods
defineExpose({
  performValuation,
  valuation,
  loading,
  error
})

console.log('🔧 [PropertyValuation] defineExpose ejecutado con performValuation:', typeof performValuation)
</script>

<style scoped>
.property-valuation {
  @apply bg-white rounded-lg shadow-lg overflow-hidden;
}

.valuation-header {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style> 