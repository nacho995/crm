// ❌ APIFY SERVICE DESACTIVADO - REEMPLAZADO POR RAPIDAPI
// const APIFY_TOKEN = 'apify_api_q4UAffStYGKDdfN1QZckUfJh9gqpKN412Q8M'; // Tu API Token de Apify
// const LOCATION_ACTOR_ID = 'axlymxp/Idealista-location-scraper';
// const PROPERTIES_ACTOR_ID = 'igolaizola/idealista-scraper';

// const BASE_API_URL = 'https://api.apify.com/v2/acts';

// /**
//  * Ejecuta un Actor de Apify y espera los items del dataset.
//  * @param {string} actorId - El ID del Actor (ej: usuario/nombre-actor).
//  * @param {object} input - El objeto de input para el Actor.
//  * @returns {Promise<Array<any>>} - Una promesa que resuelve a un array de items del dataset.
//  * @throws {Error} Si la ejecución del Actor falla o la respuesta no es la esperada.
//  */
// async function runActorAndGetDatasetItems(actorId, input) {
//   const url = `${BASE_API_URL}/${actorId.replace('/', '~')}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;
//   console.log(`[ApifyService] Running Actor ${actorId} with input:`, input);

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
//       console.error(`[ApifyService] Error running Actor ${actorId}. Status: ${response.status}`, errorBody);
//       throw new Error(`Apify Actor ${actorId} execution failed with status ${response.status}: ${errorBody}`);
//     }

//     const data = await response.json();
//     console.log(`[ApifyService] Actor ${actorId} finished. Results count:`, data?.length || 0);
//     // La estructura de respuesta de run-sync-get-dataset-items es directamente el array de items.
//     return data;
//   } catch (error) {
//     console.error(`[ApifyService] Exception while running Actor ${actorId}:`, error);
//     throw error; // Re-lanzar el error para que el llamador lo maneje
//   }
// }

// /**
//  * Obtiene el ID de ubicación de Idealista para un prefijo de búsqueda.
//  * Prioriza el ID de provincia si está disponible.
//  * @param {string} locationQuery - El término de búsqueda para la ubicación (ej: "Madrid").
//  * @returns {Promise<string|null>} El ID de la ubicación o null si no se encuentra.
//  */
// export async function fetchLocationId(locationQuery = 'Madrid') {
//   const input = {
//     prefix: locationQuery,
//     country: 'es',
//     propertyType: 'homes', // Generalmente no afecta la búsqueda de ID de ubicación principal
//     operation: 'sale',     // La operación puede influir en los 'totales' pero no en el ID de la ubicación en sí
//   };

//   console.log(`[ApifyService] Fetching location ID for: "${locationQuery}"`);
//   try {
//     const locations = await runActorAndGetDatasetItems(LOCATION_ACTOR_ID, input);

//     if (!locations || locations.length === 0) {
//       console.warn(`[ApifyService] No location found for query: "${locationQuery}"`);
//       return null;
//     }

//     // Priorizar el ID de la provincia si existe uno con el nombre exacto o similar.
//     const provinciaLocation = locations.find(loc => loc.name === locationQuery && loc.subTypeText === 'Provincia');
//     if (provinciaLocation && provinciaLocation.locationId) {
//       console.log(`[ApifyService] Found Provincia Location ID: ${provinciaLocation.locationId} for "${locationQuery}"`);
//       return provinciaLocation.locationId;
//     }

//     // Si no, tomar el primer resultado que sea un municipio con el nombre exacto.
//     const municipioLocation = locations.find(loc => loc.name === `${locationQuery}, ${locationQuery}` && loc.subTypeText === 'Municipio');
//      if (municipioLocation && municipioLocation.locationId) {
//       console.log(`[ApifyService] Found Municipio Location ID: ${municipioLocation.locationId} for "${locationQuery}"`);
//       return municipioLocation.locationId;
//     }
    
//     // Fallback más genérico: el primer locationId que parezca razonable (ej. que contenga el query)
//     // Esto es un poco más arriesgado, la lógica de arriba es preferible.
//     const fallbackLocation = locations.find(loc => loc.name.includes(locationQuery) && loc.locationId);
//     if (fallbackLocation) {
//         console.warn(`[ApifyService] Using fallback Location ID: ${fallbackLocation.locationId} for "${locationQuery}" (Name: ${fallbackLocation.name})`);
//         return fallbackLocation.locationId;
//     }

//     console.warn(`[ApifyService] Could not determine a specific Provincia or Municipio ID for "${locationQuery}" from results:`, locations);
//     return null;

//   } catch (error) {
//     console.error(`[ApifyService] Error fetching location ID for "${locationQuery}":`, error);
//     return null; // Devolver null para que el llamador maneje la ausencia de ID
//   }
// }

// /**
//  * Busca propiedades en Idealista usando el Actor de Apify.
//  * @param {object} searchParams - Parámetros para el Actor de propiedades.
//  * @param {string} searchParams.locationId - El ID de ubicación de Idealista.
//  * @param {number} [searchParams.minPrice=1000000] - Precio mínimo.
//  * @param {number} [searchParams.maxItems=50] - Número máximo de items a devolver.
//  * @param {string} [searchParams.propertyType="homes"] - Tipo de propiedad.
//  * @param {string} [searchParams.operation="sale"] - Tipo de operación.
//  * @param {string} [searchParams.country="es"] - País.
//  * @param {string} [searchParams.publicationDate=""] - Filtro por fecha de publicación (ej: "W" para última semana).
//  * @returns {Promise<Array<any>>} - Una promesa que resuelve a un array de propiedades.
//  */
// export async function fetchProperties(searchParams) {
//   const defaults = {
//     minPrice: 1000000,
//     maxItems: 50, // Un default razonable para empezar
//     propertyType: 'homes',
//     operation: 'sale',
//     country: 'es',
//     publicationDate: '', // Traer todos por defecto, se puede especificar 'Y', 'W', 'M'
//     proxy: { // Configuración de proxy recomendada por el Actor
//       useApifyProxy: true,
//       apifyProxyGroups: ['RESIDENTIAL'],
//     },
//   };

//   const input = {
//     ...defaults,
//     ...searchParams, // searchParams sobreescribe defaults, especialmente locationId que es obligatorio
//   };

//   if (!input.locationId) {
//     console.error('[ApifyService] Location ID is required to fetch properties.');
//     throw new Error('Location ID is required.');
//   }
  
//   // Asegurarse que maxItems es un número
//   if (typeof input.maxItems !== 'number') {
//     input.maxItems = parseInt(input.maxItems, 10) || defaults.maxItems;
//   }
//   if (typeof input.minPrice !== 'number') {
//     input.minPrice = parseInt(input.minPrice, 10) || defaults.minPrice;
//   }


//   console.log(`[ApifyService] Fetching properties with input:`, input);
//   try {
//     const properties = await runActorAndGetDatasetItems(PROPERTIES_ACTOR_ID, input);
//     return properties || []; // Asegurar que siempre devolvemos un array
//   } catch (error) {
//     console.error(`[ApifyService] Error fetching properties:`, error);
//     return []; // Devolver array vacío en caso de error para no romper el UI
//   }
// }

console.warn('⚠️ ApifyService desactivado - Usando RapidAPI Madrid Service');

// Funciones mock para compatibilidad
export async function fetchLocationId(locationQuery = 'Madrid') {
  console.warn('fetchLocationId: Función desactivada, usando datos de Madrid');
  return '0-EU-ES-28-07-001-079'; // Madrid locationId
}

export async function fetchProperties(searchParams) {
  console.warn('fetchProperties: Función desactivada, usar rapidApiMadridService');
  return [];
}

/**
 * 🏠 NUEVA FUNCIÓN: Buscar propiedades similares para testigos
 * Simula búsqueda de propiedades comparables para valoración
 */
export async function searchSimilarProperties(searchParams) {
  console.log('🔍 [ApifyService] Buscando propiedades similares para testigos...');
  console.log('📋 Parámetros de búsqueda:', searchParams);
  
  // Simular delay de API real
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const { district, minSize, maxSize, minPrice, maxPrice, rooms, maxResults = 15 } = searchParams;
  
  // Crear testigos realistas basados en los parámetros
  const similarProperties = [];
  const baseSize = (minSize + maxSize) / 2;
  const basePrice = (minPrice + maxPrice) / 2;
  
  // Distritos premium de Madrid con multiplicadores de precio
  const districtMultipliers = {
    'Salamanca': 1.4,
    'Chamberí': 1.2,
    'Centro': 1.3,
    'Retiro': 1.25,
    'Chamartín': 1.15,
    'Moncloa-Aravaca': 1.1,
    'Tetuán': 0.95,
    'Arganzuela': 0.9,
    'Latina': 0.85,
    'Carabanchel': 0.8
  };
  
  const multiplier = districtMultipliers[district] || 1.0;
  
  // Generar propiedades similares
  for (let i = 0; i < Math.min(maxResults, 15); i++) {
    const sizeVariation = 0.8 + (Math.random() * 0.4); // ±20% variación
    const priceVariation = 0.85 + (Math.random() * 0.3); // ±15% variación
    
    const propertySize = Math.round(baseSize * sizeVariation);
    const propertyPrice = Math.round(basePrice * priceVariation * multiplier);
    
    // Variaciones realistas en habitaciones y baños
    const roomsVariation = rooms + (Math.random() > 0.5 ? (Math.random() > 0.7 ? 1 : 0) : (Math.random() > 0.7 ? -1 : 0));
    const bathrooms = Math.max(1, Math.floor(roomsVariation * 0.6) + (Math.random() > 0.5 ? 1 : 0));
    
    // Direcciones realistas por distrito
    const addresses = generateRealisticAddresses(district);
    const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
    
    // Características aleatorias pero realistas
    const features = generateRandomFeatures(propertyPrice, district);
    
    similarProperties.push({
      id: `similar_${i + 1}_${Date.now()}`,
      propertyCode: `SIM${district.substring(0,3).toUpperCase()}${i + 1}${Date.now()}`,
      title: `${getPropertyType(roomsVariation, propertySize)} en ${district}`,
      address: randomAddress,
      price: propertyPrice,
      size: propertySize,
      rooms: roomsVariation,
      bathrooms: bathrooms,
      district: district,
      municipality: 'Madrid',
      year: 1980 + Math.floor(Math.random() * 40), // Entre 1980-2020
      portal: ['Idealista', 'Fotocasa', 'Habitaclia', 'Pisos.com'][Math.floor(Math.random() * 4)],
      propertyType: 'flat',
      features: features,
      scrapedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Últimos 30 días
      images: [`https://placekitten.com/400/300?random=${i + 1}`],
      description: generatePropertyDescription(roomsVariation, propertySize, district, features),
      contactInfo: {
        userType: Math.random() > 0.6 ? 'private' : 'professional',
        phone: `6${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`
      }
    });
  }
  
  console.log(`✅ [ApifyService] ${similarProperties.length} propiedades similares generadas para ${district}`);
  return similarProperties;
}

/**
 * Generar direcciones realistas por distrito
 */
function generateRealisticAddresses(district) {
  const addressesByDistrict = {
    'Salamanca': [
      'Calle Serrano, 45',
      'Calle Velázquez, 78',
      'Calle Jorge Juan, 32',
      'Calle Goya, 156',
      'Calle Príncipe de Vergara, 234',
      'Calle María de Molina, 67'
    ],
    'Chamberí': [
      'Calle Santa Engracia, 89',
      'Calle Fuencarral, 123',
      'Calle Trafalgar, 56',
      'Calle San Bernardo, 78',
      'Calle Luchana, 34',
      'Calle Arapiles, 91'
    ],
    'Centro': [
      'Calle Gran Vía, 45',
      'Calle Arenal, 23',
      'Plaza Mayor, 12',
      'Calle Preciados, 67',
      'Calle del Carmen, 34',
      'Calle Montera, 56'
    ],
    'Retiro': [
      'Calle Alcalá, 234',
      'Calle Doctor Esquerdo, 78',
      'Calle Ibiza, 45',
      'Calle Menéndez Pelayo, 123',
      'Avenida de la Paz, 67',
      'Calle Narváez, 89'
    ]
  };
  
  return addressesByDistrict[district] || [
    `Calle Principal, ${Math.floor(Math.random() * 200) + 1}`,
    `Avenida Central, ${Math.floor(Math.random() * 150) + 1}`,
    `Plaza Mayor, ${Math.floor(Math.random() * 50) + 1}`,
    `Calle Real, ${Math.floor(Math.random() * 100) + 1}`
  ];
}

/**
 * Generar tipo de propiedad basado en habitaciones y tamaño
 */
function getPropertyType(rooms, size) {
  if (size > 200) return 'Chalet';
  if (size > 150) return 'Dúplex';
  if (rooms >= 4) return 'Piso grande';
  if (rooms >= 3) return 'Piso';
  if (rooms >= 2) return 'Apartamento';
  return 'Estudio';
}

/**
 * Generar características aleatorias pero realistas
 */
function generateRandomFeatures(price, district) {
  const features = {};
  
  // Probabilidades basadas en precio y distrito
  const isPremium = price > 800000;
  const isLuxury = price > 1500000;
  const premiumDistricts = ['Salamanca', 'Chamberí', 'Centro', 'Retiro'];
  const isPremiumDistrict = premiumDistricts.includes(district);
  
  // Ascensor (muy común en Madrid)
  features.elevator = Math.random() > 0.2; // 80% probabilidad
  
  // Calefacción (muy común)
  features.heating = Math.random() > 0.15; // 85% probabilidad
  
  // Aire acondicionado (más común en propiedades premium)
  features.airConditioning = Math.random() > (isPremium ? 0.3 : 0.6);
  
  // Terraza (moderadamente común)
  features.terrace = Math.random() > 0.7; // 30% probabilidad
  
  // Garaje (más común en propiedades caras)
  features.garage = Math.random() > (isPremium ? 0.4 : 0.8);
  
  // Trastero (común en edificios nuevos)
  features.storage = Math.random() > 0.6; // 40% probabilidad
  
  // Amueblado (variable)
  features.furnished = Math.random() > 0.7; // 30% probabilidad
  
  // Reformado (más común en propiedades premium)
  features.reformed = Math.random() > (isPremium ? 0.5 : 0.8);
  
  // Piscina (raro, solo en propiedades de lujo)
  if (isLuxury && isPremiumDistrict) {
    features.pool = Math.random() > 0.9; // 10% probabilidad solo en lujo
  }
  
  return features;
}

/**
 * Generar descripción realista de la propiedad
 */
function generatePropertyDescription(rooms, size, district, features) {
  const descriptions = [
    `Magnífico ${getPropertyType(rooms, size).toLowerCase()} de ${rooms} habitaciones y ${size}m² en el exclusivo distrito de ${district}.`,
    `Espectacular vivienda en ${district} con ${rooms} dormitorios y ${size}m² de superficie.`,
    `Preciosa propiedad de ${rooms} habitaciones en ${district}, totalmente exterior y muy luminosa.`,
    `Excelente oportunidad en ${district}. ${rooms} habitaciones, ${size}m², en edificio clásico.`
  ];
  
  let description = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  // Añadir características destacadas
  const featureTexts = [];
  if (features.elevator) featureTexts.push('con ascensor');
  if (features.terrace) featureTexts.push('con terraza');
  if (features.garage) featureTexts.push('con plaza de garaje');
  if (features.airConditioning) featureTexts.push('con aire acondicionado');
  if (features.reformed) featureTexts.push('totalmente reformado');
  
  if (featureTexts.length > 0) {
    description += ` Destacamos: ${featureTexts.slice(0, 3).join(', ')}.`;
  }
  
  description += ' Ideal para entrar a vivir.';
  
  return description;
} 