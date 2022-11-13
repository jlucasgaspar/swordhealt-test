import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

class SwaggerHelper {
  setupSwaggerDocs(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('API Docs')
      .setDescription('API documentation')
      .addTag('public', 'routes that do not need authentication')
      .addTag(
        'manager + technician',
        'routes that managers and technicians can access',
      )
      .addTag('manager', 'routes that only managers can access')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document);
  }
}

export const swaggerHelper = new SwaggerHelper();
