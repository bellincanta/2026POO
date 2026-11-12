import { PrismaClient } from '@prisma/client';
 import * as bcrypt from 'bcryptjs';
 const prisma = new PrismaClient();
 async function main() {
   // upsert: cria se não existe, mantém se existe (pode rodar várias vezes)
   const professor = await prisma.usuario.upsert({
     where: { email: 'professor@ifpr.edu.br' },
     update: {},
     create: {
       nome: 'Professor Nelson',
       email: 'professor@ifpr.edu.br',
       senha: await bcrypt.hash('123456', 10), // nunca salvar senha pura
}, });
   const bebidas = await prisma.categoria.upsert({
     where: { nome: 'Bebidas' },
     update: {},
     create: { nome: 'Bebidas' },
   });

const limpeza = await prisma.categoria.upsert({
     where: { nome: 'Limpeza' },
     update: {},
     create: { nome: 'Limpeza' },
   });
   await prisma.produto.createMany({
    data: [
       { nome: 'Refrigerante 2L', preco: 8.5, quantidade: 20, categoriaId:
 bebidas.id },
       { nome: 'Detergente', preco: 3.2, quantidade: 5, categoriaId:
 limpeza.id },
     ],
     skipDuplicates: true,
   });
   console.log(`Seed pronto! Usuário: ${professor.email} / senha 123456`);
 }
 main().finally(() => prisma.$disconnect());