<template>
  <div class="valuations-page w-full">
    <!-- Hero Section - Premium Design -->
    <section class="hero-section w-full">
      <div class="hero-background"></div>
      <div class="hero-content w-full">
        <div class="w-full px-4 lg:px-8 py-20 lg:py-32">
          <div class="text-center max-w-7xl mx-auto">
            <!-- Badge -->
            <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8">
              <span class="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
              Sistema de Valoración v3.0 - En línea
            </div>
            
            <!-- Main Title -->
            <h1 class="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Valoración
              <span class="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Inmobiliaria
              </span>
              <br>Profesional
            </h1>
            
            <!-- Subtitle -->
            <p class="text-xl lg:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              Obtén una valoración precisa y confiable con nuestro algoritmo certificado.
              <strong class="text-white">Hasta 95% de precisión</strong> garantizada.
            </p>
            
            <!-- CTA Button -->
            <div class="mb-16">
              <button 
                @click="openValuationWizard"
                class="cta-button group"
              >
                <span class="relative z-10 flex items-center">
                  <svg class="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  Valorar mi Propiedad
                  <svg class="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </span>
              </button>
            </div>
            
            <!-- Stats -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div class="stats-item">
                <div class="stats-number">95%</div>
                <div class="stats-label">Precisión</div>
              </div>
              <div class="stats-item">
                <div class="stats-number">30s</div>
                <div class="stats-label">Tiempo</div>
              </div>
              <div class="stats-item">
                <div class="stats-number">4</div>
                <div class="stats-label">Portales</div>
              </div>
              <div class="stats-item">
                <div class="stats-number">100%</div>
                <div class="stats-label">Gratuito</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Scroll Indicator -->
      <div class="scroll-indicator">
        <div class="scroll-arrow"></div>
      </div>
    </section>

    <!-- Features Section - Premium Design -->
    <section class="features-section">
      <div class="w-full px-4 lg:px-8 py-24">
        <!-- Section Header -->
        <div class="text-center mb-20">
          <div class="section-badge">¿Por qué elegirnos?</div>
          <h2 class="section-title">
            La tecnología más avanzada
            <br>para valoraciones precisas
          </h2>
          <p class="section-subtitle">
            Combinamos inteligencia artificial, análisis de big data y algoritmos certificados
            para ofrecerte la valoración más precisa del mercado inmobiliario.
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
          <!-- Feature 1 -->
          <div class="overflow-hidden p-2">
            <div class="bg-white rounded-3xl p-6 border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer aspect-square flex flex-col justify-center items-center text-center">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4">Algoritmo Científico</h3>
              <p class="text-gray-600 text-sm leading-relaxed mb-4">
                Metodología basada en 3 algoritmos profesionales certificados
              </p>
              <div class="bg-blue-50 px-4 py-2 rounded-xl">
                <span class="text-2xl font-bold text-blue-600">95%</span>
                <div class="text-xs text-gray-600">Precisión</div>
              </div>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="overflow-hidden p-2">
            <div class="bg-white rounded-3xl p-6 border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer aspect-square flex flex-col justify-center items-center text-center">
              <div class="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4">Datos en Tiempo Real</h3>
              <p class="text-gray-600 text-sm leading-relaxed mb-4">
                Acceso instantáneo a miles de propiedades actualizadas
              </p>
              <div class="bg-emerald-50 px-4 py-2 rounded-xl">
                <span class="text-2xl font-bold text-emerald-600">10K+</span>
                <div class="text-xs text-gray-600">Propiedades</div>
              </div>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="overflow-hidden p-2">
            <div class="bg-white rounded-3xl p-6 border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer aspect-square flex flex-col justify-center items-center text-center">
              <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4">Inteligencia Artificial</h3>
              <p class="text-gray-600 text-sm leading-relaxed mb-4">
                Machine learning avanzado que aprende continuamente
              </p>
              <div class="bg-purple-50 px-4 py-2 rounded-xl">
                <span class="text-2xl font-bold text-purple-600">AAA+</span>
                <div class="text-xs text-gray-600">Confiabilidad</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="process-section">
      <div class="w-full px-4 lg:px-8 py-24">
        <!-- Section Header -->
        <div class="text-center mb-20">
          <div class="section-badge">Proceso simplificado</div>
          <h2 class="section-title">
            4 pasos para tu valoración
            <br>profesional
          </h2>
          <p class="section-subtitle">
            Un proceso intuitivo y rápido diseñado para obtener resultados precisos en minutos
          </p>
        </div>

        <!-- Process Steps -->
        <div class="w-full max-w-7xl mx-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            <!-- Step 1 -->
            <div class="process-step group">
              <div class="process-number">
                <span>01</span>
                <div class="process-icon">🏠</div>
              </div>
              <h3 class="process-title">Datos Básicos</h3>
              <p class="process-description">
                Introduce precio, tamaño, habitaciones y baños de tu propiedad
              </p>
              <div class="process-time">~30 segundos</div>
            </div>

            <!-- Step 2 -->
            <div class="process-step group">
              <div class="process-number">
                <span>02</span>
                <div class="process-icon">📍</div>
              </div>
              <h3 class="process-title">Ubicación</h3>
              <p class="process-description">
                Especifica dirección, distrito y año de construcción
              </p>
              <div class="process-time">~45 segundos</div>
            </div>

            <!-- Step 3 -->
            <div class="process-step group">
              <div class="process-number">
                <span>03</span>
                <div class="process-icon">✨</div>
              </div>
              <h3 class="process-title">Características</h3>
              <p class="process-description">
                Selecciona extras como ascensor, garaje, terraza, etc.
              </p>
              <div class="process-time">~30 segundos</div>
            </div>

            <!-- Step 4 -->
            <div class="process-step group">
              <div class="process-number">
                <span>04</span>
                <div class="process-icon">💎</div>
              </div>
              <h3 class="process-title">Valoración</h3>
              <p class="process-description">
                Recibe tu informe completo y profesional al instante
              </p>
              <div class="process-time">~15 segundos</div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="text-center mt-16">
          <button 
            @click="openValuationWizard"
            class="secondary-button"
          >
            <span>Comenzar valoración ahora</span>
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Previous Valuations -->
    <section v-if="previousValuations.length > 0" class="valuations-history-section">
      <div class="w-full px-4 lg:px-8 py-24">
        <div class="max-w-7xl mx-auto">
          <div class="flex justify-between items-center mb-12">
            <div>
              <h2 class="text-3xl font-bold text-gray-900 mb-2">Historial de Valoraciones</h2>
              <p class="text-gray-600">Tus valoraciones anteriores guardadas de forma segura</p>
            </div>
            <button 
              @click="clearValuations"
              class="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
            >
              Limpiar historial
            </button>
          </div>

          <div class="grid lg:grid-cols-3 gap-6">
            <div 
              v-for="(valuation, index) in previousValuations" 
              :key="index"
              class="valuation-card"
              @click="showValuationDetails(valuation)"
            >
              <!-- Card Header -->
              <div class="valuation-card-header">
                <h3 class="valuation-title">
                  {{ valuation.propertyInfo?.address || 'Propiedad' }}
                </h3>
                <span class="valuation-date">
                  {{ formatDate(valuation.timestamp) }}
                </span>
              </div>

              <!-- Card Content -->
              <div class="valuation-card-content">
                <div class="valuation-price">
                  <span class="price-label">Valor estimado</span>
                  <span class="price-value">{{ formatPrice(valuation.estimatedValue) }}€</span>
                </div>
                
                <div class="valuation-details">
                  <div class="detail-item">
                    <span class="detail-label">Confiabilidad</span>
                    <span class="detail-value" :class="getConfidenceClass(valuation.confidence)">
                      {{ valuation.confidence }}%
                    </span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Distrito</span>
                    <span class="detail-value">{{ valuation.propertyInfo?.district }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Tamaño</span>
                    <span class="detail-value">{{ valuation.propertyInfo?.size }}m²</span>
                  </div>
                </div>

                <!-- Investment Type -->
                <div class="investment-badge" :class="getInvestmentBadgeClass(valuation.investmentAnalysis?.investmentType)">
                  {{ getInvestmentLabel(valuation.investmentAnalysis?.investmentType) }}
                </div>
              </div>

              <!-- Card Footer -->
              <div class="valuation-card-footer">
                <div class="footer-actions">
                  <button 
                    @click.stop="downloadPDF(valuation, index)"
                    :disabled="downloadingPDF === index"
                    class="pdf-download-button"
                  >
                    <span v-if="downloadingPDF === index" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generando...
                    </span>
                    <span v-else class="flex items-center">
                      📄 Descargar PDF
                    </span>
                  </button>
                  <span class="view-details" @click="showValuationDetails(valuation)">Ver informe completo →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Section -->
    <section class="demo-section">
      <div class="w-full px-4 lg:px-8 py-24">
        <div class="max-w-5xl mx-auto">
          <div class="demo-card">
            <div class="demo-content">
              <div class="demo-header">
                <h2 class="demo-title">¿Quieres probar el sistema?</h2>
                <p class="demo-subtitle">
                  Prueba nuestro algoritmo con una propiedad de ejemplo en el distrito de Salamanca
                </p>
              </div>

              <div class="demo-body">
                <div class="demo-property">
                  <h3 class="property-title">🏡 Propiedad de Ejemplo</h3>
                  <div class="property-details">
                    <div class="property-item">
                      <span class="property-label">Ubicación</span>
                      <span class="property-value">Salamanca, Madrid</span>
                    </div>
                    <div class="property-item">
                      <span class="property-label">Tamaño</span>
                      <span class="property-value">120m²</span>
                    </div>
                    <div class="property-item">
                      <span class="property-label">Habitaciones</span>
                      <span class="property-value">3</span>
                    </div>
                    <div class="property-item">
                      <span class="property-label">Precio</span>
                      <span class="property-value">1.200.000€</span>
                    </div>
                  </div>
                </div>

                <div class="demo-action">
                  <button 
                    @click="runDemo"
                    :disabled="isRunningDemo"
                    class="demo-button"
                  >
                    <span v-if="isRunningDemo" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Ejecutando demo...
                    </span>
                    <span v-else class="flex items-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-8 4h8m-8 0V10a1 1 0 011-1h6a1 1 0 011 1v8a1 1 0 01-1 1H8a1 1 0 01-1-1z"></path>
                      </svg>
                      Ver Demo Interactivo
                    </span>
                  </button>
                  <p class="demo-time">⏱️ Demo completo en 2 minutos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Wizard Component -->
    <ValuationWizard 
      :is-open="showWizard"
      @close="closeWizard"
      @valuation-completed="onValuationCompleted"
    />

    <!-- Details Modal -->
    <div v-if="selectedValuation" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Informe de Valoración Detallado</h3>
            <button @click="closeDetails" class="modal-close">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <PropertyValuation 
              :property="selectedValuation"
              :auto-load="false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ValuationWizard from '../components/valuation-wizard.vue'
import PropertyValuation from '../components/property-valuation.vue'
import { generateValuationReport } from '../services/pdfReportService'

// Router
const router = useRouter()

// State
const showWizard = ref(false)
const isRunningDemo = ref(false)
const previousValuations = ref([])
const selectedValuation = ref(null)
const downloadingPDF = ref(null)

// Methods
function openValuationWizard() {
  showWizard.value = true
}

function closeWizard() {
  showWizard.value = false
}

function onValuationCompleted(valuation) {
  const saved = JSON.parse(localStorage.getItem('crm_valuations') || '[]')
  saved.unshift(valuation)
  
  if (saved.length > 10) {
    saved.splice(10)
  }
  
  localStorage.setItem('crm_valuations', JSON.stringify(saved))
  loadPreviousValuations()
  closeWizard()
}

function loadPreviousValuations() {
  try {
    const saved = JSON.parse(localStorage.getItem('crm_valuations') || '[]')
    previousValuations.value = saved
  } catch (error) {
    console.error('Error cargando valoraciones:', error)
    previousValuations.value = []
  }
}

function clearValuations() {
  if (confirm('¿Estás seguro de que quieres eliminar todas las valoraciones guardadas?')) {
    localStorage.removeItem('crm_valuations')
    previousValuations.value = []
  }
}

function showValuationDetails(valuation) {
  selectedValuation.value = valuation
}

function closeDetails() {
  selectedValuation.value = null
}

async function runDemo() {
  isRunningDemo.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/valuation-test')
  } catch (error) {
    console.error('Error ejecutando demo:', error)
  } finally {
    isRunningDemo.value = false
  }
}

async function downloadPDF(valuation, index) {
  console.log('📄 [Valuations] Iniciando descarga de PDF para valoración:', valuation)
  downloadingPDF.value = index
  
  try {
    if (!valuation || !valuation.propertyInfo) {
      throw new Error('Datos de valoración incompletos')
    }
    
    console.log('📊 [Valuations] Generando informe PDF profesional...')
    await generateValuationReport(valuation, valuation.propertyInfo)
    
    console.log('🎉 [Valuations] ¡Informe PDF generado exitosamente!')
    
  } catch (error) {
    console.error('❌ [Valuations] Error generando informe PDF:', error)
    alert(`Error al generar el informe: ${error.message}`)
    
  } finally {
    downloadingPDF.value = null
    console.log('🏁 [Valuations] Proceso de descarga PDF finalizado')
  }
}

// Utility functions
function formatPrice(price) {
  return new Intl.NumberFormat('es-ES').format(price)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function getConfidenceClass(confidence) {
  if (confidence >= 80) return 'confidence-high'
  if (confidence >= 60) return 'confidence-medium'
  return 'confidence-low'
}

function getInvestmentBadgeClass(type) {
  switch (type) {
    case 'oportunidad_excepcional':
      return 'badge-exceptional'
    case 'buena_oportunidad':
      return 'badge-good'
    case 'precio_justo':
      return 'badge-fair'
    case 'precio_alto':
      return 'badge-high'
    case 'sobrevalorado':
      return 'badge-overvalued'
    default:
      return 'badge-analyzing'
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

// Lifecycle
onMounted(() => {
  loadPreviousValuations()
})
</script>

<style scoped>
/* Reset and Base */
*, *::before, *::after {
  box-sizing: border-box;
}

.valuations-page {
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: #1f2937;
  width: 100%;
  background: white;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 100%;
}

.hero-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  width: 100%;
  overflow: hidden;
}

.hero-background::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%);
}

.hero-content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 100%;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* CTA Button */
.cta-button {
  @apply relative px-12 py-6 bg-white text-gray-900 font-bold text-lg rounded-2xl;
  @apply transform transition-all duration-300 hover:scale-105 hover:shadow-2xl;
  @apply focus:outline-none focus:ring-4 focus:ring-white/30;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 20px 40px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1);
}

.cta-button:hover {
  box-shadow: 0 25px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.2);
}

/* Stats */
.stats-item {
  @apply text-center;
}

.stats-number {
  @apply text-4xl lg:text-5xl font-black text-white mb-2;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stats-label {
  @apply text-blue-200 font-medium;
}

/* Scroll Indicator */
.scroll-indicator {
  @apply absolute bottom-8 left-1/2 transform -translate-x-1/2;
  @apply flex flex-col items-center animate-bounce;
}

.scroll-arrow {
  @apply w-6 h-6 border-r-2 border-b-2 border-white/60 transform rotate-45;
}

/* Section Styling */
.section-badge {
  @apply inline-block px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-6;
}

.section-title {
  @apply text-4xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight;
}

.section-subtitle {
  @apply text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed;
}

/* Features Section */
.features-section {
  @apply bg-gradient-to-b from-gray-50 to-white;
  width: 100%;
  overflow: hidden;
}

/* Process Section */
.process-section {
  @apply bg-white;
  width: 100%;
  overflow: hidden;
}

.process-step {
  @apply text-center transform transition-all duration-300 hover:scale-105;
}

.process-number {
  @apply relative mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600;
  @apply rounded-2xl flex items-center justify-center mb-6 shadow-lg;
}

.process-number span {
  @apply text-lg font-bold text-white;
}

.process-icon {
  @apply absolute -bottom-2 -right-2 text-2xl bg-white rounded-full w-10 h-10;
  @apply flex items-center justify-center shadow-lg;
}

.process-title {
  @apply text-xl font-bold text-gray-900 mb-4;
}

.process-description {
  @apply text-gray-600 text-sm leading-relaxed mb-4 max-w-xs mx-auto;
}

.process-time {
  @apply text-xs text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full inline-block;
}

/* Secondary Button */
.secondary-button {
  @apply inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600;
  @apply text-white font-bold rounded-xl transform transition-all duration-300 hover:scale-105;
  @apply shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300;
}

/* Valuations History */
.valuations-history-section {
  @apply bg-gray-50;
  width: 100%;
  overflow: hidden;
}

.valuation-card {
  @apply bg-white rounded-2xl p-6 shadow-lg border border-gray-200;
  @apply transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer;
}

.valuation-card-header {
  @apply flex justify-between items-start mb-4;
}

.valuation-title {
  @apply text-lg font-bold text-gray-900 truncate flex-1 mr-2;
}

.valuation-date {
  @apply text-sm text-gray-500 font-medium whitespace-nowrap;
}

.valuation-card-content {
  @apply space-y-4;
}

.valuation-price {
  @apply text-center;
}

.price-label {
  @apply block text-sm text-gray-600 mb-1;
}

.price-value {
  @apply text-2xl font-bold text-green-600;
}

.valuation-details {
  @apply grid grid-cols-3 gap-4 text-center;
}

.detail-item {
  @apply space-y-1;
}

.detail-label {
  @apply block text-xs text-gray-500 uppercase tracking-wide;
}

.detail-value {
  @apply block text-sm font-medium text-gray-900;
}

.confidence-high {
  @apply text-green-600;
}

.confidence-medium {
  @apply text-yellow-600;
}

.confidence-low {
  @apply text-red-600;
}

.investment-badge {
  @apply text-center px-3 py-2 rounded-full text-sm font-medium;
}

.badge-exceptional {
  @apply bg-green-100 text-green-800;
}

.badge-good {
  @apply bg-blue-100 text-blue-800;
}

.badge-fair {
  @apply bg-yellow-100 text-yellow-800;
}

.badge-high {
  @apply bg-orange-100 text-orange-800;
}

.badge-overvalued {
  @apply bg-red-100 text-red-800;
}

.badge-analyzing {
  @apply bg-gray-100 text-gray-800;
}

.valuation-card-footer {
  @apply mt-4 pt-4 border-t border-gray-100;
}

.footer-actions {
  @apply flex justify-between items-center gap-3;
}

.pdf-download-button {
  @apply px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium text-sm rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center;
}

.pdf-download-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.25);
}

.view-details {
  @apply text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors cursor-pointer flex-shrink-0;
}

/* Demo Section */
.demo-section {
  @apply bg-gradient-to-br from-emerald-50 to-blue-50;
  width: 100%;
  overflow: hidden;
}

.demo-card {
  @apply bg-white rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-100;
}

.demo-header {
  @apply text-center mb-12;
}

.demo-title {
  @apply text-3xl lg:text-4xl font-bold text-gray-900 mb-4;
}

.demo-subtitle {
  @apply text-lg text-gray-600 max-w-2xl mx-auto;
}

.demo-body {
  @apply grid lg:grid-cols-2 gap-12 items-center;
}

.demo-property {
  @apply bg-gray-50 rounded-2xl p-6;
}

.property-title {
  @apply text-xl font-semibold text-gray-900 mb-6;
}

.property-details {
  @apply space-y-4;
}

.property-item {
  @apply flex justify-between;
}

.property-label {
  @apply text-gray-600;
}

.property-value {
  @apply font-medium text-gray-900;
}

.demo-action {
  @apply text-center;
}

.demo-button {
  @apply w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white;
  @apply font-bold rounded-xl transform transition-all duration-300 hover:scale-105;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
  @apply focus:outline-none focus:ring-4 focus:ring-orange-300;
}

.demo-time {
  @apply text-sm text-gray-500 mt-4;
}

/* Modal */
.modal-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center p-4;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
}

.modal-container {
  @apply w-full max-w-6xl max-h-screen overflow-hidden;
}

.modal-content {
  @apply bg-white rounded-2xl shadow-2xl overflow-hidden;
  @apply transform transition-all duration-300;
}

.modal-header {
  @apply flex justify-between items-center p-6 bg-gradient-to-r from-blue-600 to-purple-600;
}

.modal-title {
  @apply text-xl font-bold text-white;
}

.modal-close {
  @apply text-white hover:text-gray-200 transition-colors p-2;
}

.modal-body {
  @apply p-6 max-h-screen overflow-y-auto;
}

/* Responsive Design */
@media (max-width: 768px) {
  .section-title {
    @apply text-3xl;
  }
  
  .hero-content {
    @apply py-16;
  }
  
  .cta-button {
    @apply w-full max-w-sm mx-auto px-8 py-4 text-base;
  }
  
  .stats-number {
    @apply text-3xl;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style> 