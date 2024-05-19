import { Module } from '@nestjs/common';
import { TaskService } from './services/task.service';
import { TaskController } from './controllers/task.controller';
import { Task, TaskSchema } from './models/task.model';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskGateway } from './gateway/task.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  providers: [TaskService, TaskGateway],
  controllers: [TaskController],
})
export class TaskModule {}
