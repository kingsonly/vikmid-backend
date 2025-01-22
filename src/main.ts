import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cors from 'cors';
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

}
bootstrap();
