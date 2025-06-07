import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export class PDFService {
  static async generateValuationPDF(pdfElement, filename = 'valoracion.pdf') {
    try {
      // Configuración para alta calidad
      const canvas = await html2canvas(pdfElement, {
        scale: 2, // Mayor resolución
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: pdfElement.scrollWidth,
        height: pdfElement.scrollHeight,
        scrollX: 0,
        scrollY: 0
      })

      // Crear PDF en formato A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Dimensiones A4 en mm
      const pdfWidth = 210
      const pdfHeight = 297
      
      // Calcular dimensiones de la imagen
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * pdfWidth) / canvas.width

      // Si la imagen es más alta que una página, dividir en páginas
      const totalPages = Math.ceil(imgHeight / pdfHeight)
      
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage()
        }

        const yOffset = -(page * pdfHeight)
        
        pdf.addImage(
          canvas.toDataURL('image/jpeg', 0.95),
          'JPEG',
          0,
          yOffset,
          imgWidth,
          imgHeight
        )
      }

      // Descargar el PDF
      pdf.save(filename)
      
      return true
    } catch (error) {
      console.error('Error generando PDF:', error)
      throw new Error('Error al generar el documento PDF')
    }
  }

  static async generateAdvancedValuationPDF(property, valuation, client) {
    try {
      // Crear un documento PDF más avanzado con múltiples páginas
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Configuración de colores corporativos
      const primaryColor = [37, 99, 235] // #2563EB
      const secondaryColor = [107, 114, 128] // #6B7280
      const accentColor = [5, 150, 105] // #059669

      // Página 1: Portada
      this.addCoverPage(pdf, property, valuation, client, primaryColor, accentColor)
      
      // Página 2: Detalles de la propiedad
      pdf.addPage()
      this.addPropertyDetailsPage(pdf, property, primaryColor)
      
      // Página 3: Metodología y valoración
      pdf.addPage()
      this.addValuationMethodologyPage(pdf, valuation, property, primaryColor, accentColor)
      
      // Página 4: Certificación
      pdf.addPage()
      this.addCertificationPage(pdf, valuation, primaryColor)

      // Generar nombre de archivo único
      const date = new Date()
      const dateStr = date.toISOString().split('T')[0].replace(/-/g, '')
      const filename = `Valoracion_${property.address.replace(/[^a-zA-Z0-9]/g, '_')}_${dateStr}.pdf`

      // Descargar
      pdf.save(filename)
      
      return filename
    } catch (error) {
      console.error('Error generando PDF avanzado:', error)
      throw new Error('Error al generar el documento PDF')
    }
  }

  static addCoverPage(pdf, property, valuation, client, primaryColor, accentColor) {
    // Header corporativo
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.rect(0, 0, 210, 25, 'F')
    
    // Logo y título de empresa
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('CRM VALORADOR', 20, 15)
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Servicios Profesionales de Tasación Inmobiliaria', 20, 20)

    // Fecha
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(10)
    const today = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    pdf.text(today, 150, 15)

    // Título principal
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(28)
    pdf.setFont('helvetica', 'bold')
    pdf.text('INFORME DE VALORACIÓN', 105, 60, { align: 'center' })
    
    pdf.setFontSize(16)
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.text(valuation.type || 'Tasación Inmobiliaria', 105, 75, { align: 'center' })

    // Información destacada
    pdf.setFillColor(248, 250, 252)
    pdf.rect(20, 90, 170, 80, 'F')
    pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.setLineWidth(2)
    pdf.line(20, 90, 25, 90)
    pdf.line(20, 90, 20, 95)

    // Inmueble valorado
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Inmueble Valorado', 30, 105)
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text(property.address, 30, 115)
    
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`${property.type} • ${property.surface} m² • ${property.rooms} hab.`, 30, 125)

    // Valor de tasación
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Valor de Tasación', 30, 145)
    
    pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2])
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    const formattedValue = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(valuation.valuationAmount)
    pdf.text(formattedValue, 30, 160)
    
    pdf.setFontSize(14)
    const pricePerM2 = Math.round(valuation.valuationAmount / property.surface)
    pdf.text(`${pricePerM2} €/m²`, 30, 170)

    // Información del tasador
    pdf.setFillColor(248, 250, 252)
    pdf.rect(20, 220, 170, 40, 'F')
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Tasador:', 30, 235)
    pdf.setFont('helvetica', 'normal')
    pdf.text(valuation.appraiser || 'Tasador Profesional', 70, 235)
    
    pdf.setFont('helvetica', 'bold')
    pdf.text('Colegiado:', 30, 245)
    pdf.setFont('helvetica', 'normal')
    pdf.text(valuation.collegialNumber || 'COL-12345', 70, 245)

    // Referencia
    const reference = this.generateReference()
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.setFontSize(10)
    pdf.text(`Referencia: ${reference}`, 105, 280, { align: 'center' })
  }

  static addPropertyDetailsPage(pdf, property, primaryColor) {
    // Header de página
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('DESCRIPCIÓN DEL INMUEBLE', 20, 25)
    
    pdf.setTextColor(107, 114, 128)
    pdf.setFontSize(10)
    pdf.text('Página 2', 180, 25)

    let yPos = 45

    // Datos generales
    yPos = this.addInfoSection(pdf, 'Datos Generales', [
      ['Dirección:', property.address],
      ['Ciudad:', property.city],
      ['Código Postal:', property.postalCode],
      ['Tipo de inmueble:', property.type]
    ], yPos, primaryColor)

    yPos += 10

    // Características físicas
    yPos = this.addInfoSection(pdf, 'Características Físicas', [
      ['Superficie útil:', `${property.surface} m²`],
      ['Habitaciones:', property.rooms],
      ['Baños:', property.bathrooms],
      ['Planta:', property.floor || 'N/A'],
      ['Año construcción:', property.constructionYear || 'N/A'],
      ['Calificación energética:', property.energyRating || 'N/A']
    ], yPos, primaryColor)

    yPos += 10

    // Características adicionales
    const features = []
    if (property.elevator) features.push('Ascensor')
    if (property.parking) features.push('Parking')
    if (property.terrace) features.push('Terraza')
    if (property.garden) features.push('Jardín')
    if (property.pool) features.push('Piscina')
    if (property.airConditioning) features.push('Aire Acondicionado')

    if (features.length > 0) {
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Características Adicionales', 20, yPos)
      
      yPos += 10
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      pdf.text(features.join(' • '), 20, yPos)
      yPos += 15
    }

    // Datos registrales
    if (property.cadastralReference) {
      const registryData = [
        ['Referencia catastral:', property.cadastralReference]
      ]
      
      if (property.registryData) {
        registryData.push(
          ['Tomo:', property.registryData.tomo],
          ['Libro:', property.registryData.libro],
          ['Folio:', property.registryData.folio]
        )
      }
      
      this.addInfoSection(pdf, 'Datos Registrales', registryData, yPos, primaryColor)
    }
  }

  static addValuationMethodologyPage(pdf, valuation, property, primaryColor, accentColor) {
    // Header de página
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('METODOLOGÍA Y VALORACIÓN', 20, 25)
    
    pdf.setTextColor(107, 114, 128)
    pdf.setFontSize(10)
    pdf.text('Página 3', 180, 25)

    let yPos = 45

    // Metodología
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Metodología Aplicada', 20, yPos)
    
    yPos += 10
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    const methodologyText = `Para la valoración de este inmueble se ha aplicado el ${valuation.methodology || 'Método de Comparación'}. Este método consiste en analizar las transacciones de inmuebles similares en la zona, ajustando las diferencias existentes entre el inmueble objeto de valoración y los inmuebles comparables.`
    
    const splitText = pdf.splitTextToSize(methodologyText, 170)
    pdf.text(splitText, 20, yPos)
    yPos += splitText.length * 5 + 15

    // Comparables (si existen)
    if (valuation.comparables && valuation.comparables.length > 0) {
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Inmuebles Comparables', 20, yPos)
      
      yPos += 10
      this.addComparablesTable(pdf, valuation.comparables, yPos)
      yPos += (valuation.comparables.length + 2) * 8 + 15
    }

    // Resultado de valoración
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Resultado de la Valoración', 20, yPos)
    
    yPos += 15
    
    // Crear tabla de resultados
    const results = [
      ['Valor de Mercado', this.formatCurrency(valuation.marketValue || valuation.valuationAmount)],
      ['Valor Hipotecario', this.formatCurrency(valuation.mortgageValue || valuation.valuationAmount * 0.98)],
      ['Valor Final de Tasación', this.formatCurrency(valuation.valuationAmount)],
      ['Precio por m²', `${Math.round(valuation.valuationAmount / property.surface)} €/m²`]
    ]

    this.addResultsTable(pdf, results, yPos, primaryColor, accentColor)
  }

  static addCertificationPage(pdf, valuation, primaryColor) {
    // Header de página
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('CERTIFICACIÓN Y ASPECTOS LEGALES', 20, 25)
    
    pdf.setTextColor(107, 114, 128)
    pdf.setFontSize(10)
    pdf.text('Página 4', 180, 25)

    let yPos = 50

    // Datos del tasador
    yPos = this.addInfoSection(pdf, 'Datos del Tasador Homologado', [
      ['Nombre:', valuation.appraiser || 'Tasador Profesional Homologado'],
      ['Número de Colegiado:', valuation.collegialNumber || 'COL-12345'],
      ['Colegio Profesional:', valuation.professionalCollege || 'Colegio de Arquitectos de Madrid'],
      ['Fecha de valoración:', new Date().toLocaleDateString('es-ES')],
      ['Validez de la tasación:', '6 meses desde la fecha de emisión'],
      ['Seguro RC Profesional:', valuation.insurancePolicy || 'Póliza Nº 123456789']
    ], yPos, primaryColor)

    yPos += 15

    // Marco normativo
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Marco Normativo Aplicable', 20, yPos)
    
    yPos += 10
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    
    const legalFramework = [
      '• Orden ECO/805/2003, de 27 de marzo, sobre normas de valoración de bienes inmuebles',
      '• Real Decreto 775/1997, de 30 de mayo, sobre el régimen jurídico de homologación',
      '• Ley 2/1981, de 25 de marzo, de Regulación del Mercado Hipotecario',
      '• Normas Técnicas de Valoración del Banco de España',
      '• Estándares Europeos de Valoración (EVS) 2020',
      '• Reglamento (UE) 2016/679 de Protección de Datos (RGPD)'
    ]
    
    legalFramework.forEach(item => {
      const splitText = pdf.splitTextToSize(item, 170)
      pdf.text(splitText, 20, yPos)
      yPos += splitText.length * 4 + 2
    })

    yPos += 10

    // Declaración de independencia
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Declaración de Independencia y Responsabilidad', 20, yPos)
    
    yPos += 10
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    
    const declarationText = `El tasador abajo firmante DECLARA bajo su responsabilidad que ha realizado la presente valoración con total independencia profesional, sin que exista conflicto de intereses con el solicitante, propietario o cualquier parte interesada en la operación. La valoración se ha efectuado conforme a la normativa vigente y a los estándares profesionales internacionales, siendo el tasador responsable de la veracidad y exactitud de los datos consignados.

Esta tasación tiene validez de 6 meses desde su fecha de emisión y ha sido realizada exclusivamente para los fines especificados en el encargo de valoración. El tasador cuenta con seguro de responsabilidad civil profesional vigente.`
    
    const splitDeclaration = pdf.splitTextToSize(declarationText, 170)
    pdf.text(splitDeclaration, 20, yPos)
    yPos += splitDeclaration.length * 4 + 15

    // Área de firma con sellos
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Firma y Sellos Oficiales', 20, yPos)
    
    yPos += 15

    // Firma del tasador
    pdf.setDrawColor(0, 0, 0)
    pdf.line(30, yPos, 90, yPos)
    yPos += 8
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Firma del Tasador Homologado', 60, yPos, { align: 'center' })
    yPos += 5
    pdf.setFont('helvetica', 'bold')
    pdf.text(valuation.appraiser || 'Tasador Profesional', 60, yPos, { align: 'center' })
    yPos += 4
    pdf.setFont('helvetica', 'normal')
    pdf.text(valuation.collegialNumber || 'COL-12345', 60, yPos, { align: 'center' })

    // Sello del colegio profesional
    pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.setLineWidth(2)
    pdf.circle(140, yPos - 15, 20, 'S')
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    pdf.text('COLEGIO OFICIAL', 140, yPos - 20, { align: 'center' })
    pdf.text('DE ARQUITECTOS', 140, yPos - 16, { align: 'center' })
    pdf.text('MADRID', 140, yPos - 8, { align: 'center' })
    pdf.setFontSize(6)
    pdf.text('TASADOR HOMOLOGADO', 140, yPos - 4, { align: 'center' })

    // Sello del registro
    pdf.circle(170, yPos - 15, 15, 'S')
    pdf.setFontSize(7)
    pdf.text('REGISTRO', 170, yPos - 18, { align: 'center' })
    pdf.text('OFICIAL', 170, yPos - 14, { align: 'center' })
    pdf.text('TASADORES', 170, yPos - 10, { align: 'center' })

    // Footer legal
    pdf.setFillColor(248, 250, 252)
    pdf.rect(20, 250, 170, 30, 'F')
    pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.setLineWidth(1)
    pdf.rect(20, 250, 170, 30, 'S')
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    pdf.text('AVISO LEGAL Y PROTECCIÓN DE DATOS', 105, 258, { align: 'center' })
    
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7)
    const legalNotice = `Esta valoración ha sido realizada por tasador homologado conforme a la normativa vigente. El presente documento tiene carácter confidencial y su uso queda limitado a los fines para los que fue solicitado. Los datos personales han sido tratados conforme al RGPD (UE) 2016/679. El cliente tiene derecho de acceso, rectificación, supresión y portabilidad de sus datos.`
    
    const splitNotice = pdf.splitTextToSize(legalNotice, 165)
    pdf.text(splitNotice, 22, 265)
    
    pdf.setFontSize(6)
    pdf.text(`Documento generado el ${new Date().toLocaleDateString('es-ES')} | Ref: ${this.generateReference()} | Validez: 6 meses | Versión: 1.0`, 105, 275, { align: 'center' })
  }

  static addInfoSection(pdf, title, data, yPos, primaryColor) {
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text(title, 20, yPos)
    
    yPos += 10
    
    data.forEach(([label, value]) => {
      pdf.setTextColor(107, 114, 128)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      pdf.text(label, 25, yPos)
      
      pdf.setTextColor(0, 0, 0)
      pdf.setFont('helvetica', 'bold')
      pdf.text(String(value), 80, yPos)
      
      yPos += 6
    })
    
    return yPos + 5
  }

  static addComparablesTable(pdf, comparables, yPos) {
    // Headers
    pdf.setFillColor(248, 250, 252)
    pdf.rect(20, yPos, 170, 8, 'F')
    
    pdf.setTextColor(55, 65, 81)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Dirección', 25, yPos + 5)
    pdf.text('Superficie', 90, yPos + 5)
    pdf.text('Precio', 125, yPos + 5)
    pdf.text('€/m²', 160, yPos + 5)
    
    yPos += 8
    
    // Data rows
    comparables.forEach(comparable => {
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      
      const address = comparable.address.length > 25 ? comparable.address.substring(0, 25) + '...' : comparable.address
      pdf.text(address, 25, yPos + 5)
      pdf.text(`${comparable.surface} m²`, 90, yPos + 5)
      pdf.text(this.formatCurrency(comparable.price), 125, yPos + 5)
      pdf.text(`${comparable.pricePerM2} €/m²`, 160, yPos + 5)
      
      yPos += 8
    })
  }

  static addResultsTable(pdf, results, yPos, primaryColor, accentColor) {
    results.forEach(([label, value], index) => {
      const isHighlight = label === 'Valor Final de Tasación'
      
      if (isHighlight) {
        pdf.setFillColor(219, 234, 254)
        pdf.rect(20, yPos - 2, 170, 12, 'F')
      }
      
      pdf.setTextColor(isHighlight ? primaryColor[0] : 107, isHighlight ? primaryColor[1] : 114, isHighlight ? primaryColor[2] : 128)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      pdf.text(label, 25, yPos + 5)
      
      pdf.setTextColor(isHighlight ? accentColor[0] : 0, isHighlight ? accentColor[1] : 0, isHighlight ? accentColor[2] : 0)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(isHighlight ? 14 : 11)
      pdf.text(value, 160, yPos + 5)
      
      yPos += 15
    })
  }

  static formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  static generateReference() {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `VAL-${year}${month}${day}-${random}`
  }
} 