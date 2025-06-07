<template>
  <div>
    <div class="sm:flex sm:items-center mb-8">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-bold text-gray-900">Mapa de Propiedades</h1>
        <p class="mt-2 text-sm text-gray-700">Explora todas las propiedades disponibles en Madrid y alrededores</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button 
          type="button" 
          class="btn-primary" 
          @click="loadMarketData"
          :disabled="marketStore.loading"
        >
          {{ marketStore.loading ? 'Cargando...' : 'Cargar Datos del Mercado' }}
        </button>
      </div>
    </div>

    <!-- Controles superiores -->
    <div class="mb-6 bg-white rounded-lg shadow-sm p-4">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-gray-900">Mapa del Mercado Inmobiliario</h1>
          <div class="flex items-center space-x-2">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-green-500 rounded-full mr-2 border border-white"></div>
              <span class="text-sm text-gray-600">Particulares</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-orange-600 rounded-full mr-2 border-2 border-yellow-400"></div>
              <span class="text-sm text-gray-600">Inmobiliarias</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span class="text-sm text-gray-600">Mis propiedades</span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <!-- Indicador de tiempo real -->
          <div class="flex items-center space-x-2">
            <div :class="[
              'w-2 h-2 rounded-full',
              marketStore.isRealTimeEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
            ]"></div>
            <span class="text-sm text-gray-600">
              {{ marketStore.isRealTimeEnabled ? 'Tiempo real activo' : 'Tiempo real inactivo' }}
            </span>
          </div>
          
          <!-- Info del caché -->
          <div v-if="cacheInfo" class="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
            💾 Caché: {{ cacheInfo.count }} props ({{ cacheInfo.age }}min)
          </div>
          
          <!-- Botón para limpiar caché -->
          <button
            @click="clearCache"
            class="btn-sm bg-gray-500 hover:bg-gray-600 text-white"
            title="Limpiar caché y recargar datos"
          >
            🗑️ Limpiar Caché
          </button>
          
          <!-- Botón para cargar propiedades de lujo -->
          <!-- TEMPORALMENTE DESACTIVADO PARA EVITAR 429 -->
          <!--
          <button
            @click="loadLuxuryProperties"
            :disabled="marketStore.loading"
            class="btn-sm bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2"
          >
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            {{ marketStore.loading ? 'Cargando...' : '🏆 Cargar Propiedades de Lujo' }}
          </button>
          -->
          
          <!-- Botón para cargar más propiedades -->
          <button
            @click="openLoadingPanel"
            :disabled="marketStore.loading"
            class="btn-sm btn-primary flex items-center gap-2"
          >
            <HomeIcon class="h-4 w-4" />
            {{ marketStore.loading ? 'Cargando...' : 'Cargar TODAS las Propiedades' }}
          </button>
          
          <!-- Botón de actualización en tiempo real -->
          <button
            @click="toggleRealTimeUpdates"
            :class="[
              'btn-sm flex items-center gap-2',
              marketStore.isRealTimeEnabled ? 'btn-secondary' : 'btn-primary'
            ]"
          >
            <ArrowPathIcon class="h-4 w-4" />
            {{ marketStore.isRealTimeEnabled ? 'Pausar' : 'Activar' }} Tiempo Real
          </button>
          
          <!-- Botón de actualización manual -->
          <button
            @click="refreshData"
            :disabled="marketStore.loading"
            class="btn-secondary flex items-center gap-2"
          >
            <ArrowPathIcon :class="['h-4 w-4', marketStore.loading && 'animate-spin']" />
            Actualizar
          </button>
          
          <!-- Información de fuentes -->
          <div class="text-sm text-gray-500">
            <span>Fuentes: {{ activeSources.join(', ') }}</span>
            <br>
            <span>Última actualización: {{ lastUpdateText }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros avanzados -->
    <div class="mb-6 bg-white rounded-lg shadow-sm p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <!-- Filtro por tipo de vendedor -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Vendedor</label>
          <select v-model="filters.sellerType" class="input-field text-sm">
            <option value="">Todos</option>
            <option value="Particular">Solo Particulares</option>
            <option value="Inmobiliaria">Solo Inmobiliarias</option>
          </select>
        </div>

        <!-- Filtro por fuente -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fuente</label>
          <select v-model="filters.source" class="input-field text-sm">
            <option value="">Todas las fuentes</option>
            <option v-for="source in activeSources" :key="source" :value="source">
              {{ getPortalDisplayName(source) }}
            </option>
          </select>
        </div>

        <!-- Filtro por tipo -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select v-model="filters.type" class="input-field text-sm">
            <option value="">Todos los tipos</option>
            <option value="flat">Piso</option>
            <option value="penthouse">Ático</option>
            <option value="house">Casa</option>
            <option value="chalet">Chalet</option>
            <option value="studio">Estudio</option>
            <option value="duplex">Dúplex</option>
          </select>
        </div>

        <!-- Filtro por precio -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Precio máximo</label>
          <select v-model="filters.maxPrice" class="input-field text-sm">
            <option value="">Sin límite</option>
            <option :value="200000">200.000€</option>
            <option :value="300000">300.000€</option>
            <option :value="500000">500.000€</option>
            <option :value="750000">750.000€</option>
            <option :value="1000000">1.000.000€</option>
            <option :value="2000000">2.000.000€</option>
            <option :value="5000000">5.000.000€</option>
          </select>
        </div>

        <!-- Filtro por superficie -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Superficie mín.</label>
          <select v-model="filters.minSize" class="input-field text-sm">
            <option value="">Sin mínimo</option>
            <option :value="50">50 m²</option>
            <option :value="75">75 m²</option>
            <option :value="100">100 m²</option>
            <option :value="150">150 m²</option>
            <option :value="200">200 m²</option>
          </select>
        </div>

        <!-- Filtro por distrito -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Distrito</label>
          <select v-model="filters.district" class="input-field text-sm">
            <option value="">Todos los distritos</option>
            <option v-for="district in availableDistricts" :key="district" :value="district">
              {{ district }}
            </option>
          </select>
        </div>

        <!-- Búsqueda -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Dirección, distrito..."
            class="input-field text-sm"
          />
        </div>
      </div>
      
      <!-- Botones de filtros -->
      <div class="mt-4 flex justify-between items-center">
        <div class="flex gap-3">
          <button
            @click="applyFilters"
            :disabled="!hasAnyFilterValue()"
            class="btn-primary flex items-center gap-2"
            :class="{ 
              'opacity-50 cursor-not-allowed': !hasAnyFilterValue(),
              'bg-blue-600 hover:bg-blue-700': hasAnyFilterValue()
            }"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
            {{ hasActiveFiltersApplied ? 'Actualizar Filtros' : 'Aplicar Filtros' }}
          </button>
          
          <button
            @click="clearAllFilters"
            :disabled="!hasActiveFiltersApplied && !hasAnyFilterValue()"
            class="btn-secondary flex items-center gap-2"
            :class="{ 
              'opacity-50 cursor-not-allowed': !hasActiveFiltersApplied && !hasAnyFilterValue()
            }"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H9a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Limpiar Filtros
          </button>
        </div>
        
        <!-- Estadísticas de filtros -->
        <div class="text-sm text-gray-600">
          <span v-if="hasActiveFiltersApplied" class="text-blue-600 font-medium">
            🔍 Mostrando {{ currentFilteredCount }} de {{ totalPropertiesCount }} propiedades
          </span>
          <span v-else>
            📊 {{ totalPropertiesCount }} propiedades disponibles
          </span>
          <div class="text-xs mt-1">
            <span v-if="hasActiveFiltersApplied">
              Particulares: {{ filteredStats.private }} | Inmobiliarias: {{ filteredStats.agency }}
            </span>
            <span v-else>
              Particulares: {{ marketStore.sellerTypeStats.private }} ({{ marketStore.sellerTypeStats.privatePercentage }}%) | 
              Inmobiliarias: {{ marketStore.sellerTypeStats.agency }} ({{ marketStore.sellerTypeStats.agencyPercentage }}%)
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Mapa -->
    <div class="card p-0 overflow-hidden">
      <div 
        ref="mapContainer" 
        class="w-full h-96 lg:h-[600px]"
        style="min-height: 400px;"
      ></div>
    </div>

    <!-- Modal de detalles de propiedad -->
    <PropertyDetailsModal
      :show="showPropertyModal"
      :property="selectedProperty"
      @close="closePropertyModal"
    />

    <!-- Panel de carga de propiedades -->
    <div v-if="showLoadingPanel" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <LoadingPropertiesPanel
        @close="closeLoadingPanel"
        @loaded="onPropertiesLoaded"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  HomeIcon,
  ArrowPathIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'
import { useMarketPropertiesStore } from '../stores/marketProperties'
import { usePropertiesStore } from '../stores/properties'
import { useToast } from 'vue-toastification'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import PropertyDetailsModal from '../components/modals/PropertyDetailsModal.vue'
import LoadingPropertiesPanel from '../components/LoadingPropertiesPanel.vue'

const marketStore = useMarketPropertiesStore()
const propertiesStore = usePropertiesStore()
const toast = useToast()

const mapContainer = ref(null)
const map = ref(null)
const markers = ref([])
const infoWindow = ref(null)
const selectedProperty = ref(null)
const showPropertyModal = ref(false)
const showLoadingPanel = ref(false)
const searchQuery = ref('')

// Estados de filtros
const hasActiveFiltersApplied = ref(false)
const appliedFilters = ref({})
const currentFilteredProperties = ref([])

const filters = ref({
  type: '',
  maxPrice: null,
  minSize: null,
  district: '',
  source: '',
  sellerType: ''
})

const stats = ref({
  total: 0,
  forSale: 0,
  sold: 0,
  myProperties: 0,
  averagePrice: 0
})

const lastUpdateText = computed(() => {
  if (!marketStore.lastUpdate) return 'Nunca'
  return format(marketStore.lastUpdate, 'HH:mm:ss', { locale: es })
})

// Computed properties
const filteredProperties = computed(() => {
  // Si no hay filtros aplicados, devolver array vacío para evitar procesamiento innecesario
  if (!hasActiveFiltersApplied.value) {
    return [];
  }
  
  return currentFilteredProperties.value;
})

// Computed para todas las propiedades disponibles
const allAvailableProperties = computed(() => {
  return [...marketStore.properties, ...marketStore.allPortalsProperties];
})

// Estadísticas de propiedades filtradas
const filteredStats = computed(() => {
  const privateCount = currentFilteredProperties.value.filter(p => p.contactInfo?.userType === 'private').length;
  const agencyCount = currentFilteredProperties.value.filter(p => p.contactInfo?.userType === 'professional').length;
  return {
    private: privateCount,
    agency: agencyCount,
    total: currentFilteredProperties.value.length
  };
})

const currentFilteredCount = computed(() => currentFilteredProperties.value.length)
const totalPropertiesCount = computed(() => allAvailableProperties.value.length)

const availableDistricts = computed(() => {
  const districts = new Set()
  allAvailableProperties.value.forEach(prop => {
    // Manejar diferentes formatos de dirección de los portales
    let district = null
    
    if (prop.address && typeof prop.address === 'string') {
      // Para Idealista: "Calle ejemplo, Distrito, Madrid"
      district = prop.address.split(',')[1]?.trim()
    } else if (prop.location && typeof prop.location === 'string') {
      // Para otros portales que usan location
      district = prop.location.split(',')[0]?.trim()
    } else if (prop.district) {
      // Si ya viene separado el distrito
      district = prop.district
    } else if (prop.municipality) {
      // Si viene como municipality
      district = prop.municipality
    }
    
    if (district && district.length > 0) {
      districts.add(district)
    }
  })
  return Array.from(districts).sort()
})

const activeSources = computed(() => {
  const sources = new Set()
  
  allAvailableProperties.value.forEach(prop => {
    if (prop.portal) {
      sources.add(prop.portal)
    }
    if (prop.source) {
      sources.add(prop.source)
    }
  })
  
  return Array.from(sources).sort()
})

// Info del caché
const cacheInfo = computed(() => {
  return marketStore.getCacheInfo()
})

// ===== DECLARACIONES DE FUNCIONES (ANTES DE LOS WATCHERS) =====

// Función para actualizar marcadores en el mapa
function updateMapMarkers(properties) {
  if (!map.value || !Array.isArray(properties)) return

  // Limpiar marcadores existentes
  markers.value.forEach(marker => marker.setMap(null))
  markers.value = []

  // Solo log en desarrollo para debugging
  if (import.meta.env.DEV) {
    // Usar la misma lógica que el store para contar tipos de vendedor
    const privateCount = properties.filter(p => p.contactInfo?.userType === 'private').length
    const agencyCount = properties.filter(p => p.contactInfo?.userType === 'professional').length
    console.log(`🗺️ Actualizando ${properties.length} marcadores: ${privateCount} particulares, ${agencyCount} inmobiliarias`)
  }

  // Crear nuevos marcadores con distribución optimizada
  properties.forEach((property, index) => {
    // Usar latitude y longitude de Apify, no coordinates.lat/lng
    if (!property.latitude || !property.longitude) {
      if (import.meta.env.DEV) {
        console.warn(`Propiedad ${property.propertyCode} sin coordenadas válidas:`, { lat: property.latitude, lng: property.longitude });
      }
      return;
    }

    const marker = new google.maps.Marker({
      position: {
        lat: parseFloat(property.latitude),
        lng: parseFloat(property.longitude)
      },
      map: map.value,
      title: `[${getSellerTypeDisplay(property).toUpperCase()}] ${property.address || property.suggestedTexts?.subtitle || 'Dirección no disponible'} - ${formatCurrency(property.price)}`,
      icon: {
        url: getMarkerIcon(property),
        scaledSize: new google.maps.Size(32, 32)
      }
    })

    // Añadir click listener sin logs
    marker.addListener('click', () => {
      showPropertyInfo(property, marker)
    })

    markers.value.push(marker)
  })

  // Ajustar vista del mapa SOLO si hay propiedades
  if (markers.value.length > 0) {
    fitMapToMarkers()
  }
}

// Función auxiliar para obtener el tipo de vendedor en formato display
function getSellerTypeDisplay(property) {
  const userType = property.contactInfo?.userType;
  if (userType === 'private') return 'Particular';
  if (userType === 'professional') return 'Inmobiliaria';
  return 'Desconocido';
}

// Función para obtener icono de marcador
function getMarkerIcon(property) {
  const isPrivate = property.contactInfo?.userType === 'private'
  
  // Colores base para tipos de propiedades  
  const baseColors = {
    'flat': '#10B981',      // Verde - Piso
    'penthouse': '#F59E0B', // Amarillo - Ático  
    'house': '#3B82F6',     // Azul - Casa
    'chalet': '#8B5CF6',    // Púrpura - Chalet
    'studio': '#EF4444',    // Rojo - Estudio
    'duplex': '#06B6D4'     // Cian - Dúplex
  }
  
  // Usar propertyType de Apify y tener fallback
  const propertyType = property.propertyType || property.detailedType?.typology || 'flat';
  const baseColor = baseColors[propertyType] || '#6B7280' // Gris por defecto
  
  // Modificar color según tipo de vendedor
  const finalColor = isPrivate ? baseColor : adjustColorForAgency(baseColor)
  const borderColor = isPrivate ? 'white' : '#FFD700' // Borde dorado para inmobiliarias
  const borderWidth = isPrivate ? 2 : 3
  
  // Obtener letra para el marcador
  const letter = getPropertyTypeLetter(propertyType);
  
  // Determinar color de texto basado en el color de fondo para mejor legibilidad
  const textColor = getTextColor(finalColor);
  
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="${finalColor}" stroke="${borderColor}" stroke-width="${borderWidth}"/>
      <text x="16" y="21" text-anchor="middle" fill="${textColor}" font-size="12" font-family="Arial" font-weight="bold" stroke="${textColor === 'white' ? 'black' : 'white'}" stroke-width="0.5">
        ${letter}
      </text>
      ${!isPrivate ? `<circle cx="24" cy="8" r="4" fill="#FFD700" stroke="white" stroke-width="1"/>
        <text x="24" y="11" text-anchor="middle" fill="black" font-size="8" font-family="Arial" font-weight="bold">I</text>` : ''}
    </svg>
  `)}`
}

// Función auxiliar para obtener letra del tipo de propiedad
function getPropertyTypeLetter(propertyType) {
  const letters = {
    'flat': 'P',         // Piso
    'penthouse': 'A',    // Ático
    'house': 'C',        // Casa
    'chalet': 'CH',      // Chalet (dos letras)
    'studio': 'E',       // Estudio
    'duplex': 'D'        // Dúplex
  };
  return letters[propertyType] || 'P';
}

// Función para determinar el color de texto más legible según el color de fondo
function getTextColor(backgroundColor) {
  // Convertir hex a RGB
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calcular luminancia
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Si es oscuro usar blanco, si es claro usar negro
  return luminance > 0.5 ? 'black' : 'white';
}

// Función para ajustar el mapa a los marcadores
function fitMapToMarkers() {
  if (!map.value || markers.value.length === 0) return

  const bounds = new google.maps.LatLngBounds()
  
  markers.value.forEach(marker => {
    bounds.extend(marker.getPosition())
  })

  // Ajustar la vista para mostrar todos los marcadores
  map.value.fitBounds(bounds)
  
  // Opcional: establecer un zoom máximo para evitar que esté demasiado cerca
  google.maps.event.addListenerOnce(map.value, 'bounds_changed', () => {
    if (map.value.getZoom() > 15) {
      map.value.setZoom(15)
    }
  })
}

// Función para mostrar información de propiedad
function showPropertyInfo(property, marker) {
  const portalBadge = property.portal ? `<span class="inline-block bg-${getPortalColor(property.portal)}-100 text-${getPortalColor(property.portal)}-800 text-xs px-2 py-1 rounded-full mr-2">${getPortalName(property.portal)}</span>` : '';
  
  const price = property.price ? `${property.price.toLocaleString()}€` : 'Precio no disponible';
  const size = property.size || property.normalizedSize || 'No especificado';
  const rooms = property.rooms || property.normalizedRooms || 'No especificado';
  const sellerType = getSellerTypeDisplay(property.contactInfo?.userType || property.userType);
  const propertyType = getPropertyTypeDisplay(property.propertyType || property.type);
  
  const content = `
    <div class="property-info">
      <div class="mb-2">
        ${portalBadge}
        <strong class="text-lg">${property.title || property.suggestedTexts?.title || 'Propiedad sin título'}</strong>
      </div>
      <div class="space-y-1 text-sm">
        <div><strong>💰 Precio:</strong> ${price}</div>
        <div><strong>📐 Superficie:</strong> ${size} m²</div>
        <div><strong>🛏️ Habitaciones:</strong> ${rooms}</div>
        <div><strong>🏠 Tipo:</strong> ${propertyType}</div>
        <div><strong>👤 Vendedor:</strong> ${sellerType}</div>
        ${property.address ? `<div><strong>📍 Dirección:</strong> ${property.address}</div>` : ''}
        ${property.location ? `<div><strong>📍 Ubicación:</strong> ${property.location}</div>` : ''}
      </div>
      ${property.url ? `<div class="mt-2"><a href="${property.url}" target="_blank" class="text-blue-600 hover:text-blue-800 text-sm">Ver detalles →</a></div>` : ''}
    </div>
  `;
  
  infoWindow.value.setContent(content);
  infoWindow.value.open(map.value, marker);
}

/**
 * Obtiene el color del portal para el badge
 */
function getPortalColor(portal) {
  const colors = {
    'idealista': 'blue',
    'fotocasa': 'green', 
    'habitaclia': 'orange',
    'pisos': 'purple'
  };
  return colors[portal] || 'gray';
}

/**
 * Obtiene el nombre display del portal
 */
function getPortalName(portal) {
  const names = {
    'idealista': 'Idealista',
    'fotocasa': 'Fotocasa',
    'habitaclia': 'Habitaclia', 
    'pisos': 'Pisos.com'
  };
  return names[portal] || portal?.toUpperCase() || 'Desconocido';
}

// Función auxiliar para mostrar tipos de propiedad en español
function getPropertyTypeDisplay(propertyType) {
  const types = {
    'flat': 'Piso',
    'penthouse': 'Ático',
    'house': 'Casa',
    'chalet': 'Chalet',
    'studio': 'Estudio',
    'duplex': 'Dúplex'
  };
  return types[propertyType] || propertyType || 'Propiedad';
}

// Función para formatear moneda
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(amount)
}

// Otras funciones del componente
async function initializeMap() {
  try {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAarM-xF5a_V2aWbEzbdAvuv2X2Fbk47Ys',
      version: 'weekly',
      libraries: ['places']
    })

    const google = await loader.load()
    
    map.value = new google.maps.Map(mapContainer.value, {
      center: { lat: 40.4168, lng: -3.7038 }, // Madrid centro
      zoom: 11,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    })

    infoWindow.value = new google.maps.InfoWindow()
    
    // Solo log en desarrollo
    if (import.meta.env.DEV) {
      console.log('Mapa de Google Maps inicializado correctamente')
    }
  } catch (error) {
    console.error('Error inicializando Google Maps:', error)
    toast.error('Error cargando el mapa. Verifica la configuración de la API.')
  }
}

async function loadInitialData() {
  try {
    if (import.meta.env.DEV) {
      console.log('⚡ Iniciando carga de datos (caché + API)...')
    }
    
    const properties = await marketStore.fetchAndSetProperties()
    if (properties && properties.length > 0) {
      toast.success(`✅ Cargadas ${properties.length} propiedades del mercado`)
    } else {
      toast.warning('No se pudieron cargar propiedades del mercado')
      return
    }
    
    // Habilitar actualizaciones en tiempo real por defecto
    await marketStore.enableRealTimeUpdates()
    
  } catch (error) {
    console.error('Error cargando datos iniciales:', error)
    toast.error('Error cargando datos del mercado inmobiliario')
  }
}

async function toggleRealTimeUpdates() {
  try {
    if (marketStore.isRealTimeEnabled) {
      marketStore.disableRealTimeUpdates()
      toast.info('Actualizaciones en tiempo real desactivadas')
    } else {
      await marketStore.enableRealTimeUpdates()
      toast.success('Actualizaciones en tiempo real activadas')
    }
  } catch (error) {
    console.error('Error toggling real-time updates:', error)
    toast.error('Error al cambiar las actualizaciones en tiempo real')
  }
}

async function refreshData() {
  try {
    await marketStore.refreshData()
    toast.success('Datos actualizados correctamente')
  } catch (error) {
    console.error('Error refreshing data:', error)
    toast.error('Error actualizando los datos')
  }
}

async function openLoadingPanel() {
  showLoadingPanel.value = true
}

function closeLoadingPanel() {
  showLoadingPanel.value = false
}

// async loadLuxuryProperties() {
//   try {
//     console.log('🏆 Iniciando carga directa de propiedades de lujo...')
//     
//     const result = await marketStore.loadAllLuxuryPropertiesMultiPortal({
//       maxPages: 10, // 10 páginas por portal para dataset amplio
//       replaceExisting: false // Añadir a las existentes
//     })
//     
//     console.log(`✅ Propiedades de lujo cargadas:`, result)
//   } catch (error) {
//     console.error('❌ Error cargando propiedades de lujo:', error)
//   }
// }

function onPropertiesLoaded(properties) {
  // Usar la misma lógica que el store
  const privateCount = properties.filter(p => p.contactInfo?.userType === 'private').length
  const agencyCount = properties.filter(p => p.contactInfo?.userType === 'professional').length
  
  // Detectar si son propiedades de lujo (precio mínimo > 1M€)
  const luxuryCount = properties.filter(p => p.price >= 1000000).length
  const isLuxuryLoading = luxuryCount > properties.length * 0.8 // Si más del 80% son de lujo
  
  if (isLuxuryLoading) {
    toast.success(`🏆 ¡Cargadas ${properties.length.toLocaleString()} propiedades de LUJO de TODOS los portales!`)
    if (luxuryCount > 0) {
      toast.info(`💎 ${luxuryCount} propiedades premium (>1M€) | 📊 ${privateCount} particulares | ${agencyCount} inmobiliarias`, { timeout: 5000 })
    }
  } else {
    toast.success(`¡Cargadas ${properties.length.toLocaleString()} propiedades del MERCADO COMPLETO!`)
    if (privateCount > 0 || agencyCount > 0) {
      toast.info(`📊 ${privateCount} particulares | ${agencyCount} inmobiliarias`, { timeout: 3000 })
    }
  }
  
  // Solo log en desarrollo
  if (import.meta.env.DEV) {
    if (isLuxuryLoading) {
      console.log(`🏆 Se cargaron ${properties.length} propiedades de LUJO de TODOS los portales`)
      console.log(`   💎 ${luxuryCount} propiedades >1M€ | 📊 Particulares: ${privateCount} | Inmobiliarias: ${agencyCount}`)
    } else {
      console.log(`🎉 Se cargaron ${properties.length} propiedades del MERCADO COMPLETO`)
      console.log(`   📊 Particulares: ${privateCount} | Inmobiliarias: ${agencyCount}`)
    }
  }
}

function applyFilters() {
  // Guardar los filtros aplicados
  appliedFilters.value = { ...filters.value, searchQuery: searchQuery.value };
  
  let properties = [...allAvailableProperties.value];
  
  // Filtro por tipo de vendedor
  if (filters.value.sellerType) {
    const targetUserType = filters.value.sellerType === 'Particular' ? 'private' : 'professional';
    properties = properties.filter(prop => prop.contactInfo?.userType === targetUserType);
  }
  
  // Filtro por fuente/portal
  if (filters.value.source) {
    properties = properties.filter(prop => prop.portal === filters.value.source || prop.source === filters.value.source);
  }
  
  // Filtro por tipo de propiedad
  if (filters.value.type) {
    properties = properties.filter(prop => 
      prop.propertyType === filters.value.type || 
      prop.type === filters.value.type ||
      prop.detailedType?.typology === filters.value.type
    );
  }
  
  // Filtro por precio máximo
  if (filters.value.maxPrice) {
    properties = properties.filter(prop => prop.price <= filters.value.maxPrice);
  }
  
  // Filtro por superficie mínima
  if (filters.value.minSize) {
    properties = properties.filter(prop => 
      (prop.size && prop.size >= filters.value.minSize) ||
      (prop.normalizedSize && prop.normalizedSize >= filters.value.minSize)
    );
  }
  
  // Filtro por distrito
  if (filters.value.district) {
    properties = properties.filter(prop => {
      const propDistrict = prop.district || prop.municipality || 
        (prop.address && prop.address.split(',')[1]?.trim()) ||
        (prop.location && prop.location.split(',')[0]?.trim());
      return propDistrict && propDistrict.toLowerCase().includes(filters.value.district.toLowerCase());
    });
  }
  
  // Búsqueda por texto
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    properties = properties.filter(prop => {
      const address = prop.address || prop.location || '';
      const title = prop.title || prop.suggestedTexts?.title || '';
      const type = prop.propertyType || prop.type || '';
      return address.toLowerCase().includes(query) ||
             title.toLowerCase().includes(query) ||
             type.toLowerCase().includes(query);
    });
  }
  
  // Actualizar propiedades filtradas
  currentFilteredProperties.value = properties;
  hasActiveFiltersApplied.value = true;
  
  // Actualizar mapa
  updateMapMarkers(properties);
  updateStats(properties);
  
  toast.success(`🔍 Filtros aplicados: ${properties.length} propiedades encontradas`);
  
  if (import.meta.env.DEV) {
    console.log(`🔍 FILTROS APLICADOS: ${properties.length} propiedades filtradas`, filters.value);
  }
}

function clearAllFilters() {
  filters.value = {
    type: '',
    maxPrice: null,
    minSize: null,
    district: '',
    source: '',
    sellerType: ''
  }
  searchQuery.value = ''
  appliedFilters.value = {}
  currentFilteredProperties.value = []
  hasActiveFiltersApplied.value = false
  
  // Mostrar todas las propiedades
  updateMapMarkers(allAvailableProperties.value)
  updateStats(allAvailableProperties.value)
  
  toast.info('🗑️ Filtros eliminados - Mostrando todas las propiedades')
  
  if (import.meta.env.DEV) {
    console.log('🗑️ FILTROS LIMPIADOS: Mostrando todas las propiedades')
  }
}

function hasAnyFilterValue() {
  return !!(
    filters.value.sellerType ||
    filters.value.source ||
    filters.value.type ||
    filters.value.maxPrice ||
    filters.value.minSize ||
    filters.value.district ||
    searchQuery.value
  )
}

function getPortalDisplayName(portal) {
  const names = {
    'idealista': 'Idealista',
    'fotocasa': 'Fotocasa',
    'habitaclia': 'Habitaclia',
    'pisos': 'Pisos.com'
  };
  return names[portal] || portal;
}

function closePropertyModal() {
  showPropertyModal.value = false
  selectedProperty.value = null
}

async function clearCache() {
  try {
    marketStore.clearCache()
    toast.info('🗑️ Caché eliminado. Recargando datos frescos...')
    
    // Recargar datos desde API
    await marketStore.loadMarketProperties(true)
    
    toast.success(`✅ Datos frescos cargados: ${marketStore.properties.length} propiedades`)
  } catch (error) {
    console.error('Error recargando datos:', error)
    toast.error('Error recargando datos frescos')
  }
}

// Función para actualizar estadísticas
function updateStats(properties) {
  const myPropertiesCount = propertiesStore.properties.length
  const forSaleCount = properties.length; // Todas las propiedades de Apify están en venta
  const soldCount = 0; // Apify no maneja propiedades vendidas
  const totalPrice = properties.reduce((sum, p) => sum + (p.price || 0), 0)
  const averagePrice = properties.length > 0 ? Math.round(totalPrice / properties.length) : 0

  stats.value = {
    total: properties.length + myPropertiesCount,
    forSale: forSaleCount,
    sold: soldCount,
    myProperties: myPropertiesCount,
    averagePrice
  }
}

// Función para ajustar color para inmobiliarias (más oscuro)
function adjustColorForAgency(baseColor) {
  // Convertir a RGB y oscurecer
  const hex = baseColor.replace('#', '')
  const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 40)
  const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 40) 
  const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 40)
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// ===== WATCHERS (DESPUÉS DE LAS DECLARACIONES DE FUNCIÓN) =====

// Watcher principal para propiedades del store
watch(() => marketStore.properties, (newProperties) => {
  if (newProperties && newProperties.length > 0) {
    if (import.meta.env.DEV) {
      console.log(`🗺️ WATCHER: Propiedades del store actualizadas - ${newProperties.length} propiedades`)
    }
    // Solo actualizar si no hay filtros aplicados
    if (!hasActiveFiltersApplied.value) {
      updateMapMarkers(allAvailableProperties.value)
      updateStats(allAvailableProperties.value)
    }
  }
}, { deep: true, immediate: true })

// Watcher para detectar cambios en los datos de todos los portales
watch(() => marketStore.allPortalsProperties, (newProperties) => {
  if (newProperties && newProperties.length > 0) {
    if (import.meta.env.DEV) {
      console.log(`🏠 TODOS LOS PORTALES: ${newProperties.length} propiedades disponibles`)
    }
    // Solo actualizar si no hay filtros aplicados
    if (!hasActiveFiltersApplied.value) {
      updateMapMarkers(allAvailableProperties.value)
      updateStats(allAvailableProperties.value)
    }
  }
}, { deep: true })

// Watcher para total de propiedades (detecta cambios en background)
watch(() => marketStore.totalProperties, (newTotal, oldTotal) => {
  if (newTotal > oldTotal && import.meta.env.DEV) {
    console.log(`📈 TOTAL ACTUALIZADO: ${oldTotal} → ${newTotal} propiedades`)
    // Solo actualizar si no hay filtros aplicados
    if (!hasActiveFiltersApplied.value) {
      console.log(`🗺️ Forzando actualización del mapa...`)
      updateMapMarkers(allAvailableProperties.value)
    }
  }
}, { immediate: false })

// ===== LIFECYCLE HOOKS =====

onMounted(async () => {
  await initializeMap()
  await loadInitialData()
})

onUnmounted(() => {
  // Limpiar actualizaciones en tiempo real al salir
  marketStore.disableRealTimeUpdates()
})
</script>

<style>
/* Estilos para el mapa de Google */
.gm-style-iw {
  padding: 0 !important;
}

.gm-style-iw-d {
  overflow: hidden !important;
}

.map-container {
  height: 600px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden !important;
}
</style> 