import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type SignatureMethod = 'ELECTRONIC' | 'MANUAL';
export type SignatureStatus = 'PENDING' | 'SIGNED' | 'DECLINED';

@Entity({ name: 'contract_signatures' })
export class ContractSignature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'contract_id', type: 'uuid' })
  contractId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar' })
  method: SignatureMethod;

  @Column({ type: 'varchar', default: 'PENDING' })
  status: SignatureStatus;

  @Column({ type: 'varchar', default: 'MOCK' })
  provider: string;

  @Column({ name: 'challenge_code', type: 'varchar', nullable: true })
  challengeCode: string | null;

  @Column({ name: 'signature_hash', type: 'varchar', nullable: true })
  signatureHash: string | null;

  @Column({ name: 'signed_at', type: 'timestamp', nullable: true })
  signedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
