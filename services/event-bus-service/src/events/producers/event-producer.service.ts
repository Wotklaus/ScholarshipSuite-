import { Injectable, Logger } from '@nestjs/common';
import { KafkaService } from '../../kafka.service';
import { Topics } from '../topics';

@Injectable()
export class EventProducerService {
  private readonly logger = new Logger(EventProducerService.name);

  constructor(private readonly kafka: KafkaService) {}

  async emit(topic: string, payload: any) {
    await this.kafka.emit(topic, payload);
    this.logger.log(`Event emitted: ${topic}`);
  }

  async emitUserLoggedIn(data: any) {
    await this.emit(Topics.USER_LOGGED_IN, data);
  }

  async emitBankCertificateUploaded(data: any) {
    await this.emit(Topics.BANK_CERTIFICATE_UPLOADED, data);
  }

  async emitSignatureCompleted(data: any) {
    await this.emit(Topics.SIGNATURE_COMPLETED, data);
  }

  async emitContractGenerated(data: any) {
    await this.emit(Topics.CONTRACT_GENERATED, data);
  }
}
