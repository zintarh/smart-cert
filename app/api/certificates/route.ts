import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateCertificateHash, generateCertificateId } from '@/lib/hash-utils'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      recipientName, 
      email, 
      course, 
      matricNo, 
      issueDate, 
      expiryDate,
      template,
      signatoryLeft,
      signatoryRight
    } = body

    // Validate required fields
    if (!recipientName || !email || !course || !matricNo || !issueDate) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate unique certificate ID and hash
    const certificateId = generateCertificateId()
    const hash = generateCertificateHash({
      recipientName,
      email,
      course,
      matricNo,
      issueDate,
      userId: session.user.id
    })

    // Create certificate in database
    const certificate = await prisma.certificate.create({
      data: {
        certificateId,
        hash,
        recipientName,
        email,
        course,
        matricNo,
        issueDate: new Date(issueDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        status: 'ISSUED',
        issuedAt: new Date(),
        template: template || 'classic',
        signatoryLeft: signatoryLeft || null,
        signatoryRight: signatoryRight || null,
        userId: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: certificate.id,
        certificateId: certificate.certificateId,
        hash: certificate.hash,
        recipientName: certificate.recipientName,
        email: certificate.email,
        course: certificate.course,
        matricNo: certificate.matricNo,
        issueDate: certificate.issueDate,
        expiryDate: certificate.expiryDate,
        status: certificate.status
      }
    })

  } catch (error) {
    console.error('Certificate creation error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || ''
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: {
      userId: string
      status?: 'PENDING' | 'ISSUED' | 'VERIFIED' | 'REVOKED'
      OR?: Array<{
        [key: string]: { contains: string; mode: 'insensitive' }
      }>
    } = {
      userId: session.user.id
    }

    if (status && ['PENDING', 'ISSUED', 'VERIFIED', 'REVOKED'].includes(status)) {
      where.status = status as 'PENDING' | 'ISSUED' | 'VERIFIED' | 'REVOKED'
    }

    if (search) {
      where.OR = [
        { recipientName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { course: { contains: search, mode: 'insensitive' } },
        { matricNo: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get certificates with pagination
    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.certificate.count({ where })
    ])

    const pages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        certificates: certificates.map(cert => ({
          id: cert.id,
          certificateId: cert.certificateId,
          recipientName: cert.recipientName,
          email: cert.email,
          course: cert.course,
          matricNo: cert.matricNo,
          issueDate: cert.issueDate.toISOString(),
          expiryDate: cert.expiryDate?.toISOString(),
          status: cert.status,
          template: cert.template,
          signatoryLeft: cert.signatoryLeft,
          signatoryRight: cert.signatoryRight,
          hash: cert.hash,
          createdAt: cert.createdAt.toISOString()
        })),
        pagination: {
          page,
          limit,
          total,
          pages
        }
      }
    })

  } catch (error) {
    console.error('Get certificates error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
