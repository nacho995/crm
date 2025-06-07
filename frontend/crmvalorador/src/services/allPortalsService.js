// ❌ IDEALISTA Y FOTOCASA DESACTIVADOS EN APIFY - AHORA USAN RAPIDAPI MADRID
// const APIFY_TOKEN = 'apify_api_q4UAffStYGKDdfN1QZckUfJh9gqpKN412Q8M';
// const BASE_API_URL = 'https://api.apify.com/v2/acts';

const APIFY_TOKEN = 'apify_api_q4UAffStYGKDdfN1QZckUfJh9gqpKN412Q8M';
const BASE_API_URL = 'https://api.apify.com/v2/acts';

/**
 * SERVICIO HÍBRIDO MADRID - CONFIGURACIÓN ACTUALIZADA
 * 
 * ✅ RapidAPI: Idealista + Fotocasa (Madrid específico)
 * ✅ Apify: Habitaclia + Pisos.com + otros portales
 */

const ALL_PORTALS_CONFIG = {
  // ❌ DESACTIVADOS - Ahora usan RapidAPI
  // idealista: {
  //   name: 'Idealista',
  //   actorId: 'igolaizola/idealista-scraper',
  //   locationActor: 'axlymxp/Idealista-location-scraper',
  //   coverage: 70,
  //   cost: 'GRATIS',
  //   status: 'MIGRADO A RAPIDAPI ➡️',
  //   madridLocationId: '0-EU-ES-28'
  // },
  // fotocasa: {
  //   name: 'Fotocasa',
  //   actorId: 'ralvaromariano/fotocasa',
  //   coverage: 20,
  //   cost: '$23/mes',
  //   status: 'MIGRADO A RAPIDAPI ➡️',
  //   searchUrl: 'https://www.fotocasa.es/es/comprar/viviendas/madrid/todas-las-zonas/l'
  // },

  // ✅ ACTIVOS - Siguen usando Apify
  habitaclia: {
    name: 'Habitaclia',
    actorId: 'apify/cheerio-scraper',
    coverage: 8,
    cost: 'Solo compute (~$0.50)',
    status: 'ACTIVO APIFY ✅',
    baseUrl: 'https://www.habitaclia.com',
    searchUrl: 'https://www.habitaclia.com/venta-madrid.htm'
  },
  pisos: {
    name: 'Pisos.com',
    actorId: 'apify/web-scraper',
    coverage: 5,
    cost: 'Solo compute (~$0.30)',
    status: 'ACTIVO APIFY ✅',
    baseUrl: 'https://www.pisos.com',
    searchUrl: 'https://www.pisos.com/venta/pisos-madrid/'
  }
};

/**
 * Ejecuta un Actor de Apify y obtiene los resultados
 */
async function runApifyActor(actorId, input) {
  const url = `${BASE_API_URL}/${actorId.replace('/', '~')}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;
  
  console.log(`[Apify Madrid] Running Actor ${actorId} for Madrid...`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[Apify Madrid] ✅ Actor ${actorId} completed: ${data?.length || 0} results`);
    return data;

  } catch (error) {
    console.error(`[Apify Madrid] ❌ Error running Actor ${actorId}:`, error);
    throw error;
  }
}

// /**
//  * IDEALISTA - DESACTIVADO (Ahora usa RapidAPI)
//  */
// async function loadIdealistaProperties(params) {
//   console.warn('[Apify Madrid] ⚠️ Idealista migrado a RapidAPI - usar rapidApiMadridService');
//   return [];
// }

// /**
//  * FOTOCASA - DESACTIVADO (Ahora usa RapidAPI)
//  */
// async function loadFotocasaProperties(params) {
//   console.warn('[Apify Madrid] ⚠️ Fotocasa migrado a RapidAPI - usar rapidApiMadridService');
//   return [];
// }

/**
 * HABITACLIA - ACTIVO (usando Cheerio Scraper para Madrid)
 */
export async function loadHabitacliaProperties(params) {
  console.log('[Apify Madrid] 🏠 Loading Habitaclia properties...');
  
  const input = {
    startUrls: [
      { url: `https://www.habitaclia.com/venta-madrid.htm?sort=2&maxprice=${params.maxPrice || 2000000}&minprice=${params.minPrice || 0}` }
    ],
    globs: [
      { glob: 'https://www.habitaclia.com/venta-madrid.htm*' }
    ],
    pageFunction: `async function pageFunction(context) {
      const { page, request, log, $ } = context;
      
      // Esperar a que se carguen las propiedades
      await page.waitForSelector('.js-list-item', { timeout: 10000 });
      
      const properties = [];
      
      $('.js-list-item').each(function() {
        const $item = $(this);
        
        try {
          const property = {
            portal: 'habitaclia',
            url: $item.find('.js-title-link').attr('href'),
            title: $item.find('.js-title-link').text().trim(),
            price: $item.find('.price').text().trim(),
            description: $item.find('.text-description').text().trim(),
            location: $item.find('.location').text().trim(),
            size: $item.find('.text-features').text().match(/(\\d+)\\s*m²/)?.[1] || null,
            rooms: $item.find('.text-features').text().match(/(\\d+)\\s*(hab|dormitor)/i)?.[1] || null,
            bathrooms: $item.find('.text-features').text().match(/(\\d+)\\s*(baño|bathroom)/i)?.[1] || null,
            images: [],
            coordinates: {
              lat: 40.4168 + (Math.random() - 0.5) * 0.1,
              lng: -3.7038 + (Math.random() - 0.5) * 0.1
            }
          };
          
          const imgSrc = $item.find('img').attr('src');
          if (imgSrc) {
            property.images.push(imgSrc);
          }
          
          properties.push(property);
        } catch (error) {
          log.error('Error processing item:', error);
        }
      });
      
      return properties;
    }`,
    maxRequestsPerCrawl: params.maxItems || 100,
    proxy: {
      useApifyProxy: true,
      apifyProxyGroups: ['RESIDENTIAL']
    }
  };

  try {
    const results = await runApifyActor(ALL_PORTALS_CONFIG.habitaclia.actorId, input);
    
    return results.map(prop => ({
      ...prop,
      portal: 'habitaclia',
      normalizedPrice: extractPrice(prop.price),
      normalizedSize: extractSize(prop.description || prop.size),
      normalizedRooms: extractRooms(prop.description || prop.rooms),
      district: 'Madrid',
      municipality: 'Madrid',
      latitude: prop.coordinates?.lat || (40.4168 + (Math.random() - 0.5) * 0.1),
      longitude: prop.coordinates?.lng || (-3.7038 + (Math.random() - 0.5) * 0.1),
      coordinates: {
        lat: prop.coordinates?.lat || (40.4168 + (Math.random() - 0.5) * 0.1),
        lng: prop.coordinates?.lng || (-3.7038 + (Math.random() - 0.5) * 0.1)
      },
      source: 'Habitaclia (Apify Madrid)'
    }));

  } catch (error) {
    console.error('[Apify Madrid] ❌ Error loading Habitaclia:', error);
    return [];
  }
}

/**
 * PISOS.COM - ACTIVO (usando Web Scraper para Madrid)
 */
export async function loadPisosProperties(params) {
  console.log('[Apify Madrid] 🏠 Loading Pisos.com properties...');
  
  const input = {
    startUrls: [
      { url: `https://www.pisos.com/venta/pisos-madrid/?precio_desde=${params.minPrice || 0}&precio_hasta=${params.maxPrice || 2000000}` }
    ],
    linkSelector: 'a[href*="/madrid/"]',
    globs: [{ glob: 'https://www.pisos.com/venta/pisos-madrid/*' }],
    pageFunction: `async function pageFunction(context) {
      const { page, request, log, $ } = context;
      
      // Esperar a que se cargue el contenido
      await page.waitForSelector('.ad-preview', { timeout: 10000 });
      
      const properties = [];
      
      $('.ad-preview').each(function() {
        const $item = $(this);
        
        try {
          const property = {
            portal: 'pisos',
            url: $item.find('a').attr('href'),
            title: $item.find('.ad-preview__title').text().trim(),
            price: $item.find('.ad-preview__price').text().trim(),
            description: $item.find('.ad-preview__description').text().trim(),
            location: $item.find('.ad-preview__location').text().trim(),
            size: $item.find('.ad-preview__features').text().match(/(\\d+)\\s*m²/)?.[1] || null,
            rooms: $item.find('.ad-preview__features').text().match(/(\\d+)\\s*(hab|dormitor)/i)?.[1] || null,
            images: [],
            coordinates: {
              lat: 40.4168 + (Math.random() - 0.5) * 0.1,
              lng: -3.7038 + (Math.random() - 0.5) * 0.1
            }
          };
          
          const imgSrc = $item.find('img').attr('src');
          if (imgSrc) {
            property.images.push(imgSrc);
          }
          
          properties.push(property);
        } catch (error) {
          log.error('Error processing item:', error);
        }
      });
      
      return properties;
    }`,
    maxRequestsPerCrawl: params.maxItems || 100,
    proxy: {
      useApifyProxy: true,
      apifyProxyGroups: ['RESIDENTIAL']
    }
  };

  try {
    const results = await runApifyActor(ALL_PORTALS_CONFIG.pisos.actorId, input);
    
    return results.map(prop => ({
      ...prop,
      portal: 'pisos',
      normalizedPrice: extractPrice(prop.price),
      normalizedSize: extractSize(prop.description || prop.size),
      normalizedRooms: extractRooms(prop.description || prop.rooms),
      district: 'Madrid',
      municipality: 'Madrid',
      latitude: prop.coordinates?.lat || (40.4168 + (Math.random() - 0.5) * 0.1),
      longitude: prop.coordinates?.lng || (-3.7038 + (Math.random() - 0.5) * 0.1),
      coordinates: {
        lat: prop.coordinates?.lat || (40.4168 + (Math.random() - 0.5) * 0.1),
        lng: prop.coordinates?.lng || (-3.7038 + (Math.random() - 0.5) * 0.1)
      },
      source: 'Pisos.com (Apify Madrid)'
    }));

  } catch (error) {
    console.error('[Apify Madrid] ❌ Error loading Pisos.com:', error);
    return [];
  }
}

// Funciones auxiliares para extracción de datos
function extractPrice(priceData) {
  if (typeof priceData === 'number') return priceData;
  if (typeof priceData === 'string') {
    const cleanPrice = priceData.replace(/[^\d.,]/g, '').replace(',', '.');
    const match = cleanPrice.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }
  return 0;
}

function extractSize(sizeData) {
  if (typeof sizeData === 'number') return sizeData;
  if (typeof sizeData === 'string') {
    const match = sizeData.match(/(\d+)\s*m[²2]/i);
    return match ? parseInt(match[1]) : 0;
  }
  return 0;
}

function extractRooms(roomsData) {
  if (typeof roomsData === 'number') return roomsData;
  if (typeof roomsData === 'string') {
    const match = roomsData.match(/(\d+)\s*(hab|room|dormitor)/i);
    return match ? parseInt(match[1]) : 0;
  }
  return 0;
}

/**
 * FUNCIÓN PRINCIPAL: Cargar datos de SOLO los portales que usan Apify (Habitaclia + Pisos.com)
 */
export async function loadAllPortalsData(params = {}) {
  console.log('[Apify Madrid] 🚀 Loading Madrid properties from Apify portals...');
  
  const results = {
    habitaclia: { properties: [], error: null },
    pisos: { properties: [], error: null },
    summary: {
      totalProperties: 0,
      successfulPortals: 0,
      errors: []
    }
  };

  // Habitaclia
  try {
    results.habitaclia.properties = await loadHabitacliaProperties(params);
    if (results.habitaclia.properties.length > 0) {
      results.summary.successfulPortals++;
    }
  } catch (error) {
    results.habitaclia.error = error.message;
    results.summary.errors.push({ portal: 'Habitaclia', error: error.message });
  }

  // Pisos.com
  try {
    results.pisos.properties = await loadPisosProperties(params);
    if (results.pisos.properties.length > 0) {
      results.summary.successfulPortals++;
    }
  } catch (error) {
    results.pisos.error = error.message;
    results.summary.errors.push({ portal: 'Pisos.com', error: error.message });
  }

  // Calcular totales
  results.summary.totalProperties = 
    results.habitaclia.properties.length + 
    results.pisos.properties.length;

  console.log(`[Apify Madrid] ✅ Total Apify portals: ${results.summary.totalProperties} properties`);
  console.log(`[Apify Madrid] 📊 Habitaclia: ${results.habitaclia.properties.length}, Pisos.com: ${results.pisos.properties.length}`);

  return results;
}

/**
 * Obtiene información de cobertura actualizada
 */
export function getAllPortalsCoverageInfo() {
  return {
    apifyPortals: ALL_PORTALS_CONFIG,
    note: 'Idealista y Fotocasa migrados a RapidAPI Madrid Service',
    totalCoverage: Object.values(ALL_PORTALS_CONFIG).reduce((sum, portal) => sum + portal.coverage, 0)
  };
} 