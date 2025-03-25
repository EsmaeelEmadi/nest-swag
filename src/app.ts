import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export const app = async () => {
  return await NestFactory.create(AppModule);
}
