import { Global, Module } from '@nestjs/common';
 import { PrismaService } from './prisma.service';
 @Global() // só precisa importar uma vez, no AppModule
 @Module({
   providers: [PrismaService],
   exports: [PrismaService],
 })
 export class PrismaModule {}