import { JoiPipeModule } from 'nestjs-joi';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { KafkaModule } from './kafka/kafka.module';
import { AppController } from './app.controller';

@Module({
  imports: [UserModule, TaskModule, KafkaModule, JoiPipeModule],
  controllers: [AppController],
})
export class AppModule {}
