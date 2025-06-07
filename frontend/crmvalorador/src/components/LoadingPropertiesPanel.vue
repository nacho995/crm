<template>
  <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">Cargar Propiedades del Mercado</h3>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600">
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Opciones de carga -->
      <div class="grid grid-cols-1 gap-4">
        <!-- Carga TODOS LOS PORTALES - 100% COBERTURA -->
        <div class="border-2 border-emerald-400 rounded-lg p-4 hover:border-emerald-500 transition-colors bg-emerald-50"
             :class="{ 'border-emerald-600 bg-emerald-100': loadingType === 'allportals' }"
             @click="loadingType = 'allportals'">
          <div class="flex items-start">
            <input type="radio" v-model="loadingType" value="allportals" class="mt-1 text-emerald-600" />
            <div class="ml-3">
              <h4 class="font-medium text-gray-900 flex items-center">
                🏠 TODOS los Portales - 100% Cobertura Madrid
                <span class="ml-2 text-xs bg-emerald-200 text-emerald-800 px-2 py-1 rounded font-bold">¡ACTIVADO!</span>
              </h4>
              <p class="text-sm text-gray-600 mt-1">Idealista + Fotocasa + Habitaclia + Pisos.com</p>
              <div class="text-xs text-emerald-700 mt-1 font-medium">✅ 100% del mercado inmobiliario madrileño</div>
              <div class="text-xs text-gray-500 mt-1">📊 Estimado: 2,000-3,000 propiedades | Carga en paralelo</div>
            </div>
          </div>
        </div>

        <!-- Carga estándar -->
        <div class="border rounded-lg p-4 hover:border-blue-300 transition-colors"
             :class="{ 'border-blue-500 bg-blue-50': loadingType === 'standard' }"
             @click="loadingType = 'standard'">
          <div class="flex items-start">
            <input type="radio" v-model="loadingType" value="standard" class="mt-1 text-blue-600" />
            <div class="ml-3">
              <h4 class="font-medium text-gray-900">Solo Idealista (Básico)</h4>
              <p class="text-sm text-gray-600 mt-1">Propiedades de Madrid Provincia desde Idealista únicamente</p>
              <div class="text-xs text-gray-500 mt-1">📊 70% del mercado inmobiliario español | GRATIS</div>
            </div>
          </div>
        </div>

        <!-- Carga de lujo -->
        <div class="border rounded-lg p-4 hover:border-yellow-300 transition-colors"
             :class="{ 'border-yellow-500 bg-yellow-50': loadingType === 'luxury' }"
             @click="loadingType = 'luxury'">
          <div class="flex items-start">
            <input type="radio" v-model="loadingType" value="luxury" class="mt-1 text-yellow-600" />
            <div class="ml-3">
              <h4 class="font-medium text-gray-900 flex items-center">
                🏆 Propiedades de Lujo - TODOS los Portales
                <span class="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">1M€+</span>
              </h4>
              <p class="text-sm text-gray-600 mt-1">Idealista + Habitaclia + Pisos.com (Fotocasa requiere suscripción)</p>
              <div class="text-xs text-yellow-700 mt-1 font-medium">💎 100% cobertura del segmento premium</div>
              <div class="text-xs text-gray-500 mt-1">🏅 Particulares de lujo + Inmobiliarias premium</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Configuración TODOS LOS PORTALES -->
      <div v-if="loadingType === 'allportals'" class="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <h5 class="font-medium text-gray-900 mb-3">🏠 Configuración 100% Cobertura Madrid</h5>
        <div class="grid grid-cols-1 gap-4">
          <div class="bg-white p-3 rounded border">
            <div class="text-sm font-medium text-gray-900 mb-2">Portales incluidos:</div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="flex items-center">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Idealista (GRATIS, 70%) ✅
              </div>
              <div class="flex items-center">
                <span class="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Fotocasa ($23/mes, 20%) ⚠️ Requiere suscripción
              </div>
              <div class="flex items-center">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Habitaclia (Custom, 8%) ✅
              </div>
              <div class="flex items-center">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Pisos.com (Custom, 5%) ✅
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Propiedades por Portal</label>
            <select v-model="allPortalsConfig.maxItems" class="input-field text-sm">
              <option :value="500">~500 por portal (~2,000 total)</option>
              <option :value="1000">~1,000 por portal (~4,000 total)</option>
              <option :value="1500">~1,500 por portal (~6,000 total)</option>
              <option :value="2000">~2,000 por portal (~8,000 total) ¡MÁXIMO!</option>
            </select>
            <p class="mt-1 text-xs text-emerald-600">💰 Costo total: ~$25/mes + compute (~$2-3/carga)</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Filtros de precio (opcional)</label>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <select v-model="allPortalsConfig.minPrice" class="input-field text-sm">
                  <option :value="0">Sin mínimo</option>
                  <option :value="100000">100.000€</option>
                  <option :value="200000">200.000€</option>
                  <option :value="300000">300.000€</option>
                  <option :value="500000">500.000€</option>
                </select>
              </div>
              <div>
                <select v-model="allPortalsConfig.maxPrice" class="input-field text-sm">
                  <option :value="0">Sin máximo</option>
                  <option :value="500000">500.000€</option>
                  <option :value="1000000">1.000.000€</option>
                  <option :value="2000000">2.000.000€</option>
                  <option :value="5000000">5.000.000€</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Configuración estándar -->
      <div v-if="loadingType === 'standard'" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 class="font-medium text-gray-900 mb-3">📊 Configuración Solo Idealista</h5>
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Número Máximo de Propiedades</label>
            <select v-model="standardConfig.maxItems" class="input-field text-sm">
              <option :value="100">~100 propiedades (Rápido)</option>
              <option :value="250">~250 propiedades</option>
              <option :value="500">~500 propiedades</option>
              <option :value="1000">~1,000 propiedades (¡TODAS MADRID!)</option>
              <option :value="2000">~2,000 propiedades (Máximo posible)</option>
              <option :value="0">Todas las disponibles (Sin límite)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Configuración lujo -->
      <div v-if="loadingType === 'luxury'" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h5 class="font-medium text-gray-900 mb-3">🏆 Configuración Propiedades de Lujo - TODOS los Portales</h5>
        <div class="grid grid-cols-1 gap-4">
          <div class="bg-white p-3 rounded border">
            <div class="text-sm font-medium text-gray-900 mb-2">Portales incluidos para lujo:</div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="flex items-center">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Idealista (GRATIS) ✅
              </div>
              <div class="flex items-center">
                <span class="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Fotocasa (Requiere suscripción) ⚠️
              </div>
              <div class="flex items-center">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Habitaclia (Custom) ✅
              </div>
              <div class="flex items-center">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Pisos.com (Custom) ✅
              </div>
            </div>
            <div class="mt-2 text-xs text-yellow-700 font-medium">💎 Máxima cobertura del segmento premium inmobiliario</div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Precio mínimo</label>
              <select v-model="luxuryConfig.minPrice" class="input-field text-sm">
                <option :value="1000000">1.000.000€</option>
                <option :value="1500000">1.500.000€</option>
                <option :value="2000000">2.000.000€</option>
                <option :value="3000000">3.000.000€</option>
                <option :value="5000000">5.000.000€</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad por portal</label>
              <select v-model="luxuryConfig.maxItems" class="input-field text-sm">
                <option :value="100">~100 por portal (~400 total)</option>
                <option :value="200">~200 por portal (~800 total)</option>
                <option :value="500">~500 por portal (~2,000 total)</option>
                <option :value="1000">~1,000 por portal (~4,000 total)</option>
                <option :value="2000">~2,000 por portal (~8,000 total) ¡MÁXIMO!</option>
              </select>
            </div>
          </div>
          <div class="text-xs text-gray-600 bg-yellow-100 p-2 rounded">
            🎯 <strong>Ventaja premium:</strong> Acceso a particulares de lujo que venden directamente + inmobiliarias especializadas en propiedades premium
          </div>
        </div>
      </div>

      <!-- Progreso de carga -->
      <div v-if="loading" class="space-y-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-900">
              {{ getProgressText() }}
            </span>
            <span class="text-sm text-gray-600">{{ progress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="h-2 rounded-full transition-all duration-300"
              :class="{
                'bg-yellow-600': loadingType === 'luxury',
                'bg-emerald-600': loadingType === 'allportals',
                'bg-blue-600': loadingType === 'standard'
              }"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
          <div class="mt-2 text-xs text-gray-600">
            {{ propertiesLoaded > 0 ? `${propertiesLoaded.toLocaleString()} propiedades procesadas.` : 'Iniciando petición a Apify...' }}
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button @click="emit('close')" class="btn-secondary" :disabled="loading">
          Cancelar
        </button>
        <button @click="startLoading" :disabled="loading" 
                class="btn-primary flex items-center gap-2"
                :class="{ 
                  'bg-yellow-600 hover:bg-yellow-700': loadingType === 'luxury',
                  'bg-emerald-600 hover:bg-emerald-700': loadingType === 'allportals'
                }">
          <component :is="loading ? 'div' : PlayIcon" 
                     :class="loading ? 'animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full' : 'h-4 w-4'" />
          {{ loading ? 'Cargando...' : getLoadingButtonText() }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { XMarkIcon, PlayIcon } from '@heroicons/vue/24/outline';
import { useMarketPropertiesStore } from '../stores/marketProperties';
import { useToast } from 'vue-toastification';

const emit = defineEmits(['close', 'loaded']);
const marketStore = useMarketPropertiesStore();
const toast = useToast();

const loading = ref(false);
const progress = ref(0);
const propertiesLoaded = ref(0);
const loadingType = ref('allportals'); // Cambio a 'allportals' por defecto para mostrar la nueva funcionalidad

const standardConfig = reactive({
  maxItems: 1000, // Cambio de 500 a 1000 para obtener TODAS las propiedades
});

const luxuryConfig = reactive({
  minPrice: 1000000,
  maxItems: 500,
});

const multiPortalConfig = reactive({
  maxItems: 1000, // Valor por defecto para obtener todas las propiedades
});

const allPortalsConfig = reactive({
  maxItems: 1000, // Aumentado de 500 a 1000 por defecto
  minPrice: 0,
  maxPrice: 0,
});

async function startLoading() {
  loading.value = true;
  progress.value = 0;
  propertiesLoaded.value = 0;
  let fetchedProperties = [];

  // Simulación de progreso
  progress.value = 10;
  let progressInterval = setInterval(() => {
    if (loading.value && progress.value < 90) {
      progress.value += 8;
    } else if (!loading.value) {
        clearInterval(progressInterval);
    }
  }, 400);

  try {
    if (loadingType.value === 'luxury') {
      // Carga de propiedades de lujo desde TODOS los portales
      const luxuryParams = {
        minPrice: parseInt(luxuryConfig.minPrice),
        maxPrice: 0, // Sin límite superior
        maxItems: parseInt(luxuryConfig.maxItems)
      };
      
      toast.info(`🏆 Iniciando carga de propiedades de lujo desde TODOS los portales (minPrice: ${luxuryParams.minPrice.toLocaleString()}€)...`);
      
      await marketStore.fetchAllPortalsProperties(true, luxuryParams);
      fetchedProperties = marketStore.properties;
      
    } else if (loadingType.value === 'allportals') {
      // Carga de TODOS los portales (100% cobertura)
      const allPortalsParams = {
        maxItems: parseInt(allPortalsConfig.maxItems),
        minPrice: parseInt(allPortalsConfig.minPrice),
        maxPrice: parseInt(allPortalsConfig.maxPrice) || 0
      };
      
      toast.info(`🚀 Iniciando carga de TODOS los portales (${allPortalsParams.maxItems} por portal, 100% cobertura)...`);
      
      await marketStore.fetchAllPortalsProperties(true, allPortalsParams);
      fetchedProperties = marketStore.properties;
      
    } else {
      // Carga estándar del mercado completo (solo Idealista)
      const standardParams = {
        minPrice: 0,
        maxItems: parseInt(standardConfig.maxItems)
      };
      
      toast.info(`Iniciando carga de mercado básico (Solo Idealista, maxItems: ${standardParams.maxItems || 'Todas'})...`);
      
      await marketStore.fetchAndSetProperties(true, marketStore.defaultLocationQuery, standardParams);
      fetchedProperties = marketStore.properties;
    }

    loading.value = false;
    clearInterval(progressInterval);
    progress.value = 100;
    propertiesLoaded.value = fetchedProperties.length;

    if (propertiesLoaded.value > 0) {
      let typeText = '';
      if (loadingType.value === 'luxury') {
        typeText = 'de lujo de todos los portales (100% cobertura premium)';
      } else if (loadingType.value === 'allportals') {
        typeText = 'de todos los portales (100% cobertura Madrid)';
      } else {
        typeText = 'básicas (Solo Idealista)';
      }
      
      toast.success(`✅ ¡${propertiesLoaded.value.toLocaleString()} propiedades ${typeText} cargadas!`);
      
      // Mostrar estadísticas de tipo de vendedor
      const stats = marketStore.sellerTypeStats;
      if (stats.private > 0 || stats.agency > 0) {
        toast.info(`📊 Particulares: ${stats.private} | Inmobiliarias: ${stats.agency}`, { timeout: 5000 });
      }
      
      // Si es todos los portales o lujo, mostrar estadísticas por portal
      if ((loadingType.value === 'allportals' || loadingType.value === 'luxury') && marketStore.portalStats) {
        const portalInfo = Object.entries(marketStore.portalStats).map(([portal, stats]) => 
          `${portal}: ${stats.count}`
        ).join(' | ');
        toast.info(`🏠 Por portal: ${portalInfo}`, { timeout: 7000 });
      }
      
      emit('loaded', fetchedProperties);
    } else {
      toast.warn('No se encontraron propiedades con los criterios especificados.');
    }
    emit('close');

  } catch (error) {
    loading.value = false;
    clearInterval(progressInterval);
    progress.value = 100;
    console.error('Error cargando propiedades desde LoadingPropertiesPanel:', error);
    toast.error(`Error al cargar: ${error.message}`);
    emit('close');
  }
}

function getLoadingButtonText() {
  if (loadingType.value === 'luxury') {
    return '🏆 Cargar Lujo (TODOS los Portales)';
  } else if (loadingType.value === 'allportals') {
    return '🏠 Cargar TODOS los Portales (100%)';
  } else {
    return '📊 Cargar Solo Idealista';
  }
}

function getProgressText() {
  if (loadingType.value === 'luxury') {
    return '🏆 Cargando propiedades de lujo de todos los portales...';
  } else if (loadingType.value === 'allportals') {
    return '🏠 Cargando TODOS los Portales (100% cobertura)...';
  } else {
    return '📊 Cargando mercado básico (Solo Idealista)...';
  }
}
</script> 