import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'; 
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  

  // Configuración de CORS
  app.enableCors({

  origin: (origin, callback) => {
    const whitelist = [
      process.env.APP_URL_CLIENT,
      process.env.APP_URL_API,
    ];
    if (!origin || whitelist.includes(origin.replace(/\/$/, ''))) {
      callback(null, true);
    } else {
      console.log(`Bloqueado por CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});

  // Configuración de validación global
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 8080);
  console.log(`🚀 Application is running on: http://localhost:8080`); }


bootstrap();
