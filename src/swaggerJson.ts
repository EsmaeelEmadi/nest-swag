import { SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'node:fs';
import { app } from './app';
import { config, document } from './swagger';

async function bootstrap() {
  const _app = await app();

  const documentFactory = () => SwaggerModule.createDocument(_app, config);

  SwaggerModule.setup('api', _app, documentFactory, {
    jsonDocumentUrl: 'api/json',
  });

  const _doc = await document(_app);


  writeFileSync('./swagger/swagger-spec.json', JSON.stringify(_doc));
}

bootstrap();
