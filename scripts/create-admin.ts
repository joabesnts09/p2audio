// Script para criar o primeiro usuário admin
// Execute: npx ts-node scripts/create-admin.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function createAdmin() {
  try {
    console.log('=== Criar Usuário Admin ===\n')

    const username = await question('Digite o nome de usuário: ')
    const email = await question('Digite o email: ')
    const password = await question('Digite a senha: ')

    if (!username || !email || !password) {
      console.error('Todos os campos são obrigatórios!')
      process.exit(1)
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    })

    if (existingUser) {
      console.error('Usuário ou email já existe!')
      process.exit(1)
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'admin',
      },
    })

    console.log('\n✅ Usuário admin criado com sucesso!')
    console.log(`ID: ${user.id}`)
    console.log(`Usuário: ${user.username}`)
    console.log(`Email: ${user.email}`)
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    process.exit(1)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

createAdmin()
