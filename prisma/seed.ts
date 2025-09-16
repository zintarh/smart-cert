import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {

  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@unijos.edu' },
    update: {
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      university: 'University of Jos',
    },
    create: {
      email: 'admin@unijos.edu',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      university: 'University of Jos',
    },
  })

  console.log('✅ Admin user created:', {
    id: adminUser.id,
    email: adminUser.email,
    name: adminUser.name,
    role: adminUser.role,
  })

  console.log('✅ Admin user setup complete!')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
