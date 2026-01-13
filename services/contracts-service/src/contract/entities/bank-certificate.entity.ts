import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'bank_certificates' })
export class BankCertificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  identification: string;

  @Column()
  bank_name: string;

  @Column()
  account_type: string;

  @Column()
  account_number: string;

  @Column()
  holder_name: string;

  @Column()
  file_path: string;

  @CreateDateColumn()
  created_at: Date;
}
