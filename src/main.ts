import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cors from 'cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from "@scalar/nestjs-api-reference";
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const allowedOrigins: string = '*';//configService.get<string>('ALLOWED_ORIGINS') || '*';

  app.enableCors({
    origin: true, //'http://localhost:3000',//allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Enable Swagger
  const config = new DocumentBuilder()
    .setTitle('Vikmid API')
    .setDescription('API documentation for Vikmid API')
    .setVersion('1.0')
    .addBearerAuth() // Add Bearer token support for secure endpoints
    .build();

  const document = SwaggerModule.createDocument(app, config);
  app.use('/docs', apiReference({ spec: { content: document } }));
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
