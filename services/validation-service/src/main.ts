import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // si tu PDF es grande, puedes subir límite aquí si usas express raw,
  // pero con multer normalmente está bien.
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(3003);
  console.log("validation-service escuchando en 3003");
}
bootstrap();
