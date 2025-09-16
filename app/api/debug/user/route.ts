import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log("=== DEBUG USER API ===")
    console.log("Environment:", process.env.NODE_ENV)
    console.log("Database URL exists:", !!process.env.DATABASE_URL)
    
    // Test database connection
    await prisma.$connect()
    console.log("Database connection successful")
    
    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: {
        email: 'admin@unijos.edu'
      }
    })
    
    console.log("Admin user found:", !!adminUser)
    if (adminUser) {
      console.log("Admin user details:", {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        hasPassword: !!adminUser.password,
        passwordLength: adminUser.password?.length
      })
    }
    
    // Count total users
    const userCount = await prisma.user.count()
    console.log("Total users in database:", userCount)
    
    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      databaseConnected: true,
      adminUserExists: !!adminUser,
      adminUser: adminUser ? {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        hasPassword: !!adminUser.password,
        passwordLength: adminUser.password?.length
      } : null,
      totalUsers: userCount
    })
    
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV,
      databaseConnected: false
    }, { status: 500 })
  }
}
