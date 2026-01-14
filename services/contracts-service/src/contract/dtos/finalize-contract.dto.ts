import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class FinalizeContractDto {
  /**
   * Optional: if you want to finalize a specific contract.
   * If missing, we will finalize the latest contract for the logged user.
   */
  @IsOptional()
  @IsUUID()
  contractId?: string;

  /**
   * Required: signature hash returned by signature-service after confirmation.
   * We will store it as blockchain_hash (mock blockchain step).
   */
  @IsString()
  @Length(16, 256)
  signatureHash: string;
}
