import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EmailService } from '../email/email.service';

@Injectable()
export class RabbitmqConsumer {
  private readonly logger = new Logger(RabbitmqConsumer.name);

  constructor(private readonly email: EmailService) {}

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

  // CONTRATO GENERADO
  @RabbitSubscribe({
    exchange: 'notifications',
    routingKey: 'notifications.contract.generated',
    queue: 'notifications_contract_generated_queue',
  })
  async handleContractGenerated(msg: any) {
    this.logger.log(`📥 [RMQ] CONTRACT GENERATED recibido → ${JSON.stringify(msg)}`);

    await this.email.send(
      msg.email,
      'Contrato generado',
      `<p>Tu contrato ha sido firmado y almacenado correctamente.</p>`
    );
  }
}
