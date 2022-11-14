import * as retry from 'async-retry';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { databaseHelper } from '@/shared/helpers/database.helper';
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

        try {
          const finishTaskFunction = async () => {
            await this.taskService.finishTask(parsedMessage);
          };

          const retryOptions: retry.Options = { retries: 3 };

          await retry(finishTaskFunction, retryOptions);
        } catch (error) {
          await databaseHelper.getTable('dead_letter_queue').insert({
            kafka_message: message.value.toString(),
            error_message: JSON.stringify(error),
          });
          console.log('\x1b[31m', 'Message dead, sent to DB dead_letter_queue');
        }
      },
    });
  }
}
