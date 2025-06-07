<template>
  <div>
    <div class="sm:flex sm:items-center mb-8">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-bold text-gray-900">Configuración</h1>
        <p class="mt-2 text-sm text-gray-700">Gestiona la configuración del sistema y preferencias personales</p>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Perfil del Tasador -->
      <div class="card">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Perfil del Tasador</h3>
          
          <form @submit.prevent="saveProfile" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input 
                  v-model="profile.name" 
                  type="text" 
                  class="input-field" 
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  v-model="profile.email" 
                  type="email" 
                  class="input-field" 
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Número de Colegiado</label>
                <input 
                  v-model="profile.collegialNumber" 
                  type="text" 
                  class="input-field" 
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Colegio Profesional</label>
                <select v-model="profile.professionalCollege" class="input-field" required>
                  <option value="">Seleccionar colegio</option>
                  <option value="Colegio de Arquitectos de Madrid">Colegio de Arquitectos de Madrid</option>
                  <option value="Colegio de Arquitectos Técnicos de Madrid">Colegio de Arquitectos Técnicos de Madrid</option>
                  <option value="Colegio de Ingenieros de Caminos">Colegio de Ingenieros de Caminos</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input 
                  v-model="profile.phone" 
                  type="tel" 
                  class="input-field"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Póliza de Seguro RC</label>
                <input 
                  v-model="profile.insurancePolicy" 
                  type="text" 
                  class="input-field"
                  placeholder="Número de póliza"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dirección Profesional</label>
              <textarea 
                v-model="profile.address" 
                rows="3" 
                class="input-field"
                placeholder="Dirección completa del despacho profesional"
              ></textarea>
            </div>
            
            <div class="flex justify-end">
              <button type="submit" class="btn-primary" :disabled="savingProfile">
                {{ savingProfile ? 'Guardando...' : 'Guardar Perfil' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Configuración de APIs -->
      <div class="card">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Configuración de APIs</h3>
          
          <form @submit.prevent="saveApiConfig" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Google Maps API Key</label>
                <input 
                  v-model="apiConfig.googleMapsKey" 
                  type="password" 
                  class="input-field"
                  placeholder="Clave de API de Google Maps"
                />
                <p class="mt-1 text-xs text-gray-500">
                  Necesaria para mostrar mapas y geocodificación
                </p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Idealista API Key</label>
                <input 
                  v-model="apiConfig.idealistaKey" 
                  type="password" 
                  class="input-field"
                  placeholder="Clave de API de Idealista"
                />
                <p class="mt-1 text-xs text-gray-500">
                  Para obtener datos del mercado inmobiliario
                </p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Idealista Secret</label>
                <input 
                  v-model="apiConfig.idealistaSecret" 
                  type="password" 
                  class="input-field"
                  placeholder="Secret de Idealista"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Catastro API</label>
                <div class="flex items-center">
                  <input 
                    v-model="apiConfig.catastroEnabled" 
                    type="checkbox" 
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">
                    Habilitar consultas automáticas al Catastro
                  </label>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end">
              <button type="submit" class="btn-primary" :disabled="savingApiConfig">
                {{ savingApiConfig ? 'Guardando...' : 'Guardar Configuración' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Preferencias del Sistema -->
      <div class="card">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Preferencias del Sistema</h3>
          
          <form @submit.prevent="savePreferences" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Moneda por Defecto</label>
                <select v-model="preferences.currency" class="input-field">
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">Dólar ($)</option>
                  <option value="GBP">Libra (£)</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Formato de Fecha</label>
                <select v-model="preferences.dateFormat" class="input-field">
                  <option value="dd/MM/yyyy">DD/MM/AAAA</option>
                  <option value="MM/dd/yyyy">MM/DD/AAAA</option>
                  <option value="yyyy-MM-dd">AAAA-MM-DD</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
                <select v-model="preferences.language" class="input-field">
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Zona Horaria</label>
                <select v-model="preferences.timezone" class="input-field">
                  <option value="Europe/Madrid">Madrid (CET)</option>
                  <option value="Europe/London">Londres (GMT)</option>
                  <option value="America/New_York">Nueva York (EST)</option>
                </select>
              </div>
            </div>
            
            <div class="space-y-4">
              <h4 class="text-md font-medium text-gray-900">Notificaciones</h4>
              
              <div class="space-y-3">
                <div class="flex items-center">
                  <input 
                    v-model="preferences.notifications.email" 
                    type="checkbox" 
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">
                    Notificaciones por email
                  </label>
                </div>
                
                <div class="flex items-center">
                  <input 
                    v-model="preferences.notifications.browser" 
                    type="checkbox" 
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">
                    Notificaciones del navegador
                  </label>
                </div>
                
                <div class="flex items-center">
                  <input 
                    v-model="preferences.notifications.marketUpdates" 
                    type="checkbox" 
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">
                    Actualizaciones del mercado inmobiliario
                  </label>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end">
              <button type="submit" class="btn-primary" :disabled="savingPreferences">
                {{ savingPreferences ? 'Guardando...' : 'Guardar Preferencias' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Configuración de Valoración -->
      <div class="card">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Configuración de Valoración</h3>
          
          <form @submit.prevent="saveValuationConfig" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Metodología por Defecto</label>
                <select v-model="valuationConfig.defaultMethodology" class="input-field">
                  <option value="Comparación">Método de Comparación</option>
                  <option value="Coste">Método del Coste</option>
                  <option value="Residual">Método Residual</option>
                  <option value="Capitalización">Método de Capitalización</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Margen de Seguridad (%)</label>
                <input 
                  v-model.number="valuationConfig.safetyMargin" 
                  type="number" 
                  min="0" 
                  max="20" 
                  step="0.5"
                  class="input-field"
                />
                <p class="mt-1 text-xs text-gray-500">
                  Margen aplicado para valor hipotecario
                </p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Número de Comparables</label>
                <input 
                  v-model.number="valuationConfig.comparablesCount" 
                  type="number" 
                  min="3" 
                  max="15"
                  class="input-field"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Radio de Búsqueda (km)</label>
                <input 
                  v-model.number="valuationConfig.searchRadius" 
                  type="number" 
                  min="0.5" 
                  max="10" 
                  step="0.5"
                  class="input-field"
                />
              </div>
            </div>
            
            <div class="space-y-4">
              <h4 class="text-md font-medium text-gray-900">Ajustes Automáticos</h4>
              
              <div class="space-y-3">
                <div class="flex items-center">
                  <input 
                    v-model="valuationConfig.autoAdjustments.location" 
                    type="checkbox" 
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">
                    Ajuste automático por ubicación
                  </label>
                </div>
                
                <div class="flex items-center">
                  <input 
                    v-model="valuationConfig.autoAdjustments.condition" 
                    type="checkbox" 
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">
                    Ajuste automático por estado de conservación
                  </label>
                </div>
                
                <div class="flex items-center">
                  <input 
                    v-model="valuationConfig.autoAdjustments.features" 
                    type="checkbox" 
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">
                    Ajuste automático por características especiales
                  </label>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end">
              <button type="submit" class="btn-primary" :disabled="savingValuationConfig">
                {{ savingValuationConfig ? 'Guardando...' : 'Guardar Configuración' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Información del Sistema -->
      <div class="card">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Información del Sistema</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-2">Versión del Sistema</h4>
              <p class="text-sm text-gray-600">CRM Valorador v1.0.0</p>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-2">Última Actualización</h4>
              <p class="text-sm text-gray-600">{{ formatDate(new Date()) }}</p>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-2">Base de Datos</h4>
              <p class="text-sm text-gray-600">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Conectada
                </span>
              </p>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-2">APIs Externas</h4>
              <div class="space-y-1">
                <p class="text-xs text-gray-600">
                  Google Maps: 
                  <span :class="apiConfig.googleMapsKey ? 'text-green-600' : 'text-red-600'">
                    {{ apiConfig.googleMapsKey ? 'Configurada' : 'No configurada' }}
                  </span>
                </p>
                <p class="text-xs text-gray-600">
                  Idealista: 
                  <span :class="apiConfig.idealistaKey ? 'text-green-600' : 'text-red-600'">
                    {{ apiConfig.idealistaKey ? 'Configurada' : 'No configurada' }}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div class="mt-6 pt-6 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Exportar Configuración</h4>
                <p class="text-sm text-gray-600">Descarga un backup de toda tu configuración</p>
              </div>
              <button @click="exportConfig" class="btn-secondary">
                <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
                Exportar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const toast = useToast()

const savingProfile = ref(false)
const savingApiConfig = ref(false)
const savingPreferences = ref(false)
const savingValuationConfig = ref(false)

const profile = ref({
  name: 'Tasador Profesional',
  email: 'tasador@ejemplo.com',
  collegialNumber: 'COL-12345',
  professionalCollege: 'Colegio de Arquitectos de Madrid',
  phone: '+34 600 000 000',
  insurancePolicy: 'POL-123456789',
  address: 'Calle Ejemplo, 123\n28001 Madrid'
})

const apiConfig = ref({
  googleMapsKey: '',
  idealistaKey: '',
  idealistaSecret: '',
  catastroEnabled: true
})

const preferences = ref({
  currency: 'EUR',
  dateFormat: 'dd/MM/yyyy',
  language: 'es',
  timezone: 'Europe/Madrid',
  notifications: {
    email: true,
    browser: true,
    marketUpdates: true
  }
})

const valuationConfig = ref({
  defaultMethodology: 'Comparación',
  safetyMargin: 2.0,
  comparablesCount: 5,
  searchRadius: 2.0,
  autoAdjustments: {
    location: true,
    condition: true,
    features: true
  }
})

onMounted(() => {
  loadSettings()
})

function loadSettings() {
  // Cargar configuración desde localStorage
  const savedProfile = localStorage.getItem('crmvalorador_profile')
  if (savedProfile) {
    profile.value = { ...profile.value, ...JSON.parse(savedProfile) }
  }
  
  const savedApiConfig = localStorage.getItem('crmvalorador_api_config')
  if (savedApiConfig) {
    apiConfig.value = { ...apiConfig.value, ...JSON.parse(savedApiConfig) }
  }
  
  const savedPreferences = localStorage.getItem('crmvalorador_preferences')
  if (savedPreferences) {
    preferences.value = { ...preferences.value, ...JSON.parse(savedPreferences) }
  }
  
  const savedValuationConfig = localStorage.getItem('crmvalorador_valuation_config')
  if (savedValuationConfig) {
    valuationConfig.value = { ...valuationConfig.value, ...JSON.parse(savedValuationConfig) }
  }
}

async function saveProfile() {
  savingProfile.value = true
  
  try {
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    localStorage.setItem('crmvalorador_profile', JSON.stringify(profile.value))
    toast.success('Perfil guardado correctamente')
  } catch (error) {
    console.error('Error guardando perfil:', error)
    toast.error('Error al guardar el perfil')
  } finally {
    savingProfile.value = false
  }
}

async function saveApiConfig() {
  savingApiConfig.value = true
  
  try {
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    localStorage.setItem('crmvalorador_api_config', JSON.stringify(apiConfig.value))
    toast.success('Configuración de APIs guardada correctamente')
  } catch (error) {
    console.error('Error guardando configuración de APIs:', error)
    toast.error('Error al guardar la configuración de APIs')
  } finally {
    savingApiConfig.value = false
  }
}

async function savePreferences() {
  savingPreferences.value = true
  
  try {
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    localStorage.setItem('crmvalorador_preferences', JSON.stringify(preferences.value))
    toast.success('Preferencias guardadas correctamente')
  } catch (error) {
    console.error('Error guardando preferencias:', error)
    toast.error('Error al guardar las preferencias')
  } finally {
    savingPreferences.value = false
  }
}

async function saveValuationConfig() {
  savingValuationConfig.value = true
  
  try {
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    localStorage.setItem('crmvalorador_valuation_config', JSON.stringify(valuationConfig.value))
    toast.success('Configuración de valoración guardada correctamente')
  } catch (error) {
    console.error('Error guardando configuración de valoración:', error)
    toast.error('Error al guardar la configuración de valoración')
  } finally {
    savingValuationConfig.value = false
  }
}

function exportConfig() {
  const config = {
    profile: profile.value,
    apiConfig: apiConfig.value,
    preferences: preferences.value,
    valuationConfig: valuationConfig.value,
    exportDate: new Date().toISOString()
  }
  
  const dataStr = JSON.stringify(config, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(dataBlob)
  link.download = `crmvalorador_config_${format(new Date(), 'yyyy-MM-dd')}.json`
  link.click()
  
  toast.success('Configuración exportada correctamente')
}

function formatDate(date) {
  return format(new Date(date), 'dd MMMM yyyy', { locale: es })
}
</script> 