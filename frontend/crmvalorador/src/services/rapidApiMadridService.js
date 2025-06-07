/**
 * 🏠 CRM GoZaMadrid - Servicio Apify Madrid
 * Solo usa Apify para todos los portales inmobiliarios
 * 
 * Portales soportados:
 * - Idealista (Apify)
 * - Fotocasa (Apify) 
 * - Habitaclia (Apify)
 * - Pisos.com (Apify)
 * 
 * Cobertura: Madrid capital (21 distritos) + 26 municipios alrededores
 */

// 🔧 Configuración del Backend
const BACKEND_BASE_URL = 'http://localhost:3001';

// 📍 Distritos de Madrid incluidos
export const MADRID_AREAS = {
  capital: {
    name: 'Madrid Capital',
    districts: [
      'Centro', 'Arganzuela', 'Retiro', 'Salamanca', 'Chamartín', 'Tetuán',
      'Chamberí', 'Fuencarral-El Pardo', 'Moncloa-Aravaca', 'Latina',
      'Carabanchel', 'Usera', 'Puente de Vallecas', 'Moratalaz', 'Ciudad Lineal',
      'Hortaleza', 'Villaverde', 'Villa de Vallecas', 'Vicálvaro', 'San Blas-Canillejas', 'Barajas'
    ]
  },
  alrededores: {
    name: 'Alrededores de Madrid',
    municipalities: [
      'Alcalá de Henares', 'Alcobendas', 'Alcorcón', 'Aranjuez', 'Arganda del Rey',
      'Boadilla del Monte', 'Collado Villalba', 'Coslada', 'Fuenlabrada', 'Getafe',
      'Leganés', 'Majadahonda', 'Móstoles', 'Parla', 'Pinto', 'Pozuelo de Alarcón',
      'Rivas-Vaciamadrid', 'Rozas de Madrid (Las)', 'San Fernando de Henares',
      'San Sebastián de los Reyes', 'Torrejón de Ardoz', 'Torrelodones', 'Tres Cantos',
      'Valdemoro', 'Villanueva de la Cañada', 'Villanueva del Pardillo'
    ]
  }
};

// 🤖 Portales Apify configurados
export const APIFY_PORTALS = {
  idealista: {
    name: 'Idealista',
    endpoint: '/api/idealista',
    description: 'Portal líder en España con más de 1M+ propiedades'
  },
  fotocasa: {
    name: 'Fotocasa',
    endpoint: '/api/fotocasa',
    description: 'Portal especializado en propiedades con excelentes fotos'
  },
  habitaclia: {
    name: 'Habitaclia',
    endpoint: '/api/habitaclia',
    description: 'Portal de referencia en Cataluña con presencia nacional'
  },
  pisos: {
    name: 'Pisos.com',
    endpoint: '/api/pisos',
    description: 'Uno de los portales más antiguos y completos de España'
  }
};

// 🌐 Función helper para llamar al backend
async function callBackendAPI(endpoint, params = {}) {
  try {
    const url = new URL(`${BACKEND_BASE_URL}${endpoint}`);
    
    // Agregar parámetros de query
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        url.searchParams.append(key, params[key]);
      }
    });

    console.log(`🌐 [Frontend] Calling backend: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ [Frontend] Backend response:`, { 
      endpoint, 
      success: data.success, 
      count: data.count || data.stats?.total || 0 
    });

    return data;

  } catch (error) {
    console.error(`❌ [Frontend] Error calling backend ${endpoint}:`, error);
    throw error;
  }
}

// 🔍 Verificar si el backend está disponible
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ [Frontend] Backend health check OK:', data.name);
      return { healthy: true, data };
    } else {
      throw new Error(`Backend unhealthy: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ [Frontend] Backend health check failed:', error);
    return { healthy: false, error: error.message };
  }
}

// 🏠 Obtener propiedades de Idealista (Apify)
export async function getIdealistaProperties(params = {}) {
  try {
    console.log('🏠 [Frontend] Fetching Idealista properties via Apify...');
    
    const queryParams = {
      maxItems: params.maxItems || 100,
      operation: params.operation || 'sale',
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 0
    };

    const data = await callBackendAPI('/api/idealista', queryParams);

    if (data.success && data.properties) {
      console.log(`✅ [Frontend] Idealista Apify: ${data.count} propiedades obtenidas`);
      return {
        success: true,
        properties: data.properties,
        count: data.count,
        portal: 'Idealista',
        source: 'Apify Madrid',
        coverage: 'Madrid Capital + Alrededores'
      };
    } else {
      throw new Error(data.error || 'No se obtuvieron propiedades de Idealista');
    }

  } catch (error) {
    console.error('❌ [Frontend] Error Idealista Apify:', error);
    return {
      success: false,
      properties: [],
      count: 0,
      error: error.message,
      portal: 'Idealista',
      source: 'Apify Madrid'
    };
  }
}

// 🏠 Obtener propiedades de Fotocasa (Apify)
export async function getFotocasaProperties(params = {}) {
  try {
    console.log('🏠 [Frontend] Fetching Fotocasa properties via Apify...');
    
    const queryParams = {
      maxItems: params.maxItems || 100,
      operation: params.operation || 'sale'
    };

    const data = await callBackendAPI('/api/fotocasa', queryParams);

    if (data.success && data.properties) {
      console.log(`✅ [Frontend] Fotocasa Apify: ${data.count} propiedades obtenidas`);
      return {
        success: true,
        properties: data.properties,
        count: data.count,
        portal: 'Fotocasa',
        source: 'Apify Madrid',
        coverage: 'Madrid Capital + Alrededores'
      };
    } else {
      throw new Error(data.error || 'No se obtuvieron propiedades de Fotocasa');
    }

  } catch (error) {
    console.error('❌ [Frontend] Error Fotocasa Apify:', error);
    return {
      success: false,
      properties: [],
      count: 0,
      error: error.message,
      portal: 'Fotocasa',
      source: 'Apify Madrid'
    };
  }
}

// 🏠 Obtener propiedades de Habitaclia (Apify)
export async function getHabitacliaProperties(params = {}) {
  try {
    console.log('🏠 [Frontend] Fetching Habitaclia properties via Apify...');
    
    const queryParams = {
      maxItems: params.maxItems || 100,
      operation: params.operation || 'sale'
    };

    const data = await callBackendAPI('/api/habitaclia', queryParams);

    if (data.success && data.properties) {
      console.log(`✅ [Frontend] Habitaclia Apify: ${data.count} propiedades obtenidas`);
      return {
        success: true,
        properties: data.properties,
        count: data.count,
        portal: 'Habitaclia',
        source: 'Apify Madrid',
        coverage: 'Madrid Capital + Alrededores'
      };
    } else {
      throw new Error(data.error || 'No se obtuvieron propiedades de Habitaclia');
    }

  } catch (error) {
    console.error('❌ [Frontend] Error Habitaclia Apify:', error);
    return {
      success: false,
      properties: [],
      count: 0,
      error: error.message,
      portal: 'Habitaclia',
      source: 'Apify Madrid'
    };
  }
}

// 🏠 Obtener propiedades de Pisos.com (Apify)
export async function getPisosProperties(params = {}) {
  try {
    console.log('🏠 [Frontend] Fetching Pisos.com properties via Apify...');
    
    const queryParams = {
      maxItems: params.maxItems || 100,
      operation: params.operation || 'sale'
    };

    const data = await callBackendAPI('/api/pisos', queryParams);

    if (data.success && data.properties) {
      console.log(`✅ [Frontend] Pisos.com Apify: ${data.count} propiedades obtenidas`);
      return {
        success: true,
        properties: data.properties,
        count: data.count,
        portal: 'Pisos.com',
        source: 'Apify Madrid',
        coverage: 'Madrid Capital + Alrededores'
      };
    } else {
      throw new Error(data.error || 'No se obtuvieron propiedades de Pisos.com');
    }

  } catch (error) {
    console.error('❌ [Frontend] Error Pisos.com Apify:', error);
    return {
      success: false,
      properties: [],
      count: 0,
      error: error.message,
      portal: 'Pisos.com',
      source: 'Apify Madrid'
    };
  }
}

// 🎯 FUNCIÓN PRINCIPAL - Obtener TODAS las propiedades de Madrid (Solo Apify)
export async function getAllMadridProperties(params = {}) {
  try {
    console.log('🚀 [Frontend] Fetching ALL Madrid properties (Solo Apify)...');
    console.log('📊 [Frontend] Params:', params);

    // Verificar salud del backend
    const healthCheck = await checkBackendHealth();
    if (!healthCheck.healthy) {
      throw new Error(`Backend no disponible: ${healthCheck.error}`);
    }

    const queryParams = {
      maxItems: params.maxItems || 200,
      operation: params.operation || 'sale',
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 0
    };

    const data = await callBackendAPI('/api/all-madrid', queryParams);

    if (data.success !== false && data.properties) {
      const result = {
        success: true,
        properties: data.properties || [],
        stats: {
          total: data.stats?.total || data.properties?.length || 0,
          bySource: data.stats?.bySource || {},
          errors: data.stats?.errors || []
        },
        madrid: data.madrid || {
          capital: data.properties?.length || 0,
          alrededores: 0,
          districts: {}
        },
        coverage: {
          districts: MADRID_AREAS.capital.districts.length,
          municipalities: MADRID_AREAS.alrededores.municipalities.length,
          areas: Object.keys(MADRID_AREAS)
        },
        portals: Object.keys(APIFY_PORTALS),
        technology: 'Solo Apify - Datos reales de 4 portales',
        timestamp: data.timestamp || new Date().toISOString(),
        note: data.note
      };

      console.log(`🎉 [Frontend] Total Madrid properties: ${result.stats.total}`);
      console.log(`📊 [Frontend] By source:`, result.stats.bySource);
      console.log(`🤖 [Frontend] Portals used:`, result.portals);

      return result;

    } else {
      throw new Error(data.error || 'No se obtuvieron propiedades del backend');
    }

  } catch (error) {
    console.error('❌ [Frontend] Error getting all Madrid properties:', error);
    
    // Retornar error sin fallback mock
    return {
      success: false,
      properties: [],
      stats: {
        total: 0,
        bySource: {},
        errors: [{ source: 'Frontend', error: error.message }]
      },
      madrid: { capital: 0, alrededores: 0, districts: {} },
      coverage: {
        districts: MADRID_AREAS.capital.districts.length,
        municipalities: MADRID_AREAS.alrededores.municipalities.length,
        areas: Object.keys(MADRID_AREAS)
      },
      portals: Object.keys(APIFY_PORTALS),
      technology: 'Solo Apify',
      timestamp: new Date().toISOString(),
      note: '❌ Error obteniendo propiedades. Verifica la conexión al backend.',
      error: error.message
    };
  }
}

// 📊 Función de utilidad para obtener estadísticas
export function getPortalStats() {
  return {
    portals: APIFY_PORTALS,
    areas: MADRID_AREAS,
    technology: 'Solo Apify',
    advantages: [
      '🚀 Miles de propiedades vs 40 de RapidAPI',
      '🎯 4 portales principales de España',
      '📍 Cobertura completa Madrid + alrededores',
      '🔄 Scrapers actualizados automáticamente',
      '💰 Más económico que múltiples APIs premium'
    ],
    coverage: {
      districts: MADRID_AREAS.capital.districts.length,
      municipalities: MADRID_AREAS.alrededores.municipalities.length,
      totalAreas: MADRID_AREAS.capital.districts.length + MADRID_AREAS.alrededores.municipalities.length
    }
  };
}

// 🎯 Función para obtener propiedades por portal específico
export async function getPropertiesByPortal(portal, params = {}) {
  const portalFunctions = {
    idealista: getIdealistaProperties,
    fotocasa: getFotocasaProperties,
    habitaclia: getHabitacliaProperties,
    pisos: getPisosProperties
  };

  const portalFunction = portalFunctions[portal.toLowerCase()];
  
  if (!portalFunction) {
    throw new Error(`Portal "${portal}" no soportado. Portales disponibles: ${Object.keys(portalFunctions).join(', ')}`);
  }

  return await portalFunction(params);
}

// 🔄 Export default para compatibilidad
export default {
  getAllMadridProperties,
  getIdealistaProperties,
  getFotocasaProperties,
  getHabitacliaProperties,
  getPisosProperties,
  getPropertiesByPortal,
  checkBackendHealth,
  getPortalStats,
  MADRID_AREAS,
  APIFY_PORTALS
}; 