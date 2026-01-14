import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ParseResponseDto {
  @ApiPropertyOptional({ example: "BANCO PICHINCHA" })
  bankName?: string;

  @ApiPropertyOptional({ example: "1725399834" })
  identification?: string;

  @ApiPropertyOptional({ example: "JADIRA ESTEFANIA CAIZA GUACHI" })
  holderName?: string;

  @ApiPropertyOptional({ example: "2206045497" })
  accountNumber?: string;

  @ApiPropertyOptional({ example: "AHORROS" })
  accountType?: string;

  @ApiPropertyOptional({ example: "USD" })
  currency?: string;

  @ApiProperty({ example: 0.92, description: "Heuristic confidence from 0 to 1." })
  confidence: number;

  @ApiPropertyOptional({
    description: "Raw extracted text (debug). Disabled by default.",
  })
  rawText?: string;
}
