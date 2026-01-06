import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';

@Injectable()
export class ContractRepository extends Repository<Contract> {
  constructor(private readonly dataSource: DataSource) {
    super(Contract, dataSource.createEntityManager());
  }

  async saveContract(createContractDto): Promise<Contract> {
    const contract = this.create({
      userId: createContractDto.userId, // Usamos directamente `userId` definido en la entidad
      template: { id: createContractDto.templateId }, // Relación con `ContractTemplate`
      scholarshipPeriod: createContractDto.scholarshipPeriod,
      officialNumber: createContractDto.officialNumber,
      budgetItem: createContractDto.budgetItem,
      status: 'pending',
      file: createContractDto.file, // Archivo binario
    });

    return await this.save(contract); // Guarda el contrato generado
  }
}