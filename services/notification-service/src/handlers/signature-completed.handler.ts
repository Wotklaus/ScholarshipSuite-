import { Injectable, Logger } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';

@Injectable()
export class SignatureCompletedHandler {
  private readonly logger = new Logger(SignatureCompletedHandler.name);

  constructor(private readonly mqtt: MqttService) {}

  async handle(data: any) {
    this.logger.log(`📥 Evento SIGNATURE_COMPLETED → ${JSON.stringify(data)}`);

    this.mqtt.publish('notifications/signature', {
      message: 'Firma completada correctamente.',
      signature: data,
    });
  }
}
