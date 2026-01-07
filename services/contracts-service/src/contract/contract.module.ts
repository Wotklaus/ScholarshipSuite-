import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { Contract } from './entities/contract.entity';
import { ContractTemplate } from './entities/contract-template.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contract, ContractTemplate]), // Registra entidades
  ],
  providers: [
    ContractService, // Servicio principal
  ],
  controllers: [ContractController],
  exports: [ContractService], // Exporta el servicio si otros módulos lo necesitan
})
export class ContractModule {}