import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('careers')
export class Career {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'faculty_id', type: 'uuid' })
  facultyId: string;

  @Column({ type: 'varchar' })
  name: string;
}
