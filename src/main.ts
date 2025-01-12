import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from "@scalar/nestjs-api-reference";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
