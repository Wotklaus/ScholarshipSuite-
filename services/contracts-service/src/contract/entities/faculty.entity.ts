import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('faculties')
export class Faculty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;
}
