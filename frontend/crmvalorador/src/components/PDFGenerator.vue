<template>
  <div ref="pdfContent" class="pdf-document" style="width: 210mm; background: white; font-family: 'Arial', sans-serif;">
    <!-- Página 1: Portada -->
    <div class="pdf-page">
      <!-- Header corporativo -->
      <div class="header-section">
        <div class="company-logo">
          <div class="logo-placeholder">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="60" height="60" rx="12" fill="#2563EB"/>
              <path d="M20 25H40V35H20V25Z" fill="white"/>
              <path d="M15 20H45V30H15V20Z" fill="white" opacity="0.7"/>
              <path d="M25 30H35V40H25V30Z" fill="white" opacity="0.5"/>
            </svg>
          </div>
          <div class="company-info">
            <h1 class="company-name">CRM VALORADOR</h1>
            <p class="company-tagline">Servicios Profesionales de Tasación Inmobiliaria</p>
          </div>
        </div>
        <div class="report-date">
          <p>{{ formatDate(new Date()) }}</p>
        </div>
      </div>

      <!-- Título principal -->
      <div class="title-section">
        <h1 class="main-title">INFORME DE VALORACIÓN</h1>
        <h2 class="subtitle">{{ valuation.type || 'Tasación Inmobiliaria' }}</h2>
        <div class="reference-number">
          <p>Referencia: {{ generateReference() }}</p>
        </div>
      </div>

      <!-- Información destacada -->
      <div class="highlight-section">
        <div class="property-summary">
          <h3>Inmueble Valorado</h3>
          <p class="property-address">{{ property.address }}</p>
          <p class="property-details">{{ property.type }} • {{ property.surface }} m² • {{ property.rooms }} hab.</p>
        </div>
        
        <div class="valuation-result">
          <h3>Valor de Tasación</h3>
          <p class="final-value">{{ formatCurrency(valuation.valuationAmount) }}</p>
          <p class="price-per-m2">{{ Math.round(valuation.valuationAmount / property.surface) }} €/m²</p>
        </div>
      </div>

      <!-- Footer de portada -->
      <div class="cover-footer">
        <div class="appraiser-info">
          <p><strong>Tasador:</strong> {{ valuation.appraiser || 'Tasador Profesional' }}</p>
          <p><strong>Colegiado:</strong> {{ valuation.collegialNumber || 'COL-12345' }}</p>
        </div>
      </div>
    </div>

    <!-- Página 2: Detalles de la propiedad -->
    <div class="pdf-page">
      <div class="page-header">
        <h2>DESCRIPCIÓN DEL INMUEBLE</h2>
        <div class="page-number">Página 2</div>
      </div>

      <div class="content-grid">
        <!-- Información general -->
        <div class="info-section">
          <h3>Datos Generales</h3>
          <div class="info-table">
            <div class="info-row">
              <span class="label">Dirección:</span>
              <span class="value">{{ property.address }}</span>
            </div>
            <div class="info-row">
              <span class="label">Ciudad:</span>
              <span class="value">{{ property.city }}</span>
            </div>
            <div class="info-row">
              <span class="label">Código Postal:</span>
              <span class="value">{{ property.postalCode }}</span>
            </div>
            <div class="info-row">
              <span class="label">Tipo de inmueble:</span>
              <span class="value">{{ property.type }}</span>
            </div>
          </div>
        </div>

        <!-- Características físicas -->
        <div class="info-section">
          <h3>Características Físicas</h3>
          <div class="info-table">
            <div class="info-row">
              <span class="label">Superficie útil:</span>
              <span class="value">{{ property.surface }} m²</span>
            </div>
            <div class="info-row">
              <span class="label">Habitaciones:</span>
              <span class="value">{{ property.rooms }}</span>
            </div>
            <div class="info-row">
              <span class="label">Baños:</span>
              <span class="value">{{ property.bathrooms }}</span>
            </div>
            <div class="info-row">
              <span class="label">Planta:</span>
              <span class="value">{{ property.floor || 'N/A' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Año construcción:</span>
              <span class="value">{{ property.constructionYear || 'N/A' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Calificación energética:</span>
              <span class="value">{{ property.energyRating || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <!-- Características adicionales -->
        <div class="info-section full-width">
          <h3>Características Adicionales</h3>
          <div class="features-grid">
            <div class="feature-item" :class="{ active: property.elevator }">
              <span class="feature-icon">🏢</span>
              <span>Ascensor</span>
            </div>
            <div class="feature-item" :class="{ active: property.parking }">
              <span class="feature-icon">🚗</span>
              <span>Parking</span>
            </div>
            <div class="feature-item" :class="{ active: property.terrace }">
              <span class="feature-icon">🌅</span>
              <span>Terraza</span>
            </div>
            <div class="feature-item" :class="{ active: property.garden }">
              <span class="feature-icon">🌳</span>
              <span>Jardín</span>
            </div>
            <div class="feature-item" :class="{ active: property.pool }">
              <span class="feature-icon">🏊</span>
              <span>Piscina</span>
            </div>
            <div class="feature-item" :class="{ active: property.airConditioning }">
              <span class="feature-icon">❄️</span>
              <span>Aire Acondicionado</span>
            </div>
          </div>
        </div>

        <!-- Datos registrales -->
        <div class="info-section full-width" v-if="property.cadastralReference">
          <h3>Datos Registrales</h3>
          <div class="registry-header">
            <div class="registry-seal">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="38" stroke="#8B5A2B" stroke-width="2" fill="#F4E4BC"/>
                <circle cx="40" cy="40" r="32" stroke="#8B5A2B" stroke-width="1"/>
                <text x="40" y="25" text-anchor="middle" font-size="8" font-weight="bold" fill="#8B5A2B">REGISTRO DE</text>
                <text x="40" y="35" text-anchor="middle" font-size="8" font-weight="bold" fill="#8B5A2B">LA PROPIEDAD</text>
                <text x="40" y="50" text-anchor="middle" font-size="10" font-weight="bold" fill="#8B5A2B">MADRID</text>
                <text x="40" y="60" text-anchor="middle" font-size="6" fill="#8B5A2B">MINISTERIO DE JUSTICIA</text>
              </svg>
            </div>
            <div class="registry-info">
              <p class="registry-title">CERTIFICACIÓN REGISTRAL</p>
              <p class="registry-subtitle">Conforme a la Ley Hipotecaria y Reglamento Hipotecario</p>
            </div>
          </div>
          <div class="info-table">
            <div class="info-row">
              <span class="label">Referencia catastral:</span>
              <span class="value">{{ property.cadastralReference }}</span>
            </div>
            <div class="info-row" v-if="property.registryData">
              <span class="label">Registro de la Propiedad:</span>
              <span class="value">{{ property.registryData.registro || 'Madrid Nº 1' }}</span>
            </div>
            <div class="info-row" v-if="property.registryData">
              <span class="label">Tomo:</span>
              <span class="value">{{ property.registryData.tomo }}</span>
            </div>
            <div class="info-row" v-if="property.registryData">
              <span class="label">Libro:</span>
              <span class="value">{{ property.registryData.libro }}</span>
            </div>
            <div class="info-row" v-if="property.registryData">
              <span class="label">Folio:</span>
              <span class="value">{{ property.registryData.folio }}</span>
            </div>
            <div class="info-row" v-if="property.registryData">
              <span class="label">Finca:</span>
              <span class="value">{{ property.registryData.finca || 'N/A' }}</span>
            </div>
            <div class="info-row" v-if="property.registryData">
              <span class="label">Inscripción:</span>
              <span class="value">{{ property.registryData.inscripcion || 'N/A' }}</span>
            </div>
          </div>
          <div class="legal-notice">
            <p><strong>NOTA LEGAL:</strong> Los datos registrales han sido verificados conforme al artículo 222 de la Ley Hipotecaria. 
            Esta valoración se realiza de acuerdo con la Orden ECO/805/2003 y el Real Decreto 775/1997.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Página 3: Metodología y valoración -->
    <div class="pdf-page">
      <div class="page-header">
        <h2>METODOLOGÍA Y VALORACIÓN</h2>
        <div class="page-number">Página 3</div>
      </div>

      <!-- Metodología -->
      <div class="methodology-section">
        <h3>Metodología Aplicada</h3>
        <p class="methodology-text">
          Para la valoración de este inmueble se ha aplicado el <strong>{{ valuation.methodology || 'Método de Comparación' }}</strong>.
          Este método consiste en analizar las transacciones de inmuebles similares en la zona, 
          ajustando las diferencias existentes entre el inmueble objeto de valoración y los inmuebles comparables.
        </p>
      </div>

      <!-- Comparables -->
      <div class="comparables-section" v-if="valuation.comparables && valuation.comparables.length > 0">
        <h3>Inmuebles Comparables</h3>
        <table class="comparables-table">
          <thead>
            <tr>
              <th>Dirección</th>
              <th>Superficie</th>
              <th>Precio</th>
              <th>€/m²</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(comparable, index) in valuation.comparables" :key="index">
              <td>{{ comparable.address }}</td>
              <td>{{ comparable.surface }} m²</td>
              <td>{{ formatCurrency(comparable.price) }}</td>
              <td>{{ comparable.pricePerM2 }} €/m²</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Resultado de valoración -->
      <div class="valuation-results">
        <h3>Resultado de la Valoración</h3>
        <div class="results-grid">
          <div class="result-item">
            <span class="result-label">Valor de Mercado</span>
            <span class="result-value">{{ formatCurrency(valuation.marketValue || valuation.valuationAmount) }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Valor Hipotecario</span>
            <span class="result-value">{{ formatCurrency(valuation.mortgageValue || valuation.valuationAmount * 0.98) }}</span>
          </div>
          <div class="result-item highlight">
            <span class="result-label">Valor Final de Tasación</span>
            <span class="result-value final">{{ formatCurrency(valuation.valuationAmount) }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Precio por m²</span>
            <span class="result-value">{{ Math.round(valuation.valuationAmount / property.surface) }} €/m²</span>
          </div>
        </div>
      </div>

      <!-- Observaciones -->
      <div class="observations-section" v-if="valuation.observations">
        <h3>Observaciones</h3>
        <p class="observations-text">{{ valuation.observations }}</p>
      </div>
    </div>

    <!-- Página 4: Información del tasador y firma -->
    <div class="pdf-page">
      <div class="page-header">
        <h2>CERTIFICACIÓN Y ASPECTOS LEGALES</h2>
        <div class="page-number">Página 4</div>
      </div>

      <!-- Información del tasador -->
      <div class="appraiser-section">
        <h3>Datos del Tasador Homologado</h3>
        <div class="appraiser-details">
          <div class="appraiser-info-grid">
            <div class="info-row">
              <span class="label">Nombre:</span>
              <span class="value">{{ valuation.appraiser || 'Tasador Profesional Homologado' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Número de Colegiado:</span>
              <span class="value">{{ valuation.collegialNumber || 'COL-12345' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Colegio Profesional:</span>
              <span class="value">{{ valuation.professionalCollege || 'Colegio de Arquitectos de Madrid' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Fecha de valoración:</span>
              <span class="value">{{ formatDate(valuation.completedAt || new Date()) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Validez de la tasación:</span>
              <span class="value">6 meses desde la fecha de emisión</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Marco normativo -->
      <div class="legal-framework-section">
        <h3>Marco Normativo Aplicable</h3>
        <div class="legal-framework">
          <ul class="legal-list">
            <li>• Orden ECO/805/2003, de 27 de marzo, sobre normas de valoración de bienes inmuebles</li>
            <li>• Real Decreto 775/1997, de 30 de mayo, sobre el régimen jurídico de homologación de los servicios y sociedades de tasación</li>
            <li>• Ley 2/1981, de 25 de marzo, de Regulación del Mercado Hipotecario</li>
            <li>• Normas Técnicas de Valoración del Banco de España</li>
            <li>• Estándares Europeos de Valoración (EVS) 2020</li>
          </ul>
        </div>
      </div>

      <!-- Declaración -->
      <div class="declaration-section">
        <h3>Declaración de Independencia y Responsabilidad</h3>
        <p class="declaration-text">
          El tasador abajo firmante DECLARA que ha realizado la presente valoración con total independencia, 
          sin que exista conflicto de intereses con el solicitante, propietario o cualquier parte interesada. 
          La valoración se ha efectuado conforme a la normativa vigente y a los estándares profesionales, 
          siendo el tasador responsable de la veracidad y exactitud de los datos consignados.
        </p>
        <p class="declaration-text">
          Esta tasación tiene validez de 6 meses desde su fecha de emisión y ha sido realizada exclusivamente 
          para los fines especificados en el encargo de valoración.
        </p>
      </div>

      <!-- Área de firma con sello -->
      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-area">
            <div class="signature-line"></div>
            <p class="signature-label">Firma del Tasador Homologado</p>
            <p class="signature-name">{{ valuation.appraiser || 'Tasador Profesional Homologado' }}</p>
            <p class="signature-number">{{ valuation.collegialNumber || 'COL-12345' }}</p>
          </div>
          <div class="official-seal">
            <div class="seal-container">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="48" stroke="#1f2937" stroke-width="2" fill="none"/>
                <circle cx="50" cy="50" r="40" stroke="#1f2937" stroke-width="1"/>
                <text x="50" y="30" text-anchor="middle" font-size="8" font-weight="bold" fill="#1f2937">COLEGIO OFICIAL</text>
                <text x="50" y="40" text-anchor="middle" font-size="8" font-weight="bold" fill="#1f2937">DE ARQUITECTOS</text>
                <text x="50" y="55" text-anchor="middle" font-size="10" font-weight="bold" fill="#1f2937">MADRID</text>
                <text x="50" y="70" text-anchor="middle" font-size="6" fill="#1f2937">TASADOR HOMOLOGADO</text>
                <text x="50" y="80" text-anchor="middle" font-size="6" fill="#1f2937">{{ valuation.collegialNumber || 'COL-12345' }}</text>
              </svg>
            </div>
            <p class="seal-label">Sello Oficial</p>
          </div>
        </div>
      </div>

      <!-- Footer legal -->
      <div class="final-footer">
        <div class="legal-footer">
          <p class="disclaimer">
            <strong>AVISO LEGAL:</strong> Esta valoración ha sido realizada por tasador homologado conforme a la normativa vigente. 
            El presente documento tiene carácter confidencial y su uso queda limitado a los fines para los que fue solicitado.
          </p>
          <p class="generation-date">
            Documento generado el {{ formatDate(new Date()) }} | 
            Ref: {{ generateReference() }} | 
            Validez: 6 meses
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const props = defineProps({
  property: {
    type: Object,
    required: true
  },
  valuation: {
    type: Object,
    required: true
  },
  client: {
    type: Object,
    required: true
  }
})

function formatDate(date) {
  return format(new Date(date), 'dd MMMM yyyy', { locale: es })
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

function generateReference() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `VAL-${year}${month}${day}-${random}`
}
</script>

<style scoped>
.pdf-document {
  color: #1f2937;
  line-height: 1.5;
}

.pdf-page {
  min-height: 297mm;
  padding: 20mm;
  page-break-after: always;
  position: relative;
  background: white;
}

.pdf-page:last-child {
  page-break-after: avoid;
}

/* Header corporativo */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 3px solid #2563EB;
}

.company-logo {
  display: flex;
  align-items: center;
  gap: 15px;
}

.company-name {
  font-size: 24px;
  font-weight: bold;
  color: #2563EB;
  margin: 0;
}

.company-tagline {
  font-size: 12px;
  color: #6b7280;
  margin: 5px 0 0 0;
}

.report-date {
  text-align: right;
  font-size: 12px;
  color: #6b7280;
}

/* Título principal */
.title-section {
  text-align: center;
  margin: 60px 0;
}

.main-title {
  font-size: 36px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 10px 0;
  letter-spacing: 2px;
}

.subtitle {
  font-size: 20px;
  color: #2563EB;
  margin: 0 0 20px 0;
  font-weight: 600;
}

.reference-number {
  font-size: 14px;
  color: #6b7280;
}

/* Sección destacada */
.highlight-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin: 40px 0;
  padding: 30px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  border-left: 5px solid #2563EB;
}

.property-summary h3,
.valuation-result h3 {
  font-size: 16px;
  font-weight: bold;
  color: #2563EB;
  margin: 0 0 15px 0;
}

.property-address {
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.property-details {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.final-value {
  font-size: 32px;
  font-weight: bold;
  color: #059669;
  margin: 0 0 5px 0;
}

.price-per-m2 {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

/* Footer de portada */
.cover-footer {
  position: absolute;
  bottom: 30mm;
  left: 20mm;
  right: 20mm;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

.appraiser-info p {
  margin: 5px 0;
  font-size: 14px;
}

/* Headers de página */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e5e7eb;
}

.page-header h2 {
  font-size: 24px;
  font-weight: bold;
  color: #2563EB;
  margin: 0;
}

.page-number {
  font-size: 12px;
  color: #6b7280;
}

/* Grid de contenido */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.info-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
}

.info-section.full-width {
  grid-column: 1 / -1;
}

.info-section h3 {
  font-size: 16px;
  font-weight: bold;
  color: #2563EB;
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.info-table {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #6b7280;
  flex: 1;
}

.value {
  font-weight: 600;
  color: #1f2937;
  text-align: right;
  flex: 1;
}

/* Features grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 6px;
  background: #f3f4f6;
  color: #9ca3af;
  font-size: 14px;
}

.feature-item.active {
  background: #dbeafe;
  color: #2563EB;
  font-weight: 500;
}

.feature-icon {
  font-size: 16px;
}

/* Metodología */
.methodology-section {
  margin-bottom: 30px;
}

.methodology-section h3 {
  font-size: 18px;
  font-weight: bold;
  color: #2563EB;
  margin: 0 0 15px 0;
}

.methodology-text {
  font-size: 14px;
  line-height: 1.6;
  color: #4b5563;
  text-align: justify;
}

/* Tabla de comparables */
.comparables-section {
  margin-bottom: 30px;
}

.comparables-section h3 {
  font-size: 18px;
  font-weight: bold;
  color: #2563EB;
  margin: 0 0 15px 0;
}

.comparables-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.comparables-table th {
  background: #f8fafc;
  padding: 10px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.comparables-table td {
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  color: #4b5563;
}

/* Resultados de valoración */
.valuation-results {
  margin-bottom: 30px;
}

.valuation-results h3 {
  font-size: 18px;
  font-weight: bold;
  color: #2563EB;
  margin: 0 0 20px 0;
}

.results-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.result-item {
  display: flex;
  flex-direction: column;
  padding: 15px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.result-item.highlight {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-color: #2563EB;
}

.result-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 5px;
}

.result-value {
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
}

.result-value.final {
  font-size: 24px;
  color: #059669;
}

/* Observaciones */
.observations-section h3 {
  font-size: 18px;
  font-weight: bold;
  color: #2563EB;
  margin: 0 0 15px 0;
}

.observations-text {
  font-size: 14px;
  line-height: 1.6;
  color: #4b5563;
  text-align: justify;
}

/* Sección del tasador */
.appraiser-section {
  margin-bottom: 40px;
}

.appraiser-section h3 {
  font-size: 18px;
  font-weight: bold;
  color: #2563EB;
  margin: 0 0 20px 0;
}

.appraiser-details {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.appraiser-info-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Declaración */
.declaration-section {
  margin-bottom: 40px;
}

.declaration-section h3 {
  font-size: 18px;
  font-weight: bold;
  color: #2563EB;
  margin: 0 0 15px 0;
}

.declaration-text {
  font-size: 14px;
  line-height: 1.6;
  color: #4b5563;
  text-align: justify;
  font-style: italic;
}

/* Área de firma */
.signature-section {
  margin-bottom: 40px;
  text-align: center;
}

.signature-box {
  display: inline-block;
  text-align: center;
  margin: 40px auto;
}

.signature-line {
  width: 200px;
  height: 60px;
  border-bottom: 2px solid #374151;
  margin-bottom: 10px;
}

.signature-label {
  font-size: 12px;
  color: #6b7280;
  margin: 5px 0;
}

.signature-name {
  font-size: 14px;
  font-weight: bold;
  color: #1f2937;
  margin: 5px 0;
}

.signature-number {
  font-size: 12px;
  color: #6b7280;
  margin: 5px 0;
}

/* Footer final */
.final-footer {
  position: absolute;
  bottom: 20mm;
  left: 20mm;
  right: 20mm;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.disclaimer {
  font-size: 10px;
  color: #6b7280;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.generation-date {
  font-size: 10px;
  color: #9ca3af;
  margin: 0;
}

/* Registry header and seal */
.registry-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #fefdf8;
  border: 2px solid #8B5A2B;
  border-radius: 8px;
}

.registry-seal {
  flex-shrink: 0;
}

.registry-info {
  flex: 1;
}

.registry-title {
  font-size: 16px;
  font-weight: bold;
  color: #8B5A2B;
  margin: 0 0 5px 0;
}

.registry-subtitle {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  font-style: italic;
}

.legal-notice {
  margin-top: 15px;
  padding: 12px;
  background: #fef3cd;
  border-left: 4px solid #f59e0b;
  border-radius: 4px;
}

.legal-notice p {
  font-size: 11px;
  color: #92400e;
  margin: 0;
  line-height: 1.4;
}

/* Legal framework section */
.legal-framework-section {
  margin-bottom: 30px;
}

.legal-framework-section h3 {
  font-size: 16px;
  font-weight: bold;
  color: #2563EB;
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.legal-framework {
  background: #f8fafc;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.legal-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.legal-list li {
  font-size: 11px;
  color: #4b5563;
  margin-bottom: 6px;
  line-height: 1.4;
}

/* Enhanced signature section */
.signature-box {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  margin: 40px auto;
  max-width: 500px;
}

.signature-area {
  text-align: center;
  flex: 1;
}

.signature-line {
  width: 180px;
  height: 60px;
  border-bottom: 2px solid #374151;
  margin: 0 auto 10px auto;
}

.official-seal {
  text-align: center;
  flex: 1;
}

.seal-container {
  display: inline-block;
  margin-bottom: 10px;
}

.seal-label {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

/* Enhanced footer */
.legal-footer {
  text-align: center;
  padding: 15px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.disclaimer {
  font-size: 10px;
  color: #4b5563;
  margin: 0 0 10px 0;
  line-height: 1.4;
  text-align: justify;
}

@media print {
  .pdf-page {
    page-break-after: always;
  }
  
  .pdf-page:last-child {
    page-break-after: avoid;
  }
}
</style> 