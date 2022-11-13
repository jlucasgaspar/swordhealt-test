import { KafkaProducerProvider } from '@/kafka/producer.provider';
import { Injectable } from '@nestjs/common';
import { FinishTaskDTO } from './dto/task.dto';

@Injectable()
export class TaskProducer {
  constructor(private readonly producerProvider: KafkaProducerProvider) {}

  async finishTaskMessage(params: Omit<FinishTaskDTO, 'finishedAt'>) {
    const message = {
      value: JSON.stringify({
        userId: params.userId,
        taskId: params.taskId,
        finishedAt: new Date().toISOString(),
      }),
    };

    await this.producerProvider.produce({
      topic: 'task-finished',
      messages: [message],
    });

    return { sentToQueue: true };
  }
}
