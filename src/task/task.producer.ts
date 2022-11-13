import { ProducerService } from '@/kafka/producer.service';
import { Injectable } from '@nestjs/common';
import { FinishTaskDTO } from './dto/task.dto';

@Injectable()
export class TaskProducer {
  constructor(private readonly producerService: ProducerService) {}

  async finishTaskMessage(params: Omit<FinishTaskDTO, 'finishedAt'>) {
    const message = {
      value: JSON.stringify({
        userId: params.userId,
        taskId: params.taskId,
        finishedAt: new Date(),
      }),
    };

    await this.producerService.produce({
      topic: 'task-finished',
      messages: [message],
    });

    return { finished: true };
  }
}
