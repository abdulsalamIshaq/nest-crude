import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { ResponseInterceptor } from './shared/interceptors/response.iinterceptor';
import { HttpExceptionFilter } from './shared/exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable cors
  app.use(helmet());

  // enable cors
  app.enableCors();

  // compression for responses
  app.use(compression());

  // Api versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
