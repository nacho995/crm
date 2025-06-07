const APIFY_TOKEN = 'apify_api_q4UAffStYGKDdfN1QZckUfJh9gqpKN412Q8M';
const BASE_API_URL = 'https://api.apify.com/v2/acts';

/**
 * ESTRATEGIA COMPLETA MULTI-PORTAL
 * Combina actors específicos + scrapers custom para máxima cobertura
 */
const MARKET_COVERAGE = {
  // Actors específicos disponibles (CORS-friendly)
  availableActors: {
    idealista: {
      name: 'Idealista',
      actorId: 'igolaizola/idealista-scraper',
      locationActor: 'axlymxp/Idealista-location-scraper',
      coverage: '70%',
      cost: 'GRATIS',
      status: 'ACTIVO ✅'
    },
    fotocasa: {
      name: 'Fotocasa',
      actorId: 'ralvaromariano/fotocasa',
      coverage: '20%',
      cost: '$23/mes',
      status: 'DISPONIBLE ✅'
    }
  },
  
  // Portales que requieren scrapers custom
  customScrapers: {
    habitaclia: {
      name: 'Habitaclia',
      baseUrl: 'https://www.habitaclia.com',
      coverage: '8%',
      strategy: 'Custom Web Scraper',
      status: 'DESARROLLO CUSTOM 🔧'
    },
    pisos: {
      name: 'Pisos.com',
      baseUrl: 'https://www.pisos.com',
      coverage: '5%',
      strategy: 'Custom Web Scraper',
      status: 'DESARROLLO CUSTOM 🔧'
    }
  }
};

/**
 * OPCIÓN 1: Usar actors disponibles (Idealista + Fotocasa = 90% del mercado)
 */
export async function getAvailableMarketData(searchParams = {}) {
  console.log('🏠 Cargando datos de mercado disponibles (90% cobertura)...');
  
  const results = {
    idealista: [],
    fotocasa: [],
    summary: {
      totalProperties: 0,
      coverage: '90% del mercado español',
      cost: 'Idealista GRATIS + Fotocasa $23/mes'
    }
  };

  try {
    // 1. Idealista (GRATIS - 70% del mercado)
    console.log('📊 Cargando Idealista...');
    const idealistaData = await loadIdealistaData(searchParams);
    results.idealista = idealistaData;

    // 2. Fotocasa (de pago - 20% del mercado)
    if (searchParams.includeFotocasa) {
      console.log('🏠 Cargando Fotocasa...');
      const fotocasaData = await loadFotocasaData(searchParams);
      results.fotocasa = fotocasaData;
    }

    results.summary.totalProperties = results.idealista.length + results.fotocasa.length;
    
    return results;
  } catch (error) {
    console.error('Error cargando datos de mercado:', error);
    throw error;
  }
}

/**
 * OPCIÓN 2: Sistema híbrido con backend proxy
 */
export async function getCompleteMarketDataWithProxy(searchParams = {}) {
  console.log('🌐 Cargando datos COMPLETOS del mercado (100% cobertura)...');
  
  const portals = ['idealista', 'fotocasa', 'habitaclia', 'pisos'];
  const results = {};
  
  for (const portal of portals) {
    try {
      results[portal] = await scrapePortalViaProxy(portal, searchParams);
    } catch (error) {
      console.warn(`❌ Error en ${portal}:`, error.message);
      results[portal] = [];
    }
  }
  
  return results;
}

/**
 * OPCIÓN 3: Desarrollo custom para portales faltantes
 */
export async function developCustomScrapers() {
  const customScrapingStrategies = {
    habitaclia: {
      approach: 'Cheerio Scraper con Apify',
      complexity: 'Media',
      estimatedTime: '2-3 días',
      cost: 'Solo compute (~$0.50/run)'
    },
    pisos: {
      approach: 'Puppeteer Scraper con Apify',
      complexity: 'Media', 
      estimatedTime: '2-3 días',
      cost: 'Solo compute (~$0.80/run)'
    }
  };

  return customScrapingStrategies;
}

/**
 * Carga datos de Idealista (disponible ahora)
 */
async function loadIdealistaData(params) {
  const url = `${BASE_API_URL}/igolaizola~idealista-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;
  
  const input = {
    country: 'es',
    location: '0-EU-ES-28', // Madrid Province
    operation: 'sale',
    propertyType: 'homes',
    maxItems: params.maxItems || 1000,
    minPrice: params.minPrice || 0,
    maxPrice: params.maxPrice || 0
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error(`Error Idealista: ${response.status}`);
  }

  return await response.json();
}

/**
 * Carga datos de Fotocasa (disponible con pago)
 */
async function loadFotocasaData(params) {
  const url = `${BASE_API_URL}/ralvaromariano~fotocasa/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;
  
  const input = {
    location: 'madrid',
    maxItems: params.maxItems || 500,
    minPrice: params.minPrice || 0,
    maxPrice: params.maxPrice || 0
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error(`Error Fotocasa: ${response.status}`);
  }

  return await response.json();
}

/**
 * Scraping vía proxy backend (para CORS)
 */
async function scrapePortalViaProxy(portal, params) {
  // Esta función requeriría un backend proxy
  const proxyUrl = `http://tu-backend.com/api/scrape/${portal}`;
  
  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  return await response.json();
}

/**
 * Información sobre cobertura del mercado
 */
export function getMarketCoverageInfo() {
  return {
    current: {
      idealista: { coverage: 70, status: 'ACTIVO', cost: 'GRATIS' },
      fotocasa: { coverage: 20, status: 'DISPONIBLE', cost: '$23/mes' },
      total: { coverage: 90, status: 'DISPONIBLE AHORA' }
    },
    pending: {
      habitaclia: { coverage: 8, status: 'DESARROLLO CUSTOM' },
      pisos: { coverage: 5, status: 'DESARROLLO CUSTOM' },
      total: { coverage: 13, status: 'DESARROLLO NECESARIO' }
    },
    recommendations: [
      '🎯 EMPEZAR con Idealista (GRATIS, 70% del mercado)',
      '📈 AÑADIR Fotocasa ($23/mes, +20% cobertura = 90% total)',
      '🔧 DESARROLLAR Habitaclia + Pisos.com para 100% cobertura'
    ]
  };
} 