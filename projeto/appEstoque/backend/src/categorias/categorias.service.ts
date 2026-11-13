import { ConflictException, Injectable, NotFoundException } from
 '@nestjs/common';
 import { PrismaService } from '../prisma/prisma.service';
 import { CreateCategoriaDto } from './dto/create-categoria.dto';
 @Injectable()
 export class CategoriasService {
   // O Nest entrega o PrismaService pronto no construtor (injeção de dependência)
   constructor(private prisma: PrismaService) {}
   listar() {
     return this.prisma.categoria.findMany({ orderBy: { nome: 'asc' } });
     }
   async buscarUm(id: number) {
     const categoria = await this.prisma.categoria.findUnique({ where: { id }
 });
     if (!categoria) {
       // Virar 404 na resposta HTTP é trabalho do Nest, não nosso
       throw new NotFoundException(`Categoria ${id} não encontrada`);
     }
     return categoria;
   }
   async criar(dados: CreateCategoriaDto) {
     const jaExiste = await this.prisma.categoria.findUnique({ where: { nome:
 dados.nome } });
     if (jaExiste) {
       throw new ConflictException(`Já existe a categoria "${dados.nome}"`);
 // 409
}
     return this.prisma.categoria.create({ data: dados });
   }
   async remover(id: number) {
     await this.buscarUm(id); // reaproveita a verificação
     return this.prisma.categoria.delete({ where: { id } });
} }
