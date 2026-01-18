import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';

import { Contract } from './entities/contract.entity';
import { ContractTemplate } from './entities/contract-template.entity';
import { User } from './entities/user.entity';
import { Scholar } from './entities/scholar.entity';
import { Faculty } from './entities/faculty.entity';
import { Career } from './entities/career.entity';
import { BankAccount } from './entities/bank-account.entity';
import { Bank } from './entities/bank.entity';
import { BankCertificate } from './entities/bank-certificate.entity'; // ✅ NUEVO
import { EventProducerService } from './events/event-producer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contract,
      ContractTemplate,
      User,
      Scholar,
      Faculty,
      Career,
      BankAccount,
      Bank,
      BankCertificate, // ✅ NUEVO
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET missing in contracts-service env');
        }
        return { secret };
      },
    }),
  ],
  controllers: [ContractController],
  providers: [
    ContractService,
    EventProducerService,
  ],
})
export class ContractModule {}
