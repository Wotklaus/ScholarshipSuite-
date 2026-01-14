import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SignaturesController } from './signatures.controller';
import { SignaturesService } from './signatures.service';
import { ContractSignature } from './entities/contract-signature.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContractSignature]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) throw new Error('JWT_SECRET missing in signature-service env');
        return { secret };
      },
    }),
  ],
  controllers: [SignaturesController],
  providers: [SignaturesService],
})
export class SignaturesModule {}
