const APIFY_TOKEN = 'apify_api_q4UAffStYGKDdfN1QZckUfJh9gqpKN412Q8M';
const BASE_API_URL = 'https://api.apify.com/v2/acts';

/**
 * ACTORS ESPECÍFICOS POR PORTAL (Todos permiten CORS)
 */
const PORTAL_ACTORS = {
  idealista: {
    name: 'Idealista',
    active: true,
    actorId: 'igolaizola/idealista-scraper',
    locationActor: 'axlymxp/Idealista-location-scraper',
    coverage: '70% del mercado español',
    cost: 'GRATIS (pay per usage)',
    type: 'specific'
  },
  fotocasa: {
    name: 'Fotocasa',
    active: true,
    actorId: 'ralvaromariano/fotocasa', // ✅ Actor específico encontrado
    coverage: '20% del mercado español',
    cost: '$20/mes + usage',
    type: 'specific'
  },
  fotocasa_search: {
    name: 'Fotocasa (Search URL)',
    active: true,
    actorId: 'azzouzana/fotocasa-es-search-results-scraper-by-search-url', // ✅ Actor alternativo
    coverage: '20% del mercado español',
    cost: '$30/mes + usage',
    type: 'search_url'
  }
  // TODO: Buscar actors para Habitaclia y Pisos.com
};

/**
 * Ejecuta un actor específico de Apify
 */
async function runSpecificActor(actorId, input) {
  const url = `${BASE_API_URL}/${actorId.replace('/', '~')}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;
  
  console.log(`[CustomScraper] Running Actor ${actorId} with input:`, input);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Actor ${actorId} execution failed: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    console.log(`[CustomScraper] ✅ Actor ${actorId} completed: ${data?.length || 0} results`);
    return data;
  } catch (error) {
    console.error(`[CustomScraper] ❌ Error running Actor ${actorId}:`, error);
    throw error;
  }
}

/**
 * Obtiene propiedades de Idealista usando el actor específico
 */
async function fetchIdealistaProperties(searchParams = {}) {
  const { fetchLocationId, fetchProperties } = await import('./apifyService');
  
  let locationId = searchParams.locationId;
  if (!locationId) {
    locationId = await fetchLocationId(searchParams.locationQuery || 'Madrid');
  }
  
  if (!locationId) {
    throw new Error('No se pudo obtener el locationId para Idealista');
  }
  
  const properties = await fetchProperties({
    locationId,
    minPrice: searchParams.minPrice || 0,
    maxItems: searchParams.maxItems || 250,
    propertyType: searchParams.propertyType || 'homes',
    operation: 'sale',
    country: 'es'
  });
  
  return properties.map(prop => ({
    ...prop,
    source: 'Idealista',
    portalType: 'free',
    scrapedAt: new Date().toISOString()
  }));
}

/**
 * Obtiene propiedades de Fotocasa usando actor específico
 */
export async function scrapeFotocasaFree(searchParams = {}) {
  const location = searchParams.locationQuery || 'madrid';
  const pages = Math.min(Math.ceil((searchParams.maxItems || 100) / 20), 10); // ~20 props por página
  
  const input = {
    location: location,
    pages: pages
  };

  try {
    const results = await runSpecificActor(PORTAL_ACTORS.fotocasa.actorId, input);
    
    return results.map(prop => ({
      id: `fotocasa-${prop.id || Date.now()}`,
      url: prop.url,
      title: prop.title || prop.name,
      price: extractPrice(prop.price),
      address: prop.address || prop.location,
      size: extractSize(prop.description || ''),
      rooms: extractRooms(prop.description || ''),
      images: prop.images || [],
      description: prop.description,
      source: 'Fotocasa',
      portalType: 'paid',
      scrapedAt: new Date().toISOString(),
      // Mapear coordenadas si están disponibles
      latitude: prop.coordinates?.lat || prop.latitude,
      longitude: prop.coordinates?.lng || prop.longitude
    })).filter(prop => prop.title && prop.price > 0);
    
  } catch (error) {
    console.error('[CustomScraper] Error scraping Fotocasa:', error);
    return [];
  }
}

/**
 * Obtiene propiedades de Fotocasa usando search URL actor
 */
export async function scrapeFotocasaSearchFree(searchParams = {}) {
  const location = searchParams.locationQuery || 'madrid';
  const maxPrice = searchParams.maxPrice;
  const minPrice = searchParams.minPrice;
  
  // Construir URL de búsqueda de Fotocasa
  let searchUrl = `https://www.fotocasa.es/es/alquiler/viviendas/${location}/todas-las-zonas/l`;
  const params = new URLSearchParams();
  
  if (maxPrice) params.append('maxPrice', Math.floor(maxPrice / 1000));
  if (minPrice) params.append('minPrice', Math.floor(minPrice / 1000));
  
  if (params.toString()) {
    searchUrl += `?${params.toString()}`;
  }

  const input = {
    startUrl: searchUrl,
    maxItems: searchParams.maxItems || 100,
    proxy: {
      useApifyProxy: true,
      apifyProxyGroups: ['RESIDENTIAL']
    }
  };

  try {
    const results = await runSpecificActor(PORTAL_ACTORS.fotocasa_search.actorId, input);
    
    return results.map(prop => ({
      id: `fotocasa-search-${prop.id || Date.now()}`,
      url: prop.url,
      title: prop.title,
      price: extractPrice(prop.price),
      address: prop.address,
      size: extractSize(prop.features || ''),
      rooms: extractRooms(prop.features || ''),
      images: prop.images || [],
      description: prop.description,
      source: 'Fotocasa',
      portalType: 'paid',
      scrapedAt: new Date().toISOString()
    })).filter(prop => prop.title && prop.price > 0);
    
  } catch (error) {
    console.error('[CustomScraper] Error scraping Fotocasa (Search):', error);
    return [];
  }
}

/**
 * Funciones auxiliares para extraer datos
 */
function extractPrice(priceText) {
  if (!priceText) return 0;
  const match = priceText.toString().replace(/[^\d]/g, '');
  return match ? parseInt(match) : 0;
}

function extractSize(text) {
  if (!text) return 0;
  const match = text.match(/(\d+)\s*m²/i);
  return match ? parseInt(match[1]) : 0;
}

function extractRooms(text) {
  if (!text) return 0;
  const match = text.match(/(\d+)\s*(hab|room|dormitorio)/i);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Placeholder para otros portales (pendientes de encontrar actors)
 */
export async function scrapeHabitacliaFree(searchParams = {}) {
  console.log('[CustomScraper] ⚠️ Habitaclia: Buscando actor específico compatible con CORS...');
  // TODO: Implementar cuando encontremos actor específico
  return [];
}

export async function scrapePisosComFree(searchParams = {}) {
  console.log('[CustomScraper] ⚠️ Pisos.com: Buscando actor específico compatible con CORS...');
  // TODO: Implementar cuando encontremos actor específico
  return [];
}

/**
 * FUNCIÓN PRINCIPAL: Obtiene propiedades de TODOS los portales disponibles
 */
export async function scrapeAllPortalsFree(searchParams = {}) {
  const results = {
    properties: [],
    stats: {
      total: 0,
      bySource: {},
      errors: [],
      available: Object.keys(PORTAL_ACTORS),
      active: Object.values(PORTAL_ACTORS).filter(p => p.active).map(p => p.name)
    }
  };

  console.log('[CustomScraper] 🚀 Iniciando scraping de TODOS los portales disponibles...');
  console.log('[CustomScraper] 📊 Portales activos:', results.stats.active);

  // Array de scrapers para ejecutar en paralelo
  const scrapers = [
    { 
      name: 'Idealista', 
      fn: () => fetchIdealistaProperties(searchParams),
      active: PORTAL_ACTORS.idealista.active 
    },
    { 
      name: 'Fotocasa', 
      fn: () => scrapeFotocasaFree(searchParams),
      active: PORTAL_ACTORS.fotocasa.active 
    }
    // TODO: Agregar Habitaclia y Pisos.com cuando encontremos actors
  ];

  // Ejecutar scrapers activos en paralelo
  const promises = scrapers
    .filter(scraper => scraper.active)
    .map(async (scraper) => {
      try {
        console.log(`[CustomScraper] 🔄 Scraping ${scraper.name}...`);
        const properties = await scraper.fn();
        
        results.stats.bySource[scraper.name] = properties.length;
        console.log(`[CustomScraper] ✅ ${scraper.name}: ${properties.length} propiedades`);
        
        return properties;
      } catch (error) {
        console.error(`[CustomScraper] ❌ Error en ${scraper.name}:`, error);
        results.stats.errors.push({ source: scraper.name, error: error.message });
        return [];
      }
    });

  // Esperar a que terminen todos
  const allResults = await Promise.all(promises);
  
  // Combinar todos los resultados
  results.properties = allResults.flat();
  results.stats.total = results.properties.length;

  console.log(`[CustomScraper] 🎉 COMPLETADO! Total: ${results.stats.total} propiedades`);
  console.log(`[CustomScraper] 📊 Por fuente:`, results.stats.bySource);

  return results;
}

/**
 * Obtiene información sobre portales disponibles
 */
export function getPortalsInfo() {
  return {
    available: PORTAL_ACTORS,
    ready: Object.values(PORTAL_ACTORS).filter(p => p.active),
    pending: [
      { name: 'Habitaclia', status: 'Buscando actor específico' },
      { name: 'Pisos.com', status: 'Buscando actor específico' }
    ],
    note: 'Usando actors específicos de cada portal que permiten CORS desde navegadores.'
  };
} 