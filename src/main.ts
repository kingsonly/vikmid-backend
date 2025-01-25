import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cors from 'cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from "@scalar/nestjs-api-reference";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const allowedOrigins: string = '*';//configService.get<string>('ALLOWED_ORIGINS') || '*';

  app.enableCors({
    origin: 'http://localhost:3000',//allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 4020);


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
