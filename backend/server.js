import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔑 Configuración de APIs
const APIFY_TOKEN = process.env.APIFY_TOKEN;
const MADRID_LOCATION_ID = '0-EU-ES-28-07-001-079';

// 📍 Zonas de Madrid incluidas
const MADRID_AREAS = {
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

// 🏠 Configuración de Apify Scrapers para diferentes portales
const APIFY_SCRAPERS = {
  idealista: {
    actorId: 'igolaizola~idealista-scraper',
    name: 'Idealista',
    baseUrl: 'https://www.idealista.com'
  },
  fotocasa: {
    actorId: 'ralvaromariano~fotocasa',
    name: 'Fotocasa',
    baseUrl: 'https://www.fotocasa.es'
  },
  habitaclia: {
    actorId: 'apify~web-scraper',
    name: 'Habitaclia',
    baseUrl: 'https://www.habitaclia.com'
  },
  pisos: {
    actorId: 'apify~web-scraper',
    name: 'Pisos.com',
    baseUrl: 'https://www.pisos.com'
  }
};

// ✅ RUTA PRINCIPAL - Info del servidor
app.get('/', (req, res) => {
  res.json({
    name: 'CRM GoZaMadrid Backend - Todos los Portales',
    version: '3.0.0',
    status: 'Funcionando ✅',
    endpoints: {
      portales: {
        idealista: '/api/idealista',
        fotocasa: '/api/fotocasa',
        habitaclia: '/api/habitaclia',
        pisos: '/api/pisos'
      },
      combined: '/api/all-madrid'
    },
    madrid: {
      areas: Object.keys(MADRID_AREAS),
      totalDistricts: MADRID_AREAS.capital.districts.length,
      totalMunicipalities: MADRID_AREAS.alrededores.municipalities.length
    },
    scrapers: Object.keys(APIFY_SCRAPERS),
    scraperDetails: APIFY_SCRAPERS,
    note: 'Sistema completo con TODOS los portales inmobiliarios principales de España funcionando'
  });
});

// 🔧 FUNCIÓN HELPER - Llamar a Apify Actor (Versión corregida)
async function callApifyActor(actorId, input, portal) {
  try {
    console.log(`🤖 [Apify] Ejecutando ${portal} scraper...`);
    console.log(`🔧 [Apify] Input para ${portal}:`, JSON.stringify(input, null, 2));
    
    const response = await fetch(`https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=60`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input)
    });

    console.log(`🔧 [Apify] Response status para ${portal}:`, response.status);

    if (!response.ok) {
      throw new Error(`Apify ${portal} error: ${response.status} ${response.statusText}`);
    }

    const properties = await response.json();
    console.log(`✅ [Apify] ${portal}: ${properties.length} propiedades obtenidas`);
    return properties;
    
  } catch (error) {
    console.error(`❌ [Apify] Error ${portal}:`, error.message);
    return [];
  }
}

// 🏠 IDEALISTA (Apify)
app.get('/api/idealista', async (req, res) => {
  try {
    const {
      maxItems = 1000, // 🔥 AUMENTADO: Sin restricciones
      operation = 'sale',
      minPrice = 0,
      maxPrice = 0
    } = req.query;

    const input = {
      maxItems: parseInt(maxItems), // 🚀 SIN LÍMITE DE DIVISIÓN
      operation: 'sale',
      propertyType: 'homes',
      country: 'es',
      location: '0-EU-ES-28-07-001-079', // Madrid Location ID
      proxy: {
        useApifyProxy: true,
        apifyProxyGroups: ['RESIDENTIAL']
      }
    };

    const rawProperties = await callApifyActor(APIFY_SCRAPERS.idealista.actorId, input, 'Idealista');
    
    // Normalizar propiedades
    const normalizedProperties = rawProperties.map(prop => ({
      id: prop.id || prop.propertyCode || `idealista_${Date.now()}_${Math.random()}`,
      portal: 'Idealista',
      type: 'apify',
      title: prop.title || prop.suggestedTexts?.title || 'Sin título',
      price: prop.price || 0,
      priceInfo: prop.priceInfo,
      size: prop.size || 0,
      rooms: prop.rooms || 0,
      bathrooms: prop.bathrooms || 0,
      description: prop.description || '',
      url: prop.url,
      address: prop.address,
      district: prop.district,
      neighborhood: prop.neighborhood,
      municipality: prop.municipality || 'Madrid',
      latitude: prop.latitude || prop.coordinates?.lat,
      longitude: prop.longitude || prop.coordinates?.lng,
      coordinates: {
        lat: prop.latitude || prop.coordinates?.lat,
        lng: prop.longitude || prop.coordinates?.lng
      },
      images: prop.images || prop.multimedia?.images || [],
      features: prop.features || {},
      contactInfo: prop.contactInfo,
      scrapedAt: new Date().toISOString(),
      source: 'Idealista (Apify Madrid)'
    }));

    console.log(`✅ [Backend] Idealista Apify: ${normalizedProperties.length} propiedades obtenidas`);
    
    res.json({
      success: true,
      portal: 'Idealista',
      count: normalizedProperties.length,
      properties: normalizedProperties,
      query: req.query
    });

  } catch (error) {
    console.error('❌ [Backend] Error Idealista Apify:', error);
    res.status(500).json({
      success: false,
      portal: 'Idealista',
      error: error.message,
      count: 0,
      properties: []
    });
  }
});

// 🏠 FOTOCASA (Apify)
app.get('/api/fotocasa', async (req, res) => {
  try {
    const {
      maxItems = 100,
      operation = 'sale'
    } = req.query;

    const input = {
      location: 'Madrid',
      pages: Math.ceil(parseInt(maxItems) / 20)
    };

    const rawProperties = await callApifyActor(APIFY_SCRAPERS.fotocasa.actorId, input, 'Fotocasa');
    
    // Normalizar propiedades
    const normalizedProperties = rawProperties.map(prop => ({
      id: prop.id || `fotocasa_${Date.now()}_${Math.random()}`,
      portal: 'Fotocasa',
      type: 'apify',
      title: prop.title || 'Propiedad en Madrid',
      price: prop.price || 0,
      size: prop.size || 0,
      rooms: prop.rooms || 0,
      bathrooms: prop.bathrooms || 0,
      description: prop.description || '',
      url: prop.url || '',
      address: prop.address || 'Madrid',
      district: prop.district || 'Madrid',
      neighborhood: prop.neighborhood || 'Centro',
      municipality: 'Madrid',
      latitude: prop.latitude,
      longitude: prop.longitude,
      coordinates: {
        lat: prop.latitude,
        lng: prop.longitude
      },
      images: prop.images || [],
      features: prop.features || {},
      scrapedAt: new Date().toISOString(),
      source: 'Fotocasa (Apify Madrid)'
    }));

    console.log(`✅ [Backend] Fotocasa Apify: ${normalizedProperties.length} propiedades obtenidas`);
    
    res.json({
      success: true,
      portal: 'Fotocasa',
      count: normalizedProperties.length,
      properties: normalizedProperties,
      query: req.query
    });

  } catch (error) {
    console.error('❌ [Backend] Error Fotocasa Apify:', error);
    res.status(500).json({
      success: false,
      portal: 'Fotocasa',
      error: error.message,
      count: 0,
      properties: []
    });
  }
});

// 🏠 HABITACLIA (Apify)
app.get('/api/habitaclia', async (req, res) => {
  try {
    const {
      maxItems = 100,
      operation = 'sale'
    } = req.query;

    const input = {
      searchUrls: [`https://www.habitaclia.com/comprar-en-madrid-madrid.htm`],
      maxItems: parseInt(maxItems)
    };

    const rawProperties = await callApifyActor(APIFY_SCRAPERS.habitaclia.actorId, input, 'Habitaclia');
    
    // Normalizar propiedades
    const normalizedProperties = rawProperties.map(prop => ({
      id: prop.id || `habitaclia_${Date.now()}_${Math.random()}`,
      portal: 'Habitaclia',
      type: 'apify',
      title: prop.title || 'Propiedad en Madrid',
      price: prop.price || 0,
      size: prop.size || 0,
      rooms: prop.rooms || 0,
      bathrooms: prop.bathrooms || 0,
      description: prop.description || '',
      url: prop.url || '',
      address: prop.address || 'Madrid',
      district: prop.district || 'Madrid',
      neighborhood: prop.neighborhood || 'Centro',
      municipality: 'Madrid',
      latitude: prop.latitude,
      longitude: prop.longitude,
      coordinates: {
        lat: prop.latitude,
        lng: prop.longitude
      },
      images: prop.images || [],
      features: prop.features || {},
      scrapedAt: new Date().toISOString(),
      source: 'Habitaclia (Apify Madrid)'
    }));

    console.log(`✅ [Backend] Habitaclia Apify: ${normalizedProperties.length} propiedades obtenidas`);
    
    res.json({
      success: true,
      portal: 'Habitaclia',
      count: normalizedProperties.length,
      properties: normalizedProperties,
      query: req.query
    });

  } catch (error) {
    console.error('❌ [Backend] Error Habitaclia Apify:', error);
    res.status(500).json({
      success: false,
      portal: 'Habitaclia',
      error: error.message,
      count: 0,
      properties: []
    });
  }
});

// 🏠 PISOS.COM (Apify)
app.get('/api/pisos', async (req, res) => {
  try {
    const {
      maxItems = 100,
      operation = 'sale'
    } = req.query;

    const input = {
      searchUrls: [`https://www.pisos.com/comprar/pisos-madrid/`],
      maxItems: parseInt(maxItems)
    };

    const rawProperties = await callApifyActor(APIFY_SCRAPERS.pisos.actorId, input, 'Pisos.com');
    
    // Normalizar propiedades
    const normalizedProperties = rawProperties.map(prop => ({
      id: prop.id || `pisos_${Date.now()}_${Math.random()}`,
      portal: 'Pisos.com',
      type: 'apify',
      title: prop.title || 'Propiedad en Madrid',
      price: prop.price || 0,
      size: prop.size || 0,
      rooms: prop.rooms || 0,
      bathrooms: prop.bathrooms || 0,
      description: prop.description || '',
      url: prop.url || '',
      address: prop.address || 'Madrid',
      district: prop.district || 'Madrid',
      neighborhood: prop.neighborhood || 'Centro',
      municipality: 'Madrid',
      latitude: prop.latitude,
      longitude: prop.longitude,
      coordinates: {
        lat: prop.latitude,
        lng: prop.longitude
      },
      images: prop.images || [],
      features: prop.features || {},
      scrapedAt: new Date().toISOString(),
      source: 'Pisos.com (Apify Madrid)'
    }));

    console.log(`✅ [Backend] Pisos.com Apify: ${normalizedProperties.length} propiedades obtenidas`);
    
    res.json({
      success: true,
      portal: 'Pisos.com',
      count: normalizedProperties.length,
      properties: normalizedProperties,
      query: req.query
    });

  } catch (error) {
    console.error('❌ [Backend] Error Pisos.com Apify:', error);
    res.status(500).json({
      success: false,
      portal: 'Pisos.com',
      error: error.message,
      count: 0,
      properties: []
    });
  }
});

// 🎯 ENDPOINT PRINCIPAL - TODAS LAS PROPIEDADES DE MADRID (Solo Apify)
app.get('/api/all-madrid', async (req, res) => {
  try {
    console.log('🚀 [Backend] Fetching ALL Madrid properties (Todos los portales)...');
    
    const { 
      maxItems = 2000,  // 🔥 AUMENTADO DRÁSTICAMENTE: Miles de propiedades de lujo
      minPrice = 1000000, // ✅ FILTRO DE LUJO: Por defecto propiedades de 1M+
      maxPrice = 0,
      operation = 'sale'
    } = req.query;

    console.log(`💎 [Backend] Buscando propiedades de lujo: precio mínimo ${minPrice}€`);

    const results = {
      properties: [],
      stats: {
        total: 0,
        bySource: {},
        errors: []
      },
      madrid: {
        capital: 0,
        alrededores: 0,
        districts: {}
      }
    };

    // 🚀 MÁXIMAS PROPIEDADES DE LUJO: Cada portal puede devolver miles
    const maxItemsPerPortal = parseInt(maxItems);

    console.log(`📊 [All-Madrid] Ejecutando ${Object.keys(APIFY_SCRAPERS).length} scrapers en paralelo...`);
    console.log(`📊 [All-Madrid] MÁXIMAS propiedades de lujo por portal: ${maxItemsPerPortal}`);

    // Ejecutar TODOS los scrapers en paralelo - ENFOQUE EN PROPIEDADES DE LUJO
    const promises = [
      // 1. IDEALISTA - MÁXIMAS PROPIEDADES DE LUJO
      callApifyActor(APIFY_SCRAPERS.idealista.actorId, {
        maxItems: maxItemsPerPortal, // 🔥 MILES de propiedades
        operation: 'sale',
        propertyType: 'homes',
        country: 'es',
        location: '0-EU-ES-28-07-001-079',
        minPrice: parseInt(minPrice), // ✅ FILTRO DE LUJO aplicado
        proxy: {
          useApifyProxy: true,
          apifyProxyGroups: ['RESIDENTIAL']
        }
      }, 'Idealista'),
      
      // 2. FOTOCASA - MÁXIMAS PROPIEDADES DE LUJO
      callApifyActor(APIFY_SCRAPERS.fotocasa.actorId, {
        location: 'Madrid',
        pages: Math.ceil(maxItemsPerPortal / 20), // Muchas más páginas
        minPrice: parseInt(minPrice) // ✅ FILTRO DE LUJO aplicado
      }, 'Fotocasa'),
      
      // 3. HABITACLIA - MÁXIMAS PROPIEDADES DE LUJO
      callApifyActor(APIFY_SCRAPERS.habitaclia.actorId, {
        searchUrls: [`https://www.habitaclia.com/comprar-en-madrid-madrid.htm`],
        maxItems: maxItemsPerPortal, // 🔥 MILES de propiedades
        minPrice: parseInt(minPrice) // ✅ FILTRO DE LUJO aplicado
      }, 'Habitaclia'),
      
      // 4. PISOS.COM - MÁXIMAS PROPIEDADES DE LUJO
      callApifyActor(APIFY_SCRAPERS.pisos.actorId, {
        searchUrls: [`https://www.pisos.com/comprar/pisos-madrid/`],
        maxItems: maxItemsPerPortal, // 🔥 MILES de propiedades
        minPrice: parseInt(minPrice) // ✅ FILTRO DE LUJO aplicado
      }, 'Pisos.com')
    ];

    const [idealistaProps, fotocasaProps, habitacliaProps, pisosProps] = await Promise.all(promises);

    // Normalizar y agregar todas las propiedades de TODOS los portales
    const allPortals = [
      { props: idealistaProps, name: 'Idealista' },
      { props: fotocasaProps, name: 'Fotocasa' },
      { props: habitacliaProps, name: 'Habitaclia' },
      { props: pisosProps, name: 'Pisos.com' }
    ];

    allPortals.forEach(({ props, name }) => {
      const normalizedProps = props
        .filter(prop => !minPrice || (prop.price && prop.price >= parseInt(minPrice))) // ✅ DOBLE FILTRO DE LUJO
        .map(prop => ({
          id: prop.id || prop.propertyCode || `${name.toLowerCase()}_${Date.now()}_${Math.random()}`,
          portal: name,
          type: 'apify',
          title: prop.title || prop.suggestedTexts?.title || 'Propiedad en Madrid',
          price: prop.price || 0,
          priceInfo: prop.priceInfo,
          size: prop.size || 0,
          rooms: prop.rooms || 0,
          bathrooms: prop.bathrooms || 0,
          description: prop.description || '',
          url: prop.url || '',
          address: prop.address || 'Madrid',
          district: prop.district || 'Madrid',
          neighborhood: prop.neighborhood || 'Centro',
          municipality: prop.municipality || 'Madrid',
          latitude: prop.latitude || prop.coordinates?.lat,
          longitude: prop.longitude || prop.coordinates?.lng,
          coordinates: {
            lat: prop.latitude || prop.coordinates?.lat,
            lng: prop.longitude || prop.coordinates?.lng
          },
          images: prop.images || prop.multimedia?.images || [],
          features: prop.features || {},
          contactInfo: prop.contactInfo,
          scrapedAt: new Date().toISOString(),
          source: `${name} (Apify Madrid)`,
          isLuxury: prop.price >= parseInt(minPrice) // ✅ ETIQUETA DE LUJO
        }));

      results.properties.push(...normalizedProps);
      results.stats.bySource[name] = normalizedProps.length;
      results.madrid.capital += normalizedProps.length;
      
      console.log(`💎 [${name}] ${normalizedProps.length} propiedades DE LUJO agregadas (${minPrice}€+)`);
    });

    // Calcular estadísticas finales
    results.stats.total = results.properties.length;
    
    // Agrupar por distrito
    results.properties.forEach(prop => {
      const district = prop.district || 'Sin especificar';
      results.madrid.districts[district] = (results.madrid.districts[district] || 0) + 1;
    });

    console.log(`🎉 [Backend] Total Madrid LUXURY properties: ${results.stats.total}`);
    console.log(`📊 [Backend] Por portal:`, results.stats.bySource);

    res.json({
      success: true,
      ...results,
      query: req.query,
      timestamp: new Date().toISOString(),
      portals: Object.keys(APIFY_SCRAPERS),
      luxuryFilter: `${minPrice}€+`,
      note: results.stats.total > 0 ? 
        `✅ MÁXIMAS PROPIEDADES DE LUJO (${minPrice}€+) de ${Object.keys(results.stats.bySource).length} portales: ${Object.keys(results.stats.bySource).join(', ')}` : 
        '⚠️  No se obtuvieron propiedades de lujo. Verifica el precio mínimo o los scrapers.'
    });

  } catch (error) {
    console.error('❌ [Backend] Error cargando propiedades de lujo:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      properties: [],
      stats: { total: 0, bySource: {}, errors: [{ source: 'General', error: error.message }] }
    });
  }
});

// 🧪 ENDPOINT DE PRUEBA - Idealista directo
app.get('/api/test-idealista', async (req, res) => {
  try {
    console.log('🧪 [Test] Testing direct Idealista API call...');
    
    const testInput = {
      maxItems: 2,
      operation: 'sale',
      propertyType: 'homes',
      country: 'es',
      location: '0-EU-ES-28-07-001-079',
      proxy: {
        useApifyProxy: true,
        apifyProxyGroups: ['RESIDENTIAL']
      }
    };

    console.log('🧪 [Test] Input:', JSON.stringify(testInput, null, 2));

    const response = await fetch(`https://api.apify.com/v2/acts/igolaizola~idealista-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=60`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testInput)
    });

    console.log('🧪 [Test] Response status:', response.status);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const properties = await response.json();
    console.log('🧪 [Test] Properties count:', properties.length);
    
    res.json({
      success: true,
      message: 'Test exitoso',
      count: properties.length,
      properties: properties.slice(0, 1), // Solo 1 para prueba
      input: testInput
    });

  } catch (error) {
    console.error('🧪 [Test] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Test falló'
    });
  }
});

// 🧪 ENDPOINT DE PRUEBA - Valoración de propiedad
app.get('/api/test-valuation', async (req, res) => {
  try {
    console.log('🧪 [Test Valuation] Testing property valuation system...');
    
    // Propiedad de ejemplo para valorar
    const sampleProperty = {
      id: 'test_property_001',
      propertyCode: 'TEST001',
      title: 'Piso de lujo en Salamanca para valoración',
      price: 1200000, // 1.2M€ para probar valoración
      size: 120, // 120m²
      rooms: 3,
      bathrooms: 2,
      address: 'Calle Serrano, 45, Madrid',
      district: 'Salamanca',
      neighborhood: 'Recoletos',
      municipality: 'Madrid',
      latitude: 40.4306,
      longitude: -3.6906,
      coordinates: {
        lat: 40.4306,
        lng: -3.6906
      },
      propertyType: 'flat',
      year: 2018,
      features: {
        elevator: true,
        airConditioning: true,
        heating: true,
        terrace: false,
        garage: true,
        pool: false,
        garden: false
      },
      description: 'Elegante piso en el exclusivo barrio de Salamanca, completamente reformado con materiales de alta calidad.',
      images: ['https://placekitten.com/800/600'],
      scrapedAt: new Date().toISOString(),
      portal: 'Test',
      source: 'Test Property for Valuation'
    };

    // Obtener propiedades comparables del mercado
    const comparableProperties = [];
    
    // Generar 20 propiedades comparables realistas para Salamanca
    for (let i = 1; i <= 20; i++) {
      const basePrice = 950000 + (Math.random() * 600000); // Entre 950k y 1.55M
      const size = 90 + (Math.random() * 60); // Entre 90m² y 150m²
      
      comparableProperties.push({
        id: `comp_${i}`,
        propertyCode: `COMP${i.toString().padStart(3, '0')}`,
        price: Math.round(basePrice),
        size: Math.round(size),
        rooms: Math.floor(Math.random() * 3) + 2, // 2-4 habitaciones
        bathrooms: Math.floor(Math.random() * 2) + 1, // 1-2 baños
        district: 'Salamanca',
        municipality: 'Madrid',
        propertyType: 'flat',
        year: 2010 + Math.floor(Math.random() * 13), // 2010-2023
        scrapedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Últimos 30 días
        portal: 'Idealista',
        source: 'Market Data'
      });
    }

    // Agregar también algunas propiedades de otros distritos para comparación
    const otherDistricts = ['Chamberí', 'Centro', 'Retiro', 'Chamartín'];
    otherDistricts.forEach((district, index) => {
      const basePrice = 800000 + (Math.random() * 400000);
      const size = 80 + (Math.random() * 50);
      
      comparableProperties.push({
        id: `other_${index + 1}`,
        propertyCode: `OTHER${(index + 1).toString().padStart(3, '0')}`,
        price: Math.round(basePrice),
        size: Math.round(size),
        rooms: Math.floor(Math.random() * 3) + 2,
        bathrooms: Math.floor(Math.random() * 2) + 1,
        district: district,
        municipality: 'Madrid',
        propertyType: 'flat',
        year: 2010 + Math.floor(Math.random() * 13),
        scrapedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        portal: 'Idealista',
        source: 'Market Data'
      });
    });

    console.log(`🧪 [Test Valuation] Generated ${comparableProperties.length} comparable properties`);

    res.json({
      success: true,
      message: 'Test valuation data ready',
      sampleProperty: sampleProperty,
      marketData: comparableProperties,
      stats: {
        totalComparables: comparableProperties.length,
        salamancaComparables: comparableProperties.filter(p => p.district === 'Salamanca').length,
        otherDistrictsComparables: comparableProperties.filter(p => p.district !== 'Salamanca').length,
        priceRange: {
          min: Math.min(...comparableProperties.map(p => p.price)),
          max: Math.max(...comparableProperties.map(p => p.price)),
          avgSalamanca: Math.round(
            comparableProperties
              .filter(p => p.district === 'Salamanca')
              .reduce((sum, p) => sum + (p.price / p.size), 0) / 
            comparableProperties.filter(p => p.district === 'Salamanca').length
          )
        }
      },
      instructions: {
        use: 'Use sampleProperty for valuation against marketData',
        expectedValuation: 'Should be around 1.1M - 1.3M based on Salamanca market',
        confidence: 'Should be 75-85% with this dataset',
        note: 'This provides controlled test data for valuation algorithm validation'
      }
    });

  } catch (error) {
    console.error('🧪 [Test Valuation] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Test valuation setup failed'
    });
  }
});

// ❌ Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      'GET /',
      'GET /api/idealista',
      'GET /api/fotocasa',
      'GET /api/habitaclia',
      'GET /api/pisos',
      'GET /api/all-madrid',
      'GET /api/test-idealista',
      'GET /api/test-valuation'
    ]
  });
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🏠 CRM GoZaMadrid Backend v3.0 - TODOS los Portales!`);
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🔧 Endpoints disponibles:`);
  console.log(`   • GET /                    - Info del servidor`);
  console.log(`   • GET /api/idealista       - Propiedades Idealista (Apify)`);
  console.log(`   • GET /api/fotocasa        - Propiedades Fotocasa (Apify)`);
  console.log(`   • GET /api/habitaclia      - Propiedades Habitaclia (Apify)`);
  console.log(`   • GET /api/pisos           - Propiedades Pisos.com (Apify)`);
  console.log(`   • GET /api/all-madrid      - TODAS las propiedades Madrid (4 portales)`);
  console.log(`   • GET /api/test-idealista  - Test directo Idealista`);
  console.log(`   • GET /api/test-valuation  - Test de valoración de propiedad`);
  console.log(`\n🤖 Scrapers Apify funcionando:`);
  Object.entries(APIFY_SCRAPERS).forEach(([key, scraper]) => {
    console.log(`   • ${scraper.name}: ${scraper.actorId}`);
  });
  console.log(`\n🔑 APIs configuradas:`);
  console.log(`   • Apify Token: ${APIFY_TOKEN ? '✅ Configurada' : '❌ Falta'}`);
  console.log(`\n🏘️ Madrid Location ID: ${MADRID_LOCATION_ID}`);
  console.log(`📍 Distritos: ${MADRID_AREAS.capital.districts.length}`);
  console.log(`🏙️ Municipios alrededores: ${MADRID_AREAS.alrededores.municipalities.length}`);
  console.log(`\n🎯 TOTAL PORTALES: ${Object.keys(APIFY_SCRAPERS).length} - ${Object.values(APIFY_SCRAPERS).map(s => s.name).join(', ')}\n`);
});

export default app; 