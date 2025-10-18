import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet'; // Mude a importação
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Remove Fastify

  // Segurança básica
  app.use(helmet());

  // Validação global de DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:19006',
      'https://expo.dev',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 Servidor rodando em http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();