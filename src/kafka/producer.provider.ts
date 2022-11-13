import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, ProducerRecord } from 'kafkajs';

if (!process.env.KAFKA_URL) {
  throw new Error('process.env.KAFKA_URL not provided');
}

const brokers = [process.env.KAFKA_URL];

@Injectable()
export class KafkaProducerProvider implements OnModuleInit {
  private readonly kafka = new Kafka({ brokers });
  private readonly producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect();
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }

  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }
}
