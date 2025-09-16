import crypto from 'crypto'

/**
 * Generate a unique hash for a certificate
 * This hash will be used for verification purposes
 */
export function generateCertificateHash(data: {
  recipientName: string
  email: string
  course: string
  matricNo: string
  issueDate: string
  userId: string
}): string {
  // Create a unique string from certificate data
  const hashInput = `${data.recipientName}-${data.email}-${data.course}-${data.matricNo}-${data.issueDate}-${data.userId}-${Date.now()}`
  
  // Generate SHA-256 hash
  return crypto.createHash('sha256').update(hashInput).digest('hex')
}

/**
 * Generate a shorter, more user-friendly certificate ID
 */
export function generateCertificateId(): string {
  // Generate a random string with letters and numbers
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}
