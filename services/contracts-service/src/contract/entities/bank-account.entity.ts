import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('bank_accounts')
export class BankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'bank_id', type: 'uuid' })
  bankId: string;

  @Column({ name: 'account_type', type: 'varchar' })
  accountType: string;

  @Column({ name: 'account_number', type: 'varchar' })
  accountNumber: string;

  @Column({ name: 'holder_name', type: 'varchar' })
  holderName: string;
}
