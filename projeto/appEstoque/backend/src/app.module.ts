import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoriasModule } from './categorias/categorias.module';
import { PrismaModule } from './prisma/prisma.module';
 @Module({
   imports: [ConfigModule.forRoot({ isGlobal: true }), CategoriasModule],
 })
 export class AppModule {}