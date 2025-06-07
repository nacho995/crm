# CRM Valorador - Configuración Legal y Profesional

## ⚖️ Aspectos Legales

### Cumplimiento Normativo
Este sistema cumple con la normativa española vigente para tasaciones inmobiliarias:

- **Orden ECO/805/2003** - Normas de valoración de bienes inmuebles
- **Real Decreto 775/1997** - Régimen jurídico de homologación de servicios de tasación
- **Ley 2/1981** - Regulación del Mercado Hipotecario
- **Normas Técnicas de Valoración del Banco de España**
- **Estándares Europeos de Valoración (EVS) 2020**

### Requisitos para Uso Profesional

#### 1. Tasador Homologado
- Debe ser realizado por tasador homologado con número de colegiado válido
- Inscripción en el Colegio Profesional correspondiente (Arquitectos, Arquitectos Técnicos, etc.)
- Seguro de responsabilidad civil profesional vigente

#### 2. Datos Registrales
- Verificación obligatoria en el Registro de la Propiedad
- Consulta de la referencia catastral en la Sede Electrónica del Catastro
- Comprobación de cargas y gravámenes

#### 3. Validez Legal
- Las tasaciones tienen validez de 6 meses desde su emisión
- Deben incluir declaración de independencia del tasador
- Firma y sello oficial del tasador homologado

## 🔧 Configuración de APIs

### Google Maps API
1. Crear proyecto en [Google Cloud Console](https://console.cloud.google.com/)
2. Habilitar Maps JavaScript API
3. Crear credenciales (API Key)
4. Configurar restricciones de dominio

```bash
# Agregar a .env
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

### Idealista API
1. Registrarse en [Idealista Developers](https://developers.idealista.com/)
2. Solicitar acceso a la API
3. Obtener API Key y Secret

```bash
# Agregar a .env
VUE_APP_IDEALISTA_API_KEY=tu_api_key_aqui
VUE_APP_IDEALISTA_SECRET=tu_secret_aqui
```

### Configuración de Portales Inmobiliarios

#### Términos de Uso
- **Idealista**: Respetar rate limits (100 requests/hora para cuentas gratuitas)
- **Fotocasa**: Scraping permitido respetando robots.txt
- **Pisos.com**: API pública limitada, scraping respetuoso
- **Habitaclia**: Datos públicos, respetar términos de uso

#### Rate Limiting
```javascript
// Configuración recomendada
const rateLimits = {
  idealista: 100, // requests/hora
  fotocasa: 60,   // requests/hora
  pisos: 120,     // requests/hora
  habitaclia: 80  // requests/hora
}
```

## 📋 Datos Requeridos para Tasación Legal

### Información Básica
- Dirección completa y código postal
- Referencia catastral
- Superficie útil y construida
- Año de construcción
- Calificación energética

### Datos Registrales
- Registro de la Propiedad
- Tomo, Libro, Folio
- Finca registral
- Número de inscripción
- Cargas y gravámenes

### Características Técnicas
- Estado de conservación
- Calidades de construcción
- Instalaciones (calefacción, aire acondicionado, etc.)
- Elementos comunes del edificio

### Documentación Fotográfica
- Fachada del edificio
- Interior de la vivienda
- Elementos singulares
- Entorno y ubicación

## 🏛️ Integración con Registro de la Propiedad

### Consulta Telemática
```javascript
// Ejemplo de consulta (requiere certificado digital)
const registryQuery = {
  provincia: 'Madrid',
  municipio: 'Madrid',
  referenciaCatastral: '1234567890123456789012',
  tipoConsulta: 'simple'
}
```

### Verificación de Datos
- Titularidad actual
- Superficie registral vs catastral
- Cargas hipotecarias
- Limitaciones de dominio

## 📊 Metodologías de Valoración

### Método de Comparación (Más Común)
- Análisis de transacciones comparables
- Ajustes por diferencias
- Homogeneización de datos

### Método del Coste
- Valor del suelo + Coste de construcción
- Depreciación por antigüedad
- Gastos complementarios

### Método Residual
- Para suelos urbanizables
- Valor final - Costes - Beneficio
- Análisis de viabilidad

## 🔒 Protección de Datos (RGPD)

### Datos Personales
- Consentimiento explícito del cliente
- Finalidad específica de la tasación
- Plazo de conservación limitado
- Derecho de acceso, rectificación y supresión

### Medidas de Seguridad
- Cifrado de datos sensibles
- Acceso restringido por roles
- Auditoría de accesos
- Copias de seguridad cifradas

## 📄 Documentos Generados

### Informe de Tasación
- Portada con datos identificativos
- Descripción detallada del inmueble
- Metodología aplicada
- Resultado de valoración
- Anexos fotográficos

### Certificación Legal
- Declaración de independencia
- Marco normativo aplicable
- Firma y sello del tasador
- Validez temporal

## 🚀 Instalación y Configuración

### 1. Clonar Repositorio
```bash
git clone https://github.com/tu-usuario/crm-valorador.git
cd crm-valorador/frontend/crmvalorador
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 4. Ejecutar en Desarrollo
```bash
npm run dev
```

### 5. Build para Producción
```bash
npm run build
```

## 📞 Soporte Legal

### Consultas Normativas
- Colegio Oficial de Arquitectos de Madrid
- Banco de España - Normativa de Tasación
- Ministerio de Justicia - Registro de la Propiedad

### Actualizaciones Normativas
- Suscripción a boletines oficiales
- Formación continua obligatoria
- Actualización de metodologías

## ⚠️ Limitaciones y Responsabilidades

### Uso del Sistema
- Solo para tasadores homologados
- Verificación manual de datos obligatoria
- Responsabilidad del tasador en el resultado final

### Datos de Mercado
- Los datos son orientativos
- Verificación independiente recomendada
- Actualización periódica necesaria

### Aspectos Técnicos
- Backup regular de datos
- Mantenimiento de certificados SSL
- Actualización de dependencias de seguridad

---

**IMPORTANTE**: Este sistema es una herramienta de apoyo. La responsabilidad legal de la tasación recae exclusivamente en el tasador homologado que firma el documento. 