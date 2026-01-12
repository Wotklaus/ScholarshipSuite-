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
    ]),

    // ✅ IMPORTANTÍSIMO: esto garantiza que el secret se lee CUANDO YA EXISTE el .env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) {
          // Si falta, te revienta al arrancar (NO 3 horas después)
          throw new Error('JWT_SECRET missing in contracts-service env');
        }
        return { secret };
      },
    }),
  ],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}
