import { ApiProperty } from '@nestjs/swagger';

export class ConfirmSignatureDto {
  @ApiProperty({ example: 'uuid-of-signature-request' })
  signatureId: string;

  // For mock electronic signature
  @ApiProperty({ example: '123456', required: false })
  code?: string;
}
