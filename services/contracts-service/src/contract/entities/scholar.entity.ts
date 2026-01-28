import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('scholars')
export class Scholar {
  @PrimaryColumn('uuid')
  id: string; // igual al user_id

  @Column({ name: 'faculty_id', type: 'uuid' })
  facultyId: string;

  @Column({ name: 'career_id', type: 'uuid' })
  careerId: string;

  @Column({ name: 'scholarship_type_id', type: 'uuid' })
  scholarshipTypeId: string;
}
