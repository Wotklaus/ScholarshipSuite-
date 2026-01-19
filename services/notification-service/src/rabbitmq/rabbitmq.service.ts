import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EmailService } from '../email/email.service';

@Injectable()
export class RabbitmqService {
  private readonly logger = new Logger(RabbitmqService.name);

  constructor(
    private readonly amqp: AmqpConnection,
    private readonly email: EmailService,
  ) {}

  // ===============================================================
  // PUBLICAR EVENTOS (ya existía, lo dejamos igual)
  // ===============================================================
  async sendEmailEvent(type: string, payload: any) {
    await this.amqp.publish('notifications', type, payload);
    this.logger.log(`📤 [RMQ] Sent event "${type}"`);
  }

  // ===============================================================
  // CONSUMIR EVENTO: USER_LOGGED_IN
  // ===============================================================
  @RabbitSubscribe({
    exchange: 'notifications',
    routingKey: 'email.user_logged_in',
    queue: 'notifications.user_logged_in',
  })
  async handleUserLogged(data: any) {
    this.logger.log(`📩 RabbitMQ USER_LOGGED_IN → ${JSON.stringify(data)}`);

    // Aquí llamas tu handler si quieres
    console.log('📩 [NOTIFICATION] User logged in:', data.userId);

    // Si quieres enviar correo automático al loguearse:
    // await this.email.send(
    //   data.email,
    //   'Inicio de sesión exitoso',
    //   `<p>Hola, has iniciado sesión correctamente.</p>`
    // );
  }

  // ===============================================================
  // CONSUMIR EVENTO: CONTRACT_GENERATED
  // ===============================================================
  @RabbitSubscribe({
    exchange: 'notifications',
    routingKey: 'email.contract_generated',
    queue: 'notifications.contract_generated',
  })
  async handleContractGenerated(data: any) {
    this.logger.log(`📩 RabbitMQ CONTRACT_GENERATED → ${JSON.stringify(data)}`);

    await this.email.send(
      data.email,
      'Contrato generado',
      `<p>Tu contrato ha sido generado exitosamente.</p>`
    );
  }
}
