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

  @Column({ type: 'uuid' })
  contractId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar' })
  method: SignatureMethod;

  @Column({ type: 'varchar', default: 'PENDING' })
  status: SignatureStatus;

  @Column({ type: 'varchar', default: 'MOCK' })
  provider: string;

  // Mock challenge (for electronic flow)
  @Column({ type: 'varchar', nullable: true })
  challengeCode: string | null;

  // Receipt hash (mock)
  @Column({ type: 'varchar', nullable: true })
  signatureHash: string | null;

  @Column({ type: 'timestamp', nullable: true })
  signedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
