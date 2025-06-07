<template>
  <div v-if="visible" class="fixed bottom-4 right-4 bg-gray-800 text-white p-6 rounded-lg shadow-xl max-w-md max-h-[80vh] overflow-auto z-50 tritium-debug-panel">
    <button @click="visible = false" class="absolute top-2 right-2 text-gray-400 hover:text-white">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
    <h2 class="text-xl font-bold mb-4 text-yellow-400">🐛 Debug Panel</h2>

    <div class="space-y-4 text-sm">
      <div>
        <h4 class="text-yellow-400 font-semibold">Estado del Store:</h4>
        <div class="ml-2 space-y-1">
          <p>Loading: <span :class="{ 'text-green-400': !storeInfo.loading, 'text-red-400': storeInfo.loading }">{{ storeInfo.loading }}</span></p>
          <p>Total Propiedades: <span class="text-cyan-400">{{ storeInfo.totalProperties }}</span></p>
          <p>Error: <span :class="{ 'text-red-400': storeInfo.error, 'text-gray-500': !storeInfo.error }">{{ storeInfo.error || 'Ninguno' }}</span></p>
          <p>Última Actualización: <span class="text-gray-400">{{ storeInfo.lastUpdate }}</span></p>
          <p>Location ID Actual: <span class="text-cyan-400">{{ storeInfo.currentLocationId || 'N/A' }}</span></p>
        </div>
      </div>

      <div>
        <h4 class="text-yellow-400 font-semibold">Información del Caché (Apify):</h4>
        <div class="ml-2 space-y-1">
          <div v-if="cacheInfoComputed.exists">
            <p>Propiedades en caché: {{ cacheInfoComputed.count }}</p>
            <p>Antigüedad: {{ cacheInfoComputed.age }} minutos</p>
            <p>Timestamp: {{ cacheInfoComputed.timestamp ? new Date(cacheInfoComputed.timestamp).toLocaleString() : 'N/A' }}</p>
            <p>Tamaño: {{ cacheInfoComputed.size }} KB</p>
          </div>
          <div v-else>
            <p>No hay datos de propiedades de Apify en caché.</p>
          </div>
          <button @click="clearMarketCacheHandler" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded mt-2 text-xs">Limpiar Caché de Apify</button>
        </div>
      </div>

      <div>
        <h4 class="text-yellow-400 font-semibold">Probar Conexión Apify:</h4>
        <div class="ml-2">
          <button @click="testApifyHandler" :disabled="isLoadingApifyTest" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs">
            {{ isLoadingApifyTest ? 'Probando...' : 'Ejecutar Test Apify (Madrid)' }}
          </button>
          <div v-if="apifyTestResults" class="mt-2 p-2 border rounded bg-gray-700 max-h-40 overflow-y-auto">
            <p><strong>Resultado:</strong> {{ apifyTestResults.status }}</p>
            <pre v-if="apifyTestResults.data" class="text-xs">{{ JSON.stringify(apifyTestResults.data, null, 2) }}</pre>
            <p v-if="apifyTestResults.message" class="text-red-400">Error: {{ apifyTestResults.message }}</p>
          </div>
        </div>
      </div>

      <div>
        <h4 class="text-yellow-400 font-semibold">Entorno Vite:</h4>
        <pre class="ml-2 text-xs p-2 bg-gray-700 rounded max-h-28 overflow-y-auto">{{ JSON.stringify(env, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useMarketPropertiesStore } from '../stores/marketProperties'
import { useToast } from 'vue-toastification'

const visible = ref(false)
const marketStore = useMarketPropertiesStore()
const toast = useToast()

const env = computed(() => import.meta.env)

const storeInfo = computed(() => ({
  loading: marketStore.loading,
  totalProperties: marketStore.totalProperties,
  error: marketStore.error,
  lastUpdate: marketStore.lastUpdate ? new Date(marketStore.lastUpdate).toLocaleString() : 'Nunca',
  currentLocationId: marketStore.currentLocationId,
}))

const cacheInfoComputed = computed(() => {
  return marketStore.getCacheInfo ? marketStore.getCacheInfo() : { exists: false, count: 0, age: 'N/A', timestamp: null, size: 0 }
})

const apifyTestResults = ref(null)
const isLoadingApifyTest = ref(false)

async function testApifyHandler() {
  isLoadingApifyTest.value = true
  apifyTestResults.value = null
  try {
    const result = await marketStore.testApifyConnection('Madrid')
    apifyTestResults.value = { status: 'Success', data: result }
    toast.success('Prueba de Apify exitosa.')
  } catch (error) {
    console.error('Error en prueba de Apify:', error)
    apifyTestResults.value = { status: 'Error', message: error.message }
    toast.error('Error en prueba de Apify: ' + error.message)
  } finally {
    isLoadingApifyTest.value = false
  }
}

function clearMarketCacheHandler() {
  localStorage.removeItem('crm_apify_market_properties')
  marketStore.$reset()
  toast.info('Caché de propiedades de Apify eliminado y store reseteado.')
}

onMounted(() => {
  const toggleDebugPanel = (event) => {
    if (event.ctrlKey && event.altKey && event.key === 'd') {
      visible.value = !visible.value
    }
  }
  window.addEventListener('keydown', toggleDebugPanel)
  if (import.meta.env.DEV && localStorage.getItem('tritium_debug_hidden') !== 'true') {
    visible.value = true
  }
})

watch(visible, (newValue) => {
  if (!newValue) {
    localStorage.setItem('tritium_debug_hidden', 'true')
  } else {
    localStorage.removeItem('tritium_debug_hidden')
  }
})
</script>

<style scoped>
.tritium-debug-panel {
  font-size: 0.8rem;
}
</style> 