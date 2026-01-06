import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ContractTemplate } from './contract-template.entity';

@Entity('contracts') // Mapeamos la tabla `contracts`
export class Contract {
  @PrimaryGeneratedColumn('uuid') // ID único del contrato
  id: string;

  @Column('uuid') // Definimos `userId` como un campo UUID
  userId: string;  // Referencia al ID del usuario, sin usar relación directa

  @ManyToOne(() => ContractTemplate, { eager: true }) // Relación con la plantilla del contrato
  template: ContractTemplate;

  @Column('date') // Periodo de la beca
  scholarshipPeriod: Date;

  @Column('varchar') // Número oficial
  officialNumber: string;

  @Column('varchar') // Detalle del presupuesto
  budgetItem: string;

  @Column('varchar', { default: 'pending' }) // Estado del contrato
  status: string;

  @Column('bytea') // Archivo PDF almacenado
  file: Buffer;
}