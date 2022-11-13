import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { UserRepository } from '@/user/user.repository';
import { KafkaModule } from '@/kafka/kafka.module';
import { TaskController } from './task.controller';
import { TaskRepository } from './task.repository';
import { TaskConsumer } from './task.consumer';
import { TaskProducer } from './task.producer';
import { TaskService } from './task.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    KafkaModule,
  ],
  providers: [
    TaskService,
    TaskRepository,
    UserRepository,
    TaskConsumer,
    TaskProducer,
  ],
  controllers: [TaskController],
})
export class TaskModule {}
