// ❌ MULTI-PORTAL SERVICE DESACTIVADO - REEMPLAZADO POR RAPIDAPI MADRID
// const APIFY_TOKEN = 'apify_api_q4UAffStYGKDdfN1QZckUfJh9gqpKN412Q8M';
// const BASE_API_URL = 'https://api.apify.com/v2/acts';

// // Configuración de actors por portal
// const PORTAL_ACTORS = {
//   idealista: {
//     location: 'axlymxp/Idealista-location-scraper',
//     properties: 'igolaizola/idealista-scraper',
//     type: 'free' // Pay per usage
//   },
//   fotocasa: {
//     properties: 'azzouzana/fotocasa-es-search-results-scraper-by-search-url',
//     type: 'rental', // $30/mes + usage
//     active: false // Activar cuando sea necesario
//   }
//   // habitaclia: Custom implementation needed
//   // pisos: Custom implementation needed
// };

// /**
//  * Ejecuta un Actor de Apify y obtiene los resultados
//  */
// async function runActorAndGetDatasetItems(actorId, input) {
//   const url = `${BASE_API_URL}/${actorId.replace('/', '~')}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;
  
//   console.log(`[MultiPortal] Running Actor ${actorId} with input:`, input);

//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(input),
//     });

//     if (!response.ok) {
//       const errorBody = await response.text();
//       console.error(`[MultiPortal] Error running Actor ${actorId}. Status: ${response.status}`, errorBody);
//       throw new Error(`Actor ${actorId} execution failed with status ${response.status}: ${errorBody}`);
//     }

//     const data = await response.json();
//     console.log(`[MultiPortal] Actor ${actorId} finished. Results count:`, data?.length || 0);
//     return data;
//   } catch (error) {
//     console.error(`[MultiPortal] Exception while running Actor ${actorId}:`, error);
//     throw error;
//   }
// }

// /**
//  * Obtiene propiedades de Idealista (GRATIS)
//  */
// export async function fetchIdealistaProperties(searchParams) {
//   // Usar la implementación existente
//   const { fetchLocationId, fetchProperties } = await import('./apifyService');
  
//   let locationId = searchParams.locationId;
//   if (!locationId) {
//     locationId = await fetchLocationId(searchParams.locationQuery || 'Madrid');
//   }
  
//   if (!locationId) {
//     throw new Error('No se pudo obtener el locationId para Idealista');
//   }
  
//   const properties = await fetchProperties({
//     ...searchParams,
//     locationId
//   });
  
//   return properties.map(prop => ({
//     ...prop,
//     source: 'Idealista',
//     portalType: 'free'
//   }));
// }

// /**
//  * Obtiene propiedades de Fotocasa ($30/mes + usage)
//  */
// export async function fetchFotocasaProperties(searchParams) {
//   if (!PORTAL_ACTORS.fotocasa.active) {
//     console.log('[MultiPortal] Fotocasa actor is not active');
//     return [];
//   }
  
//   // Construir URL de búsqueda de Fotocasa
//   const baseUrl = 'https://www.fotocasa.es/es/alquiler/viviendas';
//   const location = searchParams.locationQuery || 'madrid';
//   const maxPrice = searchParams.maxPrice || '';
//   const minPrice = searchParams.minPrice || '';
  
//   let searchUrl = `${baseUrl}/${location}/todas-las-zonas/l`;
//   const params = new URLSearchParams();
  
//   if (maxPrice) params.append('maxPrice', Math.floor(maxPrice / 1000)); // Fotocasa usa miles
//   if (minPrice) params.append('minPrice', Math.floor(minPrice / 1000));
//   if (searchParams.propertyType) params.append('propertyType', searchParams.propertyType);
  
//   if (params.toString()) {
//     searchUrl += `?${params.toString()}`;
//   }
  
//   const input = {
//     startUrl: searchUrl,
//     maxItems: searchParams.maxItems || 100,
//     proxy: {
//       useApifyProxy: true,
//       apifyProxyGroups: ['RESIDENTIAL'],
//     }
//   };
  
//   try {
//     const properties = await runActorAndGetDatasetItems(
//       PORTAL_ACTORS.fotocasa.properties,
//       input
//     );
    
//     return properties.map(prop => ({
//       ...prop,
//       source: 'Fotocasa',
//       portalType: 'rental'
//     }));
//   } catch (error) {
//     console.error('[MultiPortal] Error fetching Fotocasa properties:', error);
//     return [];
//   }
// }

// /**
//  * Normaliza propiedades de diferentes fuentes al mismo formato
//  */
// function normalizeProperty(property, source) {
//   const normalized = {
//     id: property.id || property.propertyCode || generateId(),
//     title: property.title || property.description?.substring(0, 100) || 'Sin título',
//     price: extractPrice(property.price || property.priceInfo?.price?.amount || 0),
//     size: extractSize(property.size || property.description),
//     rooms: extractRooms(property.rooms || property.description),
//     bathrooms: property.bathrooms || 0,
//     description: property.description || '',
//     url: property.url || '',
//     images: extractImages(property),
//     location: extractLocation(property),
//     coordinates: extractCoordinates(property),
//     source: source,
//     timestamp: new Date().toISOString(),
//     features: extractFeatures(property)
//   };

//   return normalized;
// }

// // Funciones auxiliares para extracción de datos
// function generateId() {
//   return Math.random().toString(36).substr(2, 9);
// }

// function extractPrice(priceData) {
//   if (typeof priceData === 'number') return priceData;
//   if (typeof priceData === 'string') {
//     const match = priceData.match(/[\d.,]+/);
//     return match ? parseFloat(match[0].replace(',', '')) : 0;
//   }
//   return 0;
// }

// function extractSize(sizeData) {
//   if (typeof sizeData === 'number') return sizeData;
//   if (typeof sizeData === 'string') {
//     const match = sizeData.match(/(\d+)\s*m[²2]/i);
//     return match ? parseInt(match[1]) : 0;
//   }
//   return 0;
// }

// function extractRooms(roomsData) {
//   if (typeof roomsData === 'number') return roomsData;
//   if (typeof roomsData === 'string') {
//     const match = roomsData.match(/(\d+)\s*(hab|room|dormitor)/i);
//     return match ? parseInt(match[1]) : 0;
//   }
//   return 0;
// }

// function extractImages(property) {
//   if (property.images && Array.isArray(property.images)) {
//     return property.images.map(img => img.url || img);
//   }
//   if (property.thumbnail) {
//     return [property.thumbnail];
//   }
//   return [];
// }

// function extractLocation(property) {
//   return {
//     address: property.address || '',
//     district: property.district || '',
//     neighborhood: property.neighborhood || '',
//     city: property.municipality || property.city || 'Madrid'
//   };
// }

// function extractCoordinates(property) {
//   const lat = property.latitude || property.coordinates?.lat;
//   const lng = property.longitude || property.coordinates?.lng;
  
//   if (lat && lng) {
//     return { lat: parseFloat(lat), lng: parseFloat(lng) };
//   }
  
//   // Coordenadas aleatorias en Madrid si no están disponibles
//   return {
//     lat: 40.4168 + (Math.random() - 0.5) * 0.1,
//     lng: -3.7038 + (Math.random() - 0.5) * 0.1
//   };
// }

// function extractFeatures(property) {
//   const features = [];
//   if (property.features?.hasSwimmingPool) features.push('Piscina');
//   if (property.features?.hasTerrace) features.push('Terraza');
//   if (property.features?.hasAirConditioning) features.push('Aire acondicionado');
//   if (property.features?.hasGarden) features.push('Jardín');
//   if (property.hasLift) features.push('Ascensor');
//   return features;
// }

// /**
//  * Obtiene propiedades de TODOS los portales activos
//  */
// export async function fetchAllPortalsProperties(searchParams = {}) {
//   const results = {
//     properties: [],
//     stats: {
//       total: 0,
//       bySource: {},
//       errors: []
//     }
//   };
  
//   // Idealista (GRATIS - siempre activo)
//   try {
//     console.log('[MultiPortal] Fetching Idealista properties...');
//     const idealistaProperties = await fetchIdealistaProperties(searchParams);
//     const normalizedIdealista = idealistaProperties.map(prop => normalizeProperty(prop, 'Idealista'));
    
//     results.properties.push(...normalizedIdealista);
//     results.stats.bySource.Idealista = normalizedIdealista.length;
//     console.log(`[MultiPortal] ✅ Idealista: ${normalizedIdealista.length} properties`);
//   } catch (error) {
//     console.error('[MultiPortal] ❌ Error fetching Idealista:', error);
//     results.stats.errors.push({ source: 'Idealista', error: error.message });
//   }
  
//   // Fotocasa ($30/mes - si está activo)
//   if (PORTAL_ACTORS.fotocasa.active) {
//     try {
//       console.log('[MultiPortal] Fetching Fotocasa properties...');
//       const fotocasaProperties = await fetchFotocasaProperties(searchParams);
//       const normalizedFotocasa = fotocasaProperties.map(prop => normalizeProperty(prop, 'Fotocasa'));
      
//       results.properties.push(...normalizedFotocasa);
//       results.stats.bySource.Fotocasa = normalizedFotocasa.length;
//       console.log(`[MultiPortal] ✅ Fotocasa: ${normalizedFotocasa.length} properties`);
//     } catch (error) {
//       console.error('[MultiPortal] ❌ Error fetching Fotocasa:', error);
//       results.stats.errors.push({ source: 'Fotocasa', error: error.message });
//     }
//   } else {
//     console.log('[MultiPortal] ⏸️ Fotocasa actor is disabled');
//   }
  
//   // TODO: Implementar Habitaclia y Pisos.com con scrapers custom
  
//   results.stats.total = results.properties.length;
  
//   console.log(`[MultiPortal] 🎉 Total properties from all portals: ${results.stats.total}`);
//   console.log(`[MultiPortal] 📊 By source:`, results.stats.bySource);
  
//   return results;
// }

console.warn('⚠️ MultiPortalService desactivado - Usando RapidAPI Madrid Service');

// Funciones mock para compatibilidad
export async function fetchIdealistaProperties(searchParams) {
  console.warn('fetchIdealistaProperties: Función desactivada, usar rapidApiMadridService');
  return [];
}

export async function fetchFotocasaProperties(searchParams) {
  console.warn('fetchFotocasaProperties: Función desactivada, usar rapidApiMadridService');
  return [];
}

export async function fetchAllPortalsProperties(searchParams) {
  console.warn('fetchAllPortalsProperties: Función desactivada, usar rapidApiMadridService');
  return { properties: [], stats: { total: 0, bySource: {}, errors: [] } };
}

/**
 * Activa/desactiva portales específicos
 */
export function setPortalStatus(portal, active) {
  if (PORTAL_ACTORS[portal]) {
    PORTAL_ACTORS[portal].active = active;
    console.log(`[MultiPortal] ${portal} ${active ? 'activated' : 'deactivated'}`);
    return true;
  }
  return false;
}

/**
 * Obtiene el estado de todos los portales
 */
export function getPortalsStatus() {
  return Object.keys(PORTAL_ACTORS).map(portal => ({
    name: portal,
    active: PORTAL_ACTORS[portal].active !== false,
    type: PORTAL_ACTORS[portal].type,
    cost: PORTAL_ACTORS[portal].type === 'rental' ? 'Paid' : 'Free'
  }));
} 