import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('roles') // Representa la tabla `roles`.
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Ejemplo: 'Administrator', 'Scholar'.
}