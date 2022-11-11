import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';
import { UserRepository } from '@/user/user.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [TaskService, TaskRepository, UserRepository],
  controllers: [TaskController],
})
export class TaskModule {}
