import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Active la validation des DTO
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Active le filtre d'exception global
  app.useGlobalFilters(new HttpExceptionFilter());

  // Active CORS pour le frontend
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Movia API')
    .setDescription('API de location et achat de véhicules')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log('🚀 Movia Backend démarré sur http://localhost:3000');
  console.log('📚 Swagger disponible sur http://localhost:3000/api/docs');
}
bootstrap();
