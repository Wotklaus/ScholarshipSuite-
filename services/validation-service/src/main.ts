import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS (keep it permissive for local dev; tighten in prod)
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("Validation Service")
    .setDescription("PDF parsing and document validation endpoints (Bank Certificate).")
    .setVersion("1.0.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = process.env.PORT || 3003;
  await app.listen(port);

  console.log(`[bootstrap] Validation service running on http://localhost:${port}`);
  console.log(`[bootstrap] Swagger docs available on http://localhost:${port}/docs`);
}

bootstrap();
