import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from
 '@nestjs/common';
 import { ApiTags } from '@nestjs/swagger';
 import { CategoriasService } from './categorias.service';
 import { CreateCategoriaDto } from './dto/create-categoria.dto';
 @ApiTags('categorias')
 @Controller('categorias') // prefixo das rotas: /categorias
 export class CategoriasController {
   constructor(private categorias: CategoriasService) {}
   @Get()
   listar() {
     return this.categorias.listar();
}
   @Get(':id')
   buscarUm(@Param('id', ParseIntPipe) id: number) {
     // ParseIntPipe: transforma "5" da URL em 5, e recusa "abc"
     return this.categorias.buscarUm(id);
   }
   @Post()
   criar(@Body() dados: CreateCategoriaDto) {
     return this.categorias.criar(dados);
   }
   @Delete(':id')
   remover(@Param('id', ParseIntPipe) id: number) {
     return this.categorias.remover(id);
   }
}