import { Module } from '@nestjs/common';
import { KafkaConsumerProvider } from './consumer.provider';
import { KafkaProducerProvider } from './producer.provider';

@Module({
  providers: [KafkaProducerProvider, KafkaConsumerProvider],
  exports: [KafkaProducerProvider, KafkaConsumerProvider],
})
export class KafkaModule {}
