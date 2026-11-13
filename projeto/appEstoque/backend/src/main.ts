import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
   new ValidationPipe({
     whitelist: true,            // joga fora campos que não estão no DTO
     forbidNonWhitelisted: true, // e avisa quando isso acontece
     transform: true,            // converte "5" em 5 quando o DTO pede number
}), );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
