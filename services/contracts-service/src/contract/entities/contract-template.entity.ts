import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ScholarshipType } from './scholarship-type.entity';

@Entity('contract_templates') // Nombre de la tabla en PostgreSQL
export class ContractTemplate {
  @PrimaryGeneratedColumn('uuid') // ID único de la plantilla
  id: string;

  // Relación con la tabla "scholarship_types"
  @ManyToOne(() => ScholarshipType, { eager: true })
  scholarship_type: ScholarshipType;

  @Column('jsonb')
  structure: any; // Estructura en formato JSON para la plantilla
}