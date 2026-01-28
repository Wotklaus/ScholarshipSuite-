import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('contract_templates')
export class ContractTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'scholarship_type_id', type: 'uuid' })
  scholarshipTypeId: string;

  @Column({ name: 'structure', type: 'jsonb' })
  structure: any;
}
