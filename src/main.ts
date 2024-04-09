import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: ['localhost:8000','http://localhost:5173','http://192.168.0.19:5173'], // Configura el origen permitido
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Configura los métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Configura los encabezados permitidos
  });

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
