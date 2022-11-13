import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaConsumerProvider } from '@/kafka/consumer.provider';
import { FinishTaskDTO } from './dto/task.dto';
import { TaskService } from './task.service';

@Injectable()
export class TaskConsumer implements OnModuleInit {
  constructor(
    private readonly consumerProvider: KafkaConsumerProvider,
    private readonly taskService: TaskService,
  ) {}

  async onModuleInit() {
    const topicObject = { topic: 'task-finished' };

    await this.consumerProvider.consume(topicObject, {
      eachMessage: async ({ message }) => {
        const parsedMessage: FinishTaskDTO = JSON.parse(
          message.value.toString(),
        );

        await this.taskService.finishTask(parsedMessage);
      },
    });
  }
}
