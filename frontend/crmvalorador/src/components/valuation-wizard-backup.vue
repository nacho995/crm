<template>
  <div class="valuation-wizard">
    <!-- Modal Overlay -->
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeWizard"></div>
        
        <!-- Modal Panel - Responsive -->
        <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle w-full max-w-xs sm:max-w-sm md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
          
          <!-- Header con progreso - Responsive -->
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 py-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg sm:text-xl md:text-2xl font-bold text-white">💎 Valoración Inmobiliaria</h3>
                <p class="text-blue-100 text-xs sm:text-sm">Algoritmo profesional v3.0</p>
              </div>
              <button @click="closeWizard" class="text-white hover:text-gray-200 transition-colors p-2 -m-2">
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <!-- Barra de progreso - Responsive -->
            <div class="mt-3 sm:mt-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs sm:text-sm text-blue-100">Paso {{ currentStep }} de {{ totalSteps }}</span>
                <span class="text-xs sm:text-sm text-blue-100">{{ Math.round((currentStep / totalSteps) * 100) }}% completado</span>
              </div>
              <div class="w-full bg-blue-800 rounded-full h-1.5 sm:h-2">
                <div 
                  class="bg-white rounded-full h-1.5 sm:h-2 transition-all duration-500 ease-out"
                  :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Contenido del Wizard - Responsive -->
          <div class="px-4 sm:px-6 py-4 sm:py-6">
            
            <!-- Paso 1: Información Básica -->
            <div v-if="currentStep === 1" class="step-content">
              <div class="text-center mb-4 sm:mb-6">
                <div class="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span class="text-2xl sm:text-3xl">🏠</span>
                </div>
                <h4 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">Información Básica</h4>
                <p class="text-sm sm:text-base text-gray-600 px-2">Datos esenciales para una valoración precisa</p>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <!-- Precio -->
                <div class="form-group">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">💰 Precio Actual</label>
                  <div class="relative">
                    <input 
                      v-model.number="propertyData.price"
                      type="number"
                      placeholder="Ej: 850000"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      :class="{ 'border-red-300': errors.price }"
                    >
                    <span class="absolute right-3 top-2.5 sm:top-3 text-gray-500 text-sm sm:text-base">€</span>
                  </div>
                  <p v-if="errors.price" class="text-red-500 text-xs sm:text-sm mt-1">{{ errors.price }}</p>
                  <p v-else class="text-gray-500 text-xs sm:text-sm mt-1">Precio de venta o estimado actual</p>
                </div>

                <!-- Tamaño -->
                <div class="form-group">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">📐 Tamaño</label>
                  <div class="relative">
                    <input 
                      v-model.number="propertyData.size"
                      type="number"
                      placeholder="Ej: 120"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      :class="{ 'border-red-300': errors.size }"
                    >
                    <span class="absolute right-3 top-2.5 sm:top-3 text-gray-500 text-sm sm:text-base">m²</span>
                  </div>
                  <p v-if="errors.size" class="text-red-500 text-xs sm:text-sm mt-1">{{ errors.size }}</p>
                  <p v-else class="text-gray-500 text-xs sm:text-sm mt-1">Superficie útil de la vivienda</p>
                </div>

                <!-- Habitaciones -->
                <div class="form-group">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">🛏️ Habitaciones</label>
                  <div class="grid grid-cols-3 sm:flex sm:space-x-2 gap-2 sm:gap-0">
                    <button 
                      v-for="num in [1,2,3,4,5,6]" 
                      :key="num"
                      @click="propertyData.rooms = num"
                      class="py-2 sm:py-3 px-2 sm:flex-1 border-2 rounded-lg font-medium transition-all text-sm sm:text-base touch-manipulation"
                      :class="propertyData.rooms === num ? 
                        'border-blue-500 bg-blue-50 text-blue-700' : 
                        'border-gray-200 text-gray-600 hover:border-gray-300 active:bg-gray-50'"
                    >
                      {{ num }}{{ num === 6 ? '+' : '' }}
                    </button>
                  </div>
                  <p class="text-gray-500 text-xs sm:text-sm mt-1">Número de dormitorios</p>
                </div>

                <!-- Baños -->
                <div class="form-group">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">🚿 Baños</label>
                  <div class="grid grid-cols-2 sm:flex sm:space-x-2 gap-2 sm:gap-0">
                    <button 
                      v-for="num in [1,2,3,4]" 
                      :key="num"
                      @click="propertyData.bathrooms = num"
                      class="py-2 sm:py-3 px-2 sm:flex-1 border-2 rounded-lg font-medium transition-all text-sm sm:text-base touch-manipulation"
                      :class="propertyData.bathrooms === num ? 
                        'border-blue-500 bg-blue-50 text-blue-700' : 
                        'border-gray-200 text-gray-600 hover:border-gray-300 active:bg-gray-50'"
                    >
                      {{ num }}{{ num === 4 ? '+' : '' }}
                    </button>
                  </div>
                  <p class="text-gray-500 text-xs sm:text-sm mt-1">Número de cuartos de baño</p>
                </div>
              </div>

              <!-- Precio por m² calculado -->
              <div v-if="propertyData.price && propertyData.size" class="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center">
                  <span class="text-green-600 mr-2">📊</span>
                  <span class="font-medium text-green-800 text-sm sm:text-base">
                    Precio por m²: {{ Math.round(propertyData.price / propertyData.size).toLocaleString() }}€/m²
                  </span>
                </div>
              </div>
            </div>

            <!-- Paso 2: Ubicación -->
            <div v-if="currentStep === 2" class="step-content">
              <div class="text-center mb-4 sm:mb-6">
                <div class="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span class="text-2xl sm:text-3xl">📍</span>
                </div>
                <h4 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">Ubicación de la Propiedad</h4>
                <p class="text-sm sm:text-base text-gray-600 px-2">Una ubicación precisa es esencial para una valoración exacta</p>
              </div>

              <div class="space-y-4 sm:space-y-6">
                <!-- Tipo de vía y nombre -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div class="form-group">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">🛣️ Tipo de Vía</label>
                    <select 
                      v-model="propertyData.streetType"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                    >
                      <option value="">Tipo</option>
                      <option value="Calle">Calle</option>
                      <option value="Avenida">Avenida</option>
                      <option value="Plaza">Plaza</option>
                      <option value="Paseo">Paseo</option>
                      <option value="Glorieta">Glorieta</option>
                      <option value="Ronda">Ronda</option>
                      <option value="Carretera">Carretera</option>
                      <option value="Camino">Camino</option>
                    </select>
                  </div>

                  <div class="form-group sm:col-span-2">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">🏠 Nombre de la Vía</label>
                    <input 
                      v-model="propertyData.streetName"
                      type="text"
                      placeholder="Ej: Serrano, Gran Vía, Alcalá..."
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                  </div>
                </div>

                <!-- Número y portal -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div class="form-group">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">🔢 Número</label>
                    <input 
                      v-model="propertyData.streetNumber"
                      type="text"
                      placeholder="45"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                  </div>

                  <div class="form-group">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">🏢 Piso</label>
                    <input 
                      v-model="propertyData.floor"
                      type="text"
                      placeholder="3º"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                  </div>

                  <div class="form-group">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">🚪 Puerta</label>
                    <input 
                      v-model="propertyData.door"
                      type="text"
                      placeholder="A"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                  </div>

                  <div class="form-group">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">📮 C.P.</label>
                    <input 
                      v-model="propertyData.postalCode"
                      type="text"
                      placeholder="28001"
                      maxlength="5"
                      pattern="[0-9]{5}"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                  </div>
                </div>

                <!-- Distrito y barrio -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="form-group">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">🗺️ Distrito *</label>
                    <select 
                      v-model="propertyData.district"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                      :class="{ 'border-red-300': !propertyData.district }"
                    >
                      <option value="">Selecciona un distrito</option>
                      <option v-for="district in madridDistricts" :key="district" :value="district">
                        {{ district }}
                      </option>
                    </select>
                    <p class="text-gray-500 text-xs sm:text-sm mt-1">Distrito de Madrid (obligatorio)</p>
                  </div>

                  <div class="form-group">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">🏘️ Barrio</label>
                    <input 
                      v-model="propertyData.neighborhood"
                      type="text"
                      placeholder="Ej: Recoletos, Justicia, Sol..."
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                    <p class="text-gray-500 text-xs sm:text-sm mt-1">Barrio específico (opcional)</p>
                  </div>
                </div>

                <!-- Dirección completa generada automáticamente -->
                <div v-if="generatedAddress" class="form-group">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">📍 Dirección Completa (generada)</label>
                  <div class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-green-200 bg-green-50 rounded-lg">
                    {{ generatedAddress }}
                  </div>
                  <p class="text-green-600 text-xs sm:text-sm mt-1">✓ Dirección generada automáticamente</p>
                </div>

                <!-- Información adicional -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="form-group">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">🏗️ Año de Construcción</label>
                    <input 
                      v-model.number="propertyData.year"
                      type="number"
                      placeholder="Ej: 2010"
                      min="1900"
                      :max="new Date().getFullYear()"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                    <p class="text-gray-500 text-xs sm:text-sm mt-1">Año de construcción o última reforma</p>
                  </div>

                  <div class="form-group">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">🏢 Tipo de Edificio</label>
                    <select 
                      v-model="propertyData.buildingType"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="Edificio residencial">Edificio residencial</option>
                      <option value="Casa unifamiliar">Casa unifamiliar</option>
                      <option value="Chalet adosado">Chalet adosado</option>
                      <option value="Edificio histórico">Edificio histórico</option>
                      <option value="Obra nueva">Obra nueva</option>
                      <option value="Rehabilitado">Rehabilitado</option>
                    </select>
                  </div>
                </div>

                <!-- Referencias y notas -->
                <div class="form-group">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">📝 Referencias Adicionales (Opcional)</label>
                  <textarea 
                    v-model="propertyData.locationNotes"
                    placeholder="Ej: Cerca del metro Sol, frente al parque del Retiro, esquina con Gran Vía..."
                    rows="3"
                    class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-y"
                  ></textarea>
                  <p class="text-gray-500 text-xs sm:text-sm mt-1">Puntos de referencia, cercanía a metro, comercios, etc.</p>
                </div>

                <!-- Información de ayuda -->
                <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div class="flex items-start">
                    <span class="text-blue-600 mr-2 mt-1 text-lg">💡</span>
                    <div class="text-blue-800 text-sm">
                      <strong>¿Por qué es importante la ubicación precisa?</strong><br>
                      Una dirección completa nos permite comparar con propiedades exactas del mismo edificio o manzana, 
                      incrementando la precisión de la valoración hasta un 15% adicional.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Paso 3: Características -->
            <div v-if="currentStep === 3" class="step-content">
              <div class="text-center mb-4 sm:mb-6">
                <div class="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span class="text-2xl sm:text-3xl">✨</span>
                </div>
                <h4 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">Características Especiales</h4>
                <p class="text-sm sm:text-base text-gray-600 px-2">Estas características pueden aumentar el valor</p>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                <div 
                  v-for="(feature, key) in availableFeatures" 
                  :key="key"
                  @click="toggleFeature(key)"
                  class="feature-card p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md touch-manipulation"
                  :class="propertyData.features[key] ? 
                    'border-blue-500 bg-blue-50' : 
                    'border-gray-200 hover:border-gray-300 active:bg-gray-50'"
                >
                  <div class="text-center">
                    <div class="text-xl sm:text-2xl mb-1 sm:mb-2">{{ feature.icon }}</div>
                    <div class="font-medium text-xs sm:text-sm">{{ feature.name }}</div>
                    <div v-if="propertyData.features[key]" class="text-blue-600 text-xs mt-1">✓ Incluido</div>
                  </div>
                </div>
              </div>

              <div class="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div class="flex items-start">
                  <span class="text-yellow-600 mr-2 mt-1 text-lg sm:text-xl">💡</span>
                  <div class="text-yellow-800 text-xs sm:text-sm">
                    <strong>Tip:</strong> Las características premium como ascensor, garaje o terraza pueden aumentar el valor hasta un 15%. ¡Selecciona todas las que tenga tu propiedad!
                  </div>
                </div>
              </div>
            </div>

            <!-- Paso 4: Testigos -->
            <div v-if="currentStep === 4" class="step-content">
              <div class="text-center mb-4 sm:mb-6">
                <div class="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span class="text-2xl sm:text-3xl">🏘️</span>
                </div>
                <h4 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">Propiedades Testigo</h4>
                <p class="text-sm sm:text-base text-gray-600 px-2">Selecciona propiedades similares para mejorar la precisión de la valoración</p>
              </div>

              <!-- Info sobre testigos -->
              <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="flex items-start">
                  <span class="text-blue-600 mr-2 mt-1 text-lg">💡</span>
                  <div class="text-blue-800 text-sm">
                    <strong>¿Qué son los testigos?</strong><br>
                    Son propiedades similares a la tuya que nos ayudan a hacer una valoración más precisa. 
                    Puedes seleccionar hasta 5 propiedades como referencia.
                  </div>
                </div>
              </div>

              <div class="space-y-4 sm:space-y-6">
                <!-- Controles principales -->
                <div class="flex flex-col sm:flex-row gap-3">
                  <button 
                    @click="loadComparableProperties"
                    :disabled="loadingWitnesses || !propertyData.district"
                    class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                  >
                    <span v-if="loadingWitnesses" class="flex items-center justify-center">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Buscando...
                    </span>
                    <span v-else class="flex items-center justify-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                      Buscar Testigos
                    </span>
                  </button>
                  
                  <button 
                    v-if="witnessesLoaded && availableWitnesses.length > 0"
                    @click="selectAllRecommended"
                    class="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md"
                  >
                    <span class="flex items-center justify-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Top 3 Recomendados
                    </span>
                  </button>
                </div>

                <!-- Seleccionados -->
                <div v-if="selectedWitnesses.length > 0" class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 class="font-semibold text-green-800 mb-2 flex items-center">
                    <span class="w-5 h-5 mr-2">✅</span>
                    Testigos Seleccionados ({{ selectedWitnesses.length }}/5)
                  </h5>
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="witness in selectedWitnesses" 
                      :key="witness.id"
                      class="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {{ witness.title }}
                      <button 
                        @click="toggleWitness(witness)"
                        class="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                  <div class="mt-2 text-sm text-green-700">
                    <strong>Valor medio testigos:</strong> {{ formatPrice(selectedWitnesses.reduce((sum, w) => sum + w.price, 0) / selectedWitnesses.length) }}€
                  </div>
                </div>

                <!-- Lista de testigos disponibles -->
                <div v-if="witnessesLoaded && availableWitnesses.length > 0" class="space-y-4">
                  <div class="flex justify-between items-center">
                    <h5 class="font-semibold text-gray-900">Propiedades Encontradas ({{ availableWitnesses.length }})</h5>
                    <button 
                      @click="clearWitnessSelection"
                      v-if="selectedWitnesses.length > 0"
                      class="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Limpiar selección
                    </button>
                  </div>
                  
                  <div class="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                    <div 
                      v-for="witness in availableWitnesses" 
                      :key="witness.id"
                      @click="toggleWitness(witness)"
                      class="witness-card p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md"
                      :class="witness.selected ? 
                        'border-blue-500 bg-blue-50 shadow-md' : 
                        'border-gray-200 hover:border-gray-300'"
                    >
                      <div class="flex justify-between items-start">
                        <div class="flex-1">
                          <div class="flex items-center justify-between mb-2">
                            <h6 class="font-semibold text-gray-900 text-sm">{{ witness.title }}</h6>
                            <span 
                              class="px-2 py-1 text-xs font-medium rounded-full"
                              :class="getSimilarityBadgeClass(witness.similarity)"
                            >
                              {{ witness.similarity }}% similar
                            </span>
                          </div>
                          
                          <p class="text-gray-600 text-xs mb-3">{{ witness.address }}</p>
                          
                          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div class="flex items-center">
                              <span class="text-gray-500 mr-1">💰</span>
                              <span class="font-medium">{{ formatPrice(witness.price) }}€</span>
                            </div>
                            <div class="flex items-center">
                              <span class="text-gray-500 mr-1">📐</span>
                              <span>{{ witness.size }}m²</span>
                            </div>
                            <div class="flex items-center">
                              <span class="text-gray-500 mr-1">🛏️</span>
                              <span>{{ witness.rooms }} hab.</span>
                            </div>
                            <div class="flex items-center">
                              <span class="text-gray-500 mr-1">📊</span>
                              <span>{{ witness.pricePerM2 }}€/m²</span>
                            </div>
                          </div>
                          
                          <!-- Características destacadas -->
                          <div v-if="getFeaturesList(witness.features).length > 0" class="mt-2">
                            <div class="flex flex-wrap gap-1">
                              <span 
                                v-for="feature in getFeaturesList(witness.features).slice(0, 3)" 
                                :key="feature"
                                class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                              >
                                {{ getFeatureName(feature) }}
                              </span>
                            </div>
                          </div>
                          
                          <div class="mt-2 flex justify-between items-center text-xs text-gray-500">
                            <span>{{ witness.portal }}</span>
                            <span v-if="witness.selected" class="text-blue-600 font-medium">✓ Seleccionado</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Estado sin testigos -->
                <div v-else-if="!loadingWitnesses && !witnessesLoaded" class="text-center py-8">
                  <div class="text-gray-400 mb-4">
                    <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                  </div>
                  <p class="text-gray-600">Haz clic en "Buscar Testigos" para encontrar propiedades similares</p>
                </div>

                <!-- Loading state -->
                <div v-else-if="loadingWitnesses" class="text-center py-8">
                  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p class="text-gray-600">Buscando propiedades similares en {{ propertyData.district }}...</p>
                </div>
              </div>

              <!-- Información adicional -->
              <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                <h6 class="font-medium text-gray-900 mb-2">💡 Consejos para elegir testigos:</h6>
                <ul class="text-sm text-gray-600 space-y-1">
                  <li>• Selecciona propiedades en el mismo distrito o zona</li>
                  <li>• Prioriza propiedades con tamaño y habitaciones similares</li>
                  <li>• Considera el año de construcción y estado de conservación</li>
                  <li>• Los testigos más similares (mayor %) darán mejor precisión</li>
                </ul>
              </div>
            </div>

            <!-- Paso 5: Confirmación y Valoración -->
            <div v-if="currentStep === 5" class="step-content">
              <div class="text-center mb-4 sm:mb-6">
                <div class="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span class="text-2xl sm:text-3xl">🔍</span>
                </div>
                <h4 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">Resumen y Valoración</h4>
                <p class="text-sm sm:text-base text-gray-600 px-2">Revisa los datos antes de la valoración</p>
              </div>

              <!-- Resumen de datos -->
              <div class="bg-gray-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                <h5 class="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">📋 Resumen de tu Propiedad</h5>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                  <div class="flex justify-between">
                    <span class="text-gray-600 text-sm">💰 Precio actual:</span>
                    <span class="font-medium text-sm">{{ formatPrice(propertyData.price) }}€</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 text-sm">📐 Tamaño:</span>
                    <span class="font-medium text-sm">{{ propertyData.size }}m²</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 text-sm">🛏️ Habitaciones:</span>
                    <span class="font-medium text-sm">{{ propertyData.rooms }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 text-sm">🚿 Baños:</span>
                    <span class="font-medium text-sm">{{ propertyData.bathrooms }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 text-sm">📍 Distrito:</span>
                    <span class="font-medium text-sm">{{ propertyData.district || 'No especificado' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 text-sm">🏗️ Año:</span>
                    <span class="font-medium text-sm">{{ propertyData.year || 'No especificado' }}</span>
                  </div>
                </div>

                <!-- NUEVA: Dirección completa -->
                <div v-if="generatedAddress" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h6 class="font-medium text-blue-900 mb-2">📍 Dirección Completa</h6>
                  <p class="text-blue-800 text-sm">{{ generatedAddress }}</p>
                </div>

                <!-- Tipo de edificio y notas -->
                <div v-if="propertyData.buildingType || propertyData.locationNotes" class="mt-4 space-y-2">
                  <div v-if="propertyData.buildingType" class="flex justify-between">
                    <span class="text-gray-600 text-sm">🏢 Tipo de edificio:</span>
                    <span class="font-medium text-sm">{{ propertyData.buildingType }}</span>
                  </div>
                  <div v-if="propertyData.locationNotes" class="mt-2">
                    <span class="text-gray-600 text-sm">📝 Referencias:</span>
                    <p class="text-gray-800 text-sm mt-1">{{ propertyData.locationNotes }}</p>
                  </div>
                </div>

                <!-- Características seleccionadas -->
                <div v-if="selectedFeatures.length > 0" class="mt-4">
                  <span class="text-gray-600 text-sm">✨ Características especiales:</span>
                  <div class="flex flex-wrap gap-1 sm:gap-2 mt-2">
                    <span 
                      v-for="feature in selectedFeatures" 
                      :key="feature"
                      class="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm"
                    >
                      {{ availableFeatures[feature]?.name }}
                    </span>
                  </div>
                </div>

                <!-- Testigos seleccionados -->
                <div v-if="selectedWitnesses.length > 0" class="mt-4">
                  <span class="text-gray-600 text-sm">🏘️ Testigos seleccionados:</span>
                  <div class="flex flex-wrap gap-1 sm:gap-2 mt-2">
                    <span 
                      v-for="witness in selectedWitnesses" 
                      :key="witness.id"
                      class="px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm"
                    >
                      {{ witness.title }} ({{ witness.similarity }}%)
                    </span>
                  </div>
                </div>
              </div>

              <!-- Botón de valoración -->
              <div class="text-center">
                <button 
                  @click="startValuation"
                  :disabled="isValuating"
                  class="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-sm sm:text-base rounded-xl hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg touch-manipulation"
                >
                  <span v-if="isValuating" class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analizando mercado...
                  </span>
                  <span v-else>
                    💎 Valorar Propiedad Ahora
                  </span>
                </button>
              </div>

              <div class="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-500">
                <p>⏱️ La valoración toma aproximadamente 15-30 segundos</p>
                <p>🔒 Tus datos están protegidos y no se almacenan</p>
              </div>
            </div>

            <!-- Paso 6: Deslizador de Precios -->
            <div v-if="currentStep === 6" class="step-content">
              <div class="text-center mb-4 sm:mb-6">
                <div class="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span class="text-2xl sm:text-3xl">💰</span>
                </div>
                <h4 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">Ajusta tu Objetivo de Precio</h4>
                <p class="text-sm sm:text-base text-gray-600 px-2">Desliza para explorar diferentes rangos del mercado</p>
              </div>

              <div class="space-y-6">
                <!-- Información del mercado -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <div class="text-red-600 font-bold text-lg">{{ formatPrice(priceRange.min) }}€</div>
                    <div class="text-red-700 text-sm font-medium">Precio Mínimo</div>
                    <div class="text-red-600 text-xs">Mercado bajo</div>
                  </div>
                  
                  <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div class="text-green-600 font-bold text-lg">{{ formatPrice(priceRange.recommended) }}€</div>
                    <div class="text-green-700 text-sm font-medium">Precio Recomendado</div>
                    <div class="text-green-600 text-xs">Valoración IA</div>
                  </div>
                  
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div class="text-blue-600 font-bold text-lg">{{ formatPrice(priceRange.max) }}€</div>
                    <div class="text-blue-700 text-sm font-medium">Precio Máximo</div>
                    <div class="text-blue-600 text-xs">Mercado premium</div>
                  </div>
                </div>

                <!-- Precio seleccionado actual -->
                <div class="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 text-center mb-6">
                  <div class="text-yellow-900 font-bold text-2xl sm:text-3xl">
                    {{ formatPrice(selectedPrice) }}€
                  </div>
                  <div class="text-yellow-800 font-medium mt-1">
                    {{ getPriceRangeLabel(selectedPrice) }}
                  </div>
                  <div class="text-yellow-700 text-sm mt-1">
                    {{ formatPrice(Math.round(selectedPrice / propertyData.size)) }}€/m²
                  </div>
                </div>

                <!-- Deslizador de precio -->
                <div class="px-4">
                  <div class="mb-4">
                    <label class="block text-sm font-semibold text-gray-700 mb-4">Desliza para explorar rangos de precio:</label>
                    
                    <!-- Slider personalizado -->
                    <div class="relative">
                      <!-- Track del slider -->
                      <div class="w-full h-3 bg-gray-200 rounded-full relative overflow-hidden">
                        <!-- Gradiente de colores -->
                        <div class="absolute inset-0 bg-gradient-to-r from-red-400 via-green-400 to-blue-400 rounded-full"></div>
                        
                        <!-- Zona fuera del mercado (izquierda) -->
                        <div 
                          v-if="outOfMarketMin > 0"
                          class="absolute left-0 top-0 h-full bg-red-800 opacity-50"
                          :style="{ width: `${outOfMarketMin}%` }"
                        ></div>
                        
                        <!-- Zona fuera del mercado (derecha) -->
                        <div 
                          v-if="outOfMarketMax > 0"
                          class="absolute right-0 top-0 h-full bg-red-800 opacity-50"
                          :style="{ width: `${outOfMarketMax}%` }"
                        ></div>
                      </div>
                      
                      <!-- Input range -->
                      <input
                        v-model="selectedPrice"
                        type="range"
                        :min="sliderMin"
                        :max="sliderMax"
                        :step="1000"
                        class="absolute inset-0 w-full h-3 opacity-0 cursor-pointer"
                        @input="updateSelectedPrice"
                      >
                      
                      <!-- Marcadores de precio -->
                      <div class="flex justify-between text-xs text-gray-600 mt-2">
                        <span class="text-red-600">{{ formatPrice(sliderMin) }}€</span>
                        <span class="text-green-600">{{ formatPrice(priceRange.recommended) }}€</span>
                        <span class="text-blue-600">{{ formatPrice(sliderMax) }}€</span>
                      </div>
                    </div>
                  </div>

                  <!-- Indicador de estado -->
                  <div class="mt-6 p-4 rounded-lg border-2" :class="getPriceStatusClasses(selectedPrice)">
                    <div class="flex items-center">
                      <span class="text-xl mr-3">{{ getPriceStatusIcon(selectedPrice) }}</span>
                      <div>
                        <div class="font-bold">{{ getPriceStatusTitle(selectedPrice) }}</div>
                        <div class="text-sm opacity-80">{{ getPriceStatusDescription(selectedPrice) }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Comparativa con precio actual -->
                  <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div class="text-sm text-gray-700">
                      <div class="flex justify-between items-center">
                        <span>Tu precio actual:</span>
                        <span class="font-bold">{{ formatPrice(propertyData.price) }}€</span>
                      </div>
                      <div class="flex justify-between items-center mt-1">
                        <span>Precio seleccionado:</span>
                        <span class="font-bold">{{ formatPrice(selectedPrice) }}€</span>
                      </div>
                      <hr class="my-2">
                      <div class="flex justify-between items-center">
                        <span>Diferencia:</span>
                        <span class="font-bold" :class="selectedPrice > propertyData.price ? 'text-green-600' : 'text-red-600'">
                          {{ selectedPrice > propertyData.price ? '+' : '' }}{{ formatPrice(selectedPrice - propertyData.price) }}€
                          ({{ Math.round(((selectedPrice - propertyData.price) / propertyData.price) * 100) }}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Paso 7: Resumen y Resultados (antes era paso 6) -->
            <div v-if="currentStep === 7" class="step-content">
              <div class="text-center mb-4 sm:mb-6">
                <div class="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span class="text-2xl sm:text-3xl">🎯</span>
                </div>
                <h4 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">Valoración Completada</h4>
                <p class="text-sm sm:text-base text-gray-600 px-2">Resultados finales de tu valoración profesional</p>
              </div>

              <!-- DEBUG: Información de estado -->
              <div v-if="!validatedPropertyData" class="p-6 bg-red-50 border border-red-200 rounded-lg">
                <h3 class="text-red-800 font-medium">❌ Error: Datos de propiedad no válidos</h3>
                <p class="text-red-700 mt-2">No se pudieron validar los datos de la propiedad.</p>
                <details class="mt-3">
                  <summary class="cursor-pointer text-red-600">Ver datos de debug</summary>
                  <pre class="mt-2 text-xs bg-red-100 p-2 rounded">{{ JSON.stringify(propertyData, null, 2) }}</pre>
                </details>
              </div>

              <!-- Componente de valoración -->
              <PropertyValuation 
                v-if="validatedPropertyData"
                :property="validatedPropertyData"
                :auto-load="false"
                @valuation-completed="onValuationCompleted"
                @valuation-error="onValuationError"
                ref="valuationComponent"
              />

              <!-- DEBUG: Estado de carga -->
              <div v-if="validatedPropertyData && !valuationComponent" class="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 class="text-yellow-800 font-medium">⏳ Preparando valoración...</h3>
                <p class="text-yellow-700 mt-2">El componente de valoración se está inicializando.</p>
              </div>

              <!-- NUEVO: Botones de acción adicionales -->
              <div v-if="valuationComponent?.valuation" class="mt-6 flex flex-col sm:flex-row gap-3">
                <button 
                  @click="downloadPDFReport"
                  :disabled="exportingPDF"
                  class="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  <span v-if="exportingPDF" class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generando informe...
                  </span>
                  <span v-else class="flex items-center justify-center">
                    📄 Descargar Informe Profesional PDF
                  </span>
                </button>
                
                <button 
                  @click="shareValuation"
                  class="px-6 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all"
                >
                  🔗 Compartir Valoración
                </button>
              </div>

              <!-- Información sobre el informe -->
              <div v-if="valuationComponent?.valuation" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="flex items-start">
                  <span class="text-blue-600 mr-2 mt-1 text-lg">📋</span>
                  <div class="text-blue-800 text-sm">
                    <strong>Informe PDF Profesional</strong><br>
                    El informe incluye análisis detallado, gráficos comparativos, metodología aplicada, 
                    factores de riesgo y certificación profesional. Perfecto para presentar a clientes.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer con botones - Responsive -->
          <div class="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <button 
              v-if="currentStep > 1 && currentStep < 7"
              @click="previousStep"
              class="order-2 sm:order-1 w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base touch-manipulation"
            >
              ← Anterior
            </button>
            <div v-else class="order-2 sm:order-1 hidden sm:block"></div>

            <div class="order-1 sm:order-2 flex space-x-3 w-full sm:w-auto">
              <button 
                v-if="currentStep < 6"
                @click="nextStep"
                :disabled="!canProceed"
                class="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base touch-manipulation"
              >
                Siguiente →
              </button>
              
              <button 
                v-if="currentStep === 7"
                @click="closeWizard"
                class="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base touch-manipulation"
              >
                ✅ Finalizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import PropertyValuation from './property-valuation.vue'
import { generateValuationReport } from '../services/pdfReportService'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'valuation-completed'])

// Reactive data
const currentStep = ref(1)
const totalSteps = 7
const isValuating = ref(false)
const valuationComponent = ref(null)

// 🏠 NUEVO: Estado para testigos
const selectedWitnesses = ref([])
const availableWitnesses = ref([])
const loadingWitnesses = ref(false)
const witnessesLoaded = ref(false)

// 📄 NUEVO: Estado para PDF
const exportingPDF = ref(false)

// Property data
const propertyData = ref({
  price: null,
  size: null,
  rooms: null,
  bathrooms: null,
  streetType: '',
  streetName: '',
  streetNumber: '',
  floor: '',
  door: '',
  postalCode: '',
  district: '',
  neighborhood: '',
  municipality: 'Madrid',
  buildingType: '',
  locationNotes: '',
  year: null,
  features: {},
  propertyType: 'flat'
})

// Validation errors
const errors = ref({})

// Available features
const availableFeatures = {
  elevator: { name: 'Ascensor', icon: '🛗' },
  airConditioning: { name: 'Aire Acondicionado', icon: '❄️' },
  heating: { name: 'Calefacción', icon: '🔥' },
  terrace: { name: 'Terraza', icon: '🌿' },
  garage: { name: 'Garaje', icon: '🚗' },
  pool: { name: 'Piscina', icon: '🏊' },
  garden: { name: 'Jardín', icon: '🌺' },
  storage: { name: 'Trastero', icon: '📦' },
  furnished: { name: 'Amueblado', icon: '🛋️' },
  reformed: { name: 'Reformado', icon: '🔨' }
}

// Madrid districts
const madridDistricts = [
  'Centro', 'Arganzuela', 'Retiro', 'Salamanca', 'Chamartín', 'Tetuán',
  'Chamberí', 'Fuencarral-El Pardo', 'Moncloa-Aravaca', 'Latina',
  'Carabanchel', 'Usera', 'Puente de Vallecas', 'Moratalaz', 'Ciudad Lineal',
  'Hortaleza', 'Villaverde', 'Villa de Vallecas', 'Vicálvaro', 'San Blas-Canillejas', 'Barajas'
]

// Computed properties
const selectedFeatures = computed(() => {
  return Object.keys(propertyData.value.features).filter(key => propertyData.value.features[key])
})

const canProceed = computed(() => {
  const result = (() => {
    switch (currentStep.value) {
      case 1:
        return propertyData.value.price > 0 && 
               propertyData.value.size > 0 && 
               propertyData.value.rooms > 0 && 
               propertyData.value.bathrooms > 0
      case 2:
        return propertyData.value.district.length > 0 && 
               (propertyData.value.streetName.length > 0 || generatedAddress.value)
      case 3:
        return true // Las características son opcionales
      case 4:
        return true // Los testigos son opcionales (pero recomendados)
      case 5:
        return true
      case 6:
        return true // Paso de resultados
      case 7:
        return true
      default:
        return false
    }
  })()
  
  console.log(`🔍 [Wizard] canProceed - Paso ${currentStep.value}: ${result}`)
  if (currentStep.value === 1) {
    console.log('📊 [Wizard] Validación paso 1:', {
      price: propertyData.value.price,
      size: propertyData.value.size,
      rooms: propertyData.value.rooms,
      bathrooms: propertyData.value.bathrooms
    })
  }
  
  return result
})

// NUEVA función computed para generar dirección completa
const generatedAddress = computed(() => {
  const parts = []
  
  if (propertyData.value.streetType) {
    parts.push(propertyData.value.streetType)
  }
  
  if (propertyData.value.streetName) {
    parts.push(propertyData.value.streetName)
  }
  
  if (propertyData.value.streetNumber) {
    parts.push(propertyData.value.streetNumber)
  }
  
  if (propertyData.value.floor || propertyData.value.door) {
    const apartment = []
    if (propertyData.value.floor) apartment.push(propertyData.value.floor)
    if (propertyData.value.door) apartment.push(propertyData.value.door)
    if (apartment.length > 0) {
      parts.push(`(${apartment.join(' ')})`)
    }
  }
  
  if (propertyData.value.neighborhood) {
    parts.push(propertyData.value.neighborhood)
  }
  
  if (propertyData.value.district) {
    parts.push(propertyData.value.district)
  }
  
  if (propertyData.value.postalCode) {
    parts.push(propertyData.value.postalCode)
  }
  
  return parts.length > 0 ? parts.join(', ') : null
})

const validatedPropertyData = computed(() => {
  console.log('🔍 [Wizard] Evaluando validatedPropertyData...')
  console.log('📊 [Wizard] canProceed.value:', canProceed.value)
  console.log('📋 [Wizard] propertyData actual:', propertyData.value)
  console.log('🏘️ [Wizard] selectedWitnesses:', selectedWitnesses.value.length)
  
  if (!canProceed.value) {
    console.warn('⚠️ [Wizard] validatedPropertyData es null porque canProceed es false')
    return null
  }
  
  const result = {
    ...propertyData.value,
    id: `wizard_${Date.now()}`,
    propertyCode: `WIZ_${Date.now()}`,
    title: `Propiedad en ${propertyData.value.district || 'Madrid'}`,
    scrapedAt: new Date().toISOString(),
    portal: 'Wizard',
    source: 'Manual Input',
    address: generatedAddress.value || 'Madrid', // Usar dirección generada
    selectedWitnesses: selectedWitnesses.value
  }
  
  console.log('✅ [Wizard] validatedPropertyData generado:', result)
  
  return result
})

// Methods
function nextStep() {
  if (validateCurrentStep()) {
    currentStep.value++
  }
}

function previousStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function validateCurrentStep() {
  errors.value = {}
  
  if (currentStep.value === 1) {
    if (!propertyData.value.price || propertyData.value.price <= 0) {
      errors.value.price = 'El precio es obligatorio y debe ser mayor que 0'
    }
    if (!propertyData.value.size || propertyData.value.size <= 0) {
      errors.value.size = 'El tamaño es obligatorio y debe ser mayor que 0'
    }
  }
  
  if (currentStep.value === 2) {
    if (!propertyData.value.district) {
      errors.value.district = 'El distrito es obligatorio'
    }
  }
  
  return Object.keys(errors.value).length === 0
}

function toggleFeature(featureKey) {
  if (propertyData.value.features[featureKey]) {
    delete propertyData.value.features[featureKey]
  } else {
    propertyData.value.features[featureKey] = true
  }
}

async function loadComparableProperties() {
  if (!propertyData.value.district || !propertyData.value.size) {
    return
  }

  loadingWitnesses.value = true
  try {
    console.log('🔍 Buscando propiedades comparables...')
    
    // Importar el servicio de Apify dinámicamente
    const { searchSimilarProperties } = await import('../services/apifyService')
    
    const searchParams = {
      district: propertyData.value.district,
      minSize: Math.floor(propertyData.value.size * 0.7),
      maxSize: Math.ceil(propertyData.value.size * 1.3),
      minPrice: Math.floor(propertyData.value.price * 0.6),
      maxPrice: Math.ceil(propertyData.value.price * 1.4),
      rooms: propertyData.value.rooms,
      maxResults: 15
    }
    
    const properties = await searchSimilarProperties(searchParams)
    
    // Procesar y enriquecer propiedades
    availableWitnesses.value = properties.map(prop => ({
      ...prop,
      similarity: calculateSimilarity(propertyData.value, prop),
      pricePerM2: Math.round(prop.price / prop.size),
      selected: false
    })).sort((a, b) => b.similarity - a.similarity)
    
    witnessesLoaded.value = true
    console.log(`✅ ${availableWitnesses.value.length} propiedades comparables encontradas`)
    
  } catch (error) {
    console.error('❌ Error cargando testigos:', error)
    createMockWitnesses()
  } finally {
    loadingWitnesses.value = false
  }
}

function calculateSimilarity(target, comparable) {
  let score = 100
  
  const sizeDiff = Math.abs(target.size - comparable.size) / target.size
  score -= Math.min(30, sizeDiff * 100)
  
  const priceDiff = Math.abs(target.price - comparable.price) / target.price
  score -= Math.min(25, priceDiff * 50)
  
  const roomsDiff = Math.abs((target.rooms || 0) - (comparable.rooms || 0))
  score -= Math.min(20, roomsDiff * 10)
  
  if (target.district === comparable.district) score += 10
  
  if (target.features && comparable.features) {
    const commonFeatures = Object.keys(target.features).filter(key => 
      target.features[key] && comparable.features[key]
    ).length
    score += Math.min(15, commonFeatures * 5)
  }
  
  return Math.max(0, Math.min(100, Math.round(score)))
}

function createMockWitnesses() {
  const basePrice = propertyData.value.price
  const baseSize = propertyData.value.size
  const district = propertyData.value.district
  
  availableWitnesses.value = [
    {
      id: 'mock_1',
      title: `Piso similar en ${district}`,
      address: `Calle Ejemplo, ${district}`,
      price: Math.round(basePrice * 0.95),
      size: Math.round(baseSize * 0.98),
      rooms: propertyData.value.rooms,
      bathrooms: propertyData.value.bathrooms,
      district: district,
      portal: 'Ejemplo',
      similarity: 95,
      pricePerM2: Math.round((basePrice * 0.95) / (baseSize * 0.98)),
      selected: false
    },
    {
      id: 'mock_2',
      title: `Vivienda comparable en ${district}`,
      address: `Avenida Muestra, ${district}`,
      price: Math.round(basePrice * 1.08),
      size: Math.round(baseSize * 1.05),
      rooms: propertyData.value.rooms + 1,
      bathrooms: propertyData.value.bathrooms,
      district: district,
      portal: 'Ejemplo',
      similarity: 88,
      pricePerM2: Math.round((basePrice * 1.08) / (baseSize * 1.05)),
      selected: false
    },
    {
      id: 'mock_3',
      title: `Apartamento en ${district}`,
      address: `Plaza Referencia, ${district}`,
      price: Math.round(basePrice * 0.92),
      size: Math.round(baseSize * 0.94),
      rooms: propertyData.value.rooms,
      bathrooms: propertyData.value.bathrooms - 1,
      district: district,
      portal: 'Ejemplo',
      similarity: 82,
      pricePerM2: Math.round((basePrice * 0.92) / (baseSize * 0.94)),
      selected: false
    }
  ]
  witnessesLoaded.value = true
}

function toggleWitness(witness) {
  const index = availableWitnesses.value.findIndex(w => w.id === witness.id)
  if (index !== -1) {
    availableWitnesses.value[index].selected = !availableWitnesses.value[index].selected
    
    selectedWitnesses.value = availableWitnesses.value.filter(w => w.selected)
    
    if (selectedWitnesses.value.length > 5) {
      const oldest = selectedWitnesses.value[0]
      const oldestIndex = availableWitnesses.value.findIndex(w => w.id === oldest.id)
      if (oldestIndex !== -1) {
        availableWitnesses.value[oldestIndex].selected = false
      }
      selectedWitnesses.value = availableWitnesses.value.filter(w => w.selected)
    }
  }
}

function selectAllRecommended() {
  availableWitnesses.value.forEach((witness, index) => {
    witness.selected = index < 3
  })
  selectedWitnesses.value = availableWitnesses.value.filter(w => w.selected)
}

function clearWitnessSelection() {
  availableWitnesses.value.forEach(witness => {
    witness.selected = false
  })
  selectedWitnesses.value = []
}

async function startValuation() {
  console.log('🚀 [Wizard] Iniciando proceso de valoración...')
  console.log('📋 [Wizard] Datos de propiedad:', propertyData.value)
  console.log('🏘️ [Wizard] Testigos seleccionados:', selectedWitnesses.value.length)
  
  if (!validatedPropertyData.value) {
    console.error('❌ [Wizard] Error: validatedPropertyData es null')
    return
  }
  
  try {
    isValuating.value = true
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    currentStep.value = 7
    await nextTick()
    
    if (valuationComponent.value) {
      await valuationComponent.value.performValuation()
    } else {
      setTimeout(async () => {
        if (valuationComponent.value) {
          await valuationComponent.value.performValuation()
        }
      }, 1000)
    }
    
  } catch (error) {
    console.error('❌ [Wizard] Error en startValuation:', error)
  } finally {
    isValuating.value = false
  }
}

function onValuationCompleted(result) {
  console.log('✅ Valoración completada:', result)
  emit('valuation-completed', result)
}

function onValuationError(error) {
  console.error('❌ Error en valoración:', error)
}

function closeWizard() {
  currentStep.value = 1
  propertyData.value = {
    price: null,
    size: null,
    rooms: null,
    bathrooms: null,
    streetType: '',
    streetName: '',
    streetNumber: '',
    floor: '',
    door: '',
    postalCode: '',
    district: '',
    neighborhood: '',
    municipality: 'Madrid',
    buildingType: '',
    locationNotes: '',
    year: null,
    features: {},
    propertyType: 'flat'
  }
  errors.value = {}
  isValuating.value = false
  
  selectedWitnesses.value = []
  availableWitnesses.value = []
  loadingWitnesses.value = false
  witnessesLoaded.value = false
  
  emit('close')
}

function formatPrice(price) {
  return new Intl.NumberFormat('es-ES').format(price)
}

function getSimilarityBadgeClass(similarity) {
  if (similarity >= 90) return 'bg-green-100 text-green-800 border-green-200'
  if (similarity >= 80) return 'bg-blue-100 text-blue-800 border-blue-200'
  if (similarity >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  return 'bg-gray-100 text-gray-800 border-gray-200'
}

function getFeaturesList(features) {
  if (!features) return []
  return Object.keys(features).filter(key => features[key] === true)
}

function getFeatureName(featureKey) {
  const featureNames = {
    elevator: 'Ascensor',
    airConditioning: 'A/A',
    heating: 'Calefacción',
    terrace: 'Terraza',
    garage: 'Garaje',
    pool: 'Piscina',
    garden: 'Jardín',
    storage: 'Trastero',
    furnished: 'Amueblado',
    reformed: 'Reformado'
  }
  return featureNames[featureKey] || featureKey
}

async function downloadPDFReport() {
  console.log('📄 [Wizard] Iniciando descarga de informe PDF...')
  
  if (!valuationComponent.value?.valuation || !validatedPropertyData.value) {
    console.error('❌ [Wizard] No hay datos de valoración disponibles')
    alert('Error: No hay datos de valoración disponibles para generar el informe')
    return
  }
  
  exportingPDF.value = true
  
  try {
    console.log('📊 [Wizard] Generando informe PDF profesional...')
    await generateValuationReport(valuationComponent.value.valuation, validatedPropertyData.value)
    
    console.log('🎉 [Wizard] ¡Informe PDF generado exitosamente!')
    
    // Opcional: mostrar notificación de éxito
    // Aquí podrías añadir una notificación toast o similar
    
  } catch (error) {
    console.error('❌ [Wizard] Error generando informe PDF:', error)
    alert(`Error al generar el informe: ${error.message}`)
    
  } finally {
    exportingPDF.value = false
    console.log('🏁 [Wizard] Proceso de descarga PDF finalizado')
  }
}

function shareValuation() {
  console.log('🔗 [Wizard] Iniciando compartir valoración...')
  
  if (!valuationComponent.value?.valuation || !validatedPropertyData.value) {
    alert('Error: No hay datos de valoración disponibles para compartir')
    return
  }
  
  const valuation = valuationComponent.value.valuation
  const property = validatedPropertyData.value
  
  // Crear texto para compartir
  const shareText = `🏠 Valoración Inmobiliaria Profesional
  
📍 Ubicación: ${property.district}, Madrid
📐 Superficie: ${property.size}m²
🛏️ Habitaciones: ${property.rooms}
💰 Valor Estimado: ${formatPrice(valuation.estimatedValue)}€
📊 Confianza: ${valuation.confidence}%
€/m²: ${Math.round(valuation.estimatedValue / property.size).toLocaleString()}€

🎯 Análisis: ${valuation.investmentAnalysis.investmentType.replace('_', ' ').toUpperCase()}

Generado por CRM GoZaMadrid - Valoraciones Profesionales
📅 ${new Date().toLocaleDateString('es-ES')}`

  // Intentar usar Web Share API si está disponible
  if (navigator.share) {
    navigator.share({
      title: 'Valoración Inmobiliaria Profesional',
      text: shareText,
      url: window.location.href
    }).then(() => {
      console.log('✅ [Wizard] Valoración compartida exitosamente')
    }).catch((error) => {
      console.log('❌ [Wizard] Error compartiendo:', error)
      fallbackShare(shareText)
    })
  } else {
    // Fallback: copiar al portapapeles
    fallbackShare(shareText)
  }
}

function fallbackShare(text) {
  // Copiar al portapapeles
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('📋 Información de valoración copiada al portapapeles')
      console.log('✅ [Wizard] Texto copiado al portapapeles')
    }).catch((error) => {
      console.error('❌ [Wizard] Error copiando al portapapeles:', error)
      showShareModal(text)
    })
  } else {
    showShareModal(text)
  }
}

function showShareModal(text) {
  // Crear un modal simple para mostrar el texto
  const modal = document.createElement('div')
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.8); z-index: 9999; display: flex; 
    align-items: center; justify-content: center; padding: 20px;
  `
  
  const content = document.createElement('div')
  content.style.cssText = `
    background: white; padding: 30px; border-radius: 15px; 
    max-width: 500px; width: 100%; max-height: 80vh; overflow-y: auto;
  `
  
  content.innerHTML = `
    <h3 style="margin: 0 0 20px 0; color: #1f2937; font-size: 18px; font-weight: bold;">
      📋 Información de Valoración
    </h3>
    <textarea readonly style="width: 100%; height: 300px; padding: 15px; border: 2px solid #e5e7eb; border-radius: 8px; font-family: monospace; font-size: 12px; resize: none;">${text}</textarea>
    <div style="margin-top: 20px; text-align: center;">
      <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold;">
        Cerrar
      </button>
    </div>
  `
  
  modal.appendChild(content)
  document.body.appendChild(modal)
  
  // Cerrar al hacer click fuera
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove()
    }
  })
}

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    currentStep.value = 1
  }
})
</script>

<style scoped>
.valuation-wizard {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.step-content {
  min-height: 300px;
}

@media (min-width: 640px) {
  .step-content {
    min-height: 400px;
  }
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.feature-card {
  transition: all 0.2s ease;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 640px) {
  .feature-card {
    min-height: 100px;
  }
}

.feature-card:hover {
  transform: translateY(-1px);
}

@media (min-width: 640px) {
  .feature-card:hover {
    transform: translateY(-2px);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.touch-manipulation {
  touch-action: manipulation;
}

.valuation-wizard ::-webkit-scrollbar {
  width: 4px;
}

@media (min-width: 640px) {
  .valuation-wizard ::-webkit-scrollbar {
    width: 6px;
  }
}

.valuation-wizard ::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.valuation-wizard ::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.valuation-wizard ::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

@media (max-width: 639px) {
  .valuation-wizard .fixed.inset-0 {
    padding: 0;
  }
  
  .valuation-wizard .inline-block {
    margin: 0;
    width: 100%;
    height: 100vh;
    max-width: none;
    border-radius: 0;
    display: flex;
    flex-direction: column;
  }
  
  .step-content {
    flex: 1;
    overflow-y: auto;
  }
}
</style>