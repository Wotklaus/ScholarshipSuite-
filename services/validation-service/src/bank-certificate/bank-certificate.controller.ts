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
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BankCertificateService } from "./bank-certificate.service";
import { ParseResponseDto } from "./dto/parse-response.dto";

@ApiTags("Bank Certificate")
@Controller("bank-certificate")
export class BankCertificateController {
  constructor(private readonly service: BankCertificateService) {}

  @Get("health")
  @ApiOperation({ summary: "Health check" })
  health() {
    return { ok: true };
  }

  @Post("parse")
  @ApiOperation({ summary: "Parse a bank certificate PDF and extract bank data" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
      },
      required: ["file"],
    },
  })
  @ApiQuery({
    name: "expectedIdentification",
    required: false,
    description: "Optional: validate that parsed identification matches this value.",
  })
  @ApiQuery({
    name: "includeRawText",
    required: false,
    description: "Optional: return extracted raw text (debug). true/false",
  })
  @ApiResponse({ status: 201, type: ParseResponseDto })
  @UseInterceptors(FileInterceptor("file"))
  async parse(
    @UploadedFile() file?: any,
    @Query("expectedIdentification") expectedIdentification?: string,
    @Query("includeRawText") includeRawText?: string,
  ) {
    if (!file?.buffer) {
      throw new BadRequestException('Missing file (multipart field name must be "file").');
    }

    const parsed = await this.service.parsePdf(file.buffer, {
      includeRawText: includeRawText === "true",
    });

    // Optional validation
    if (expectedIdentification && parsed.identification !== expectedIdentification) {
      throw new BadRequestException(
        "The certificate identification does not match the authenticated user."
      );
    }

    return parsed;
  }
}
