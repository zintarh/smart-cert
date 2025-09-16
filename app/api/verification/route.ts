import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { certificateId } = body

    if (!certificateId) {
      return NextResponse.json(
        { success: false, message: 'Certificate ID is required' },
        { status: 400 }
      )
    }

    // Search for certificate by hash (certificateId in this case)
    const certificate = await prisma.certificate.findUnique({
      where: {
        hash: certificateId
      },
      include: {
        user: {
          select: {
            name: true,
            unijos: true
          }
        }
      }
    })

    if (!certificate) {
      return NextResponse.json({
        success: false,
        message: 'Certificate not found or invalid hash',
        isValid: false
      })
    }

    // Check if certificate is issued
    if (certificate.status !== 'ISSUED') {
      return NextResponse.json({
        success: false,
        message: 'Certificate is not valid (not issued)',
        isValid: false
      })
    }

    // Check if certificate has expired
    if (certificate.expiryDate && new Date() > certificate.expiryDate) {
      return NextResponse.json({
        success: false,
        message: 'Certificate has expired',
        isValid: false
      })
    }

    // Certificate is valid
    return NextResponse.json({
      success: true,
      message: 'Certificate verified successfully',
      isValid: true,
      certificateData: {
        id: certificate.id,
        certificateId: certificate.certificateId,
        recipientName: certificate.recipientName,
        studentName: certificate.recipientName,
        course: certificate.course,
        graduationYear: certificate.issueDate.getFullYear().toString(),
        unijos: certificate.user.unijos || 'Unknown Unijos',
        issuedAt: certificate.issueDate.toISOString(),
        issuer: certificate.user.name || 'Unknown Issuer',
        blockchainHash: certificate.hash,
        digitalSignature: 'Verified by Smart Cert System'
      }
    })

  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
