import { SwaggerModule } from '@nestjs/swagger';
import { app } from './app';
import { config, document } from './swagger';

async function bootstrap() {
  const _app = await app();

  const documentFactory = () => SwaggerModule.createDocument(_app, config);

  SwaggerModule.setup('api', _app, documentFactory, {
    jsonDocumentUrl: 'api/json',
  });

  // const _doc = await document(_app);

  // console.log(_doc['paths']);

  // console.log(_doc);

  // await _app.listen(process.env.PORT ?? 3000);
}
bootstrap();
