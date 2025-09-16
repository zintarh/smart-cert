import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export interface CertificateData {
  name: string
  course: string
  date: string
  issuer: string
  qrCodeUrl?: string
}

export async function exportCertificateAsPDF(
  elementId: string,
  filename: string = 'certificate.pdf'
): Promise<void> {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error('Certificate element not found')
    }

    // Create canvas from the certificate element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
    })

    // Calculate dimensions for A4 size (210 x 297 mm)
    const imgWidth = 210
    const pageHeight = 297
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageData = canvas.toDataURL('image/png', 1.0)

    // Add image to PDF
    pdf.addImage(pageData, 'PNG', 0, 0, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add additional pages if needed
    while (heightLeft >= 0) {
      pdf.addPage()
      pdf.addImage(pageData, 'PNG', 0, -heightLeft, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Download the PDF
    pdf.save(filename)
  } catch (error) {
    console.error('Error exporting certificate as PDF:', error)
    throw new Error('Failed to export certificate as PDF')
  }
}

export async function generateQRCode(): Promise<string> {
  // This is a placeholder - in a real app, you'd use a QR code library
  // For now, we'll return a data URL for a simple QR code placeholder
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="white"/>
      <rect x="10" y="10" width="80" height="80" fill="black"/>
      <rect x="20" y="20" width="60" height="60" fill="white"/>
      <rect x="30" y="30" width="40" height="40" fill="black"/>
      <text x="50" y="70" text-anchor="middle" font-size="8" fill="white">QR</text>
    </svg>
  `)}`
}
