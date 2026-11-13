import { ApiProperty } from '@nestjs/swagger';
 import { IsNotEmpty, IsString, MinLength } from 'class-validator';
 export class CreateCategoriaDto {
   @ApiProperty({ example: 'Bebidas' }) // aparece na documentação
   @IsString()
   @IsNotEmpty({ message: 'O nome é obrigatório' })
   @MinLength(2, { message: 'O nome precisa ter ao menos 2 letras' })
   nome!: string;
}