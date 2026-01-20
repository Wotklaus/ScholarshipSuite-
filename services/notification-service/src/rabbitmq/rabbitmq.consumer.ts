import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EmailService } from '../email/email.service';
import { MqttService } from '../mqtt/mqtt.service';


@Injectable()
export class RabbitmqConsumer {
  private readonly logger = new Logger(RabbitmqConsumer.name);

  constructor(private readonly email: EmailService,
    private readonly mqtt: MqttService,
  ) { }

  // LOGIN EXITOSO
  @RabbitSubscribe({
    exchange: 'notifications',
    routingKey: 'notifications.user.logged.in',
    queue: 'notifications_user_logged_in_queue',
  })
  async handleUserLoggedIn(msg: any) {
    this.logger.log(`📥 [RMQ] LOGIN recibido → ${JSON.stringify(msg)}`);

    await this.email.send(
      msg.email,
      'Inicio de sesión exitoso',
      `<p>Bienvenido ${msg.email}, has iniciado sesión correctamente.</p>`
    );
  }

  // CERTIFICADO BANCARIO SUBIDO
  @RabbitSubscribe({
    exchange: 'notifications',
    routingKey: 'notifications.bank_certificate_uploaded',
    queue: 'notifications_bank_certificate_uploaded_queue',
  })
  async handleBankCertificateUploaded(msg: any) {
    this.logger.log(
      `📥 [RMQ] BANK_CERTIFICATE_UPLOADED → ${JSON.stringify(msg)}`
    );

    const payload = {
      type: 'BANK_CERTIFICATE_UPLOADED',
      userId: msg.userId,
      message: 'Certificado bancario cargado exitosamente',
      timestamp: Date.now(),
    };

    const topic = `dashboard/notifications`;

    this.mqtt.publish(topic, payload);
  }


}
