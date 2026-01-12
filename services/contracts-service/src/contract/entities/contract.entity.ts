import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'template_id', type: 'uuid' })
  templateId: string;

  @Column({ name: 'academic_period_start', type: 'date' })
  academicPeriodStart: Date;

  @Column({ name: 'academic_period_end', type: 'date' })
  academicPeriodEnd: Date;

  @Column({ name: 'official_number', type: 'varchar' })
  officialNumber: string;

  @Column({ name: 'scholarship_amount', type: 'numeric' })
  scholarshipAmount: string; // TypeORM suele devolver numeric como string

  @Column({ name: 'budget_item', type: 'varchar' })
  budgetItem: string;

  @Column({ type: 'varchar', default: 'pending' })
  status: string;

  @Column({ name: 'blockchain_hash', type: 'varchar' })
  blockchainHash: string;

  @Column({ type: 'bytea', nullable: true })
  file: Buffer | null;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
