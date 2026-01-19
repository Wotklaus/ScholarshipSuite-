import { Injectable } from '@nestjs/common';
import { connect, MqttClient } from 'mqtt';

@Injectable()
export class MqttService {
  private client: MqttClient;

  constructor() {
    const url = process.env.MQTT_URL || 'mqtt://mosquitto:1883';
    this.client = connect(url);

    this.client.on('connect', () => {
      console.log('📡 MQTT connected!');
    });
  }

  publish(topic: string, msg: any) {
    this.client.publish(topic, JSON.stringify(msg));
    console.log(`📤 [MQTT] ${topic}`, msg);
  }
}
