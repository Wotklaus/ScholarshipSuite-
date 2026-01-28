import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('scholarship_types') // Nombre de la tabla en PostgreSQL
export class ScholarshipType {
  @PrimaryGeneratedColumn('uuid') // ID único del tipo de beca
  id: string;

  @Column('varchar')
  name: string; // Tipo de beca: "Excellence", "Vulnerability", etc.
}