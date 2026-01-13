import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { BankCertificateService } from "./bank-certificate.service";

@Controller("bank-certificate")
export class BankCertificateController {
  constructor(private readonly service: BankCertificateService) {}

  @Get("health")
  health() {
    return { ok: true };
  }

  @Post("parse")
  @UseInterceptors(FileInterceptor("file"))
  async parse(
    @UploadedFile() file?: Express.Multer.File,
    @Query("expectedIdentification") expectedIdentification?: string,
  ) {
    if (!file) throw new BadRequestException("Falta el archivo (field: file).");

    const parsed = await this.service.parsePdf(file.buffer);

    // Validación opcional (pero recomendada):
    // si el front manda expectedIdentification, validamos que coincida
    if (expectedIdentification && parsed.identification !== expectedIdentification) {
      throw new BadRequestException("La cédula del certificado no coincide con tu usuario.");
    }

    return parsed;
  }
}
