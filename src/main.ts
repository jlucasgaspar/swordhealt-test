import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { swaggerHelper } from './shared/helpers/swagger.helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swaggerHelper.setupSwaggerDocs(app);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}

bootstrap();
