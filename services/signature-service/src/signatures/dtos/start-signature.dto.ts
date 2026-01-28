import { ApiProperty } from '@nestjs/swagger';

export class StartSignatureDto {
  @ApiProperty({ example: '00000000-0000-0000-0000-000000000020' })
  contractId: string;

  @ApiProperty({ example: 'ELECTRONIC', enum: ['ELECTRONIC', 'MANUAL'] })
  method: 'ELECTRONIC' | 'MANUAL';
}
