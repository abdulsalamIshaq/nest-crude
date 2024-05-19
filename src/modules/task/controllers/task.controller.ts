import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
} from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  /**
   * Create task
   */
  @Post('')
  create(@Body() payload: CreateTaskDto) {
    return this.taskService.create(payload);
  }

  /**
   * Get all tasks
   */
  @Public()
  @Get('')
  all() {
    return this.taskService.all();
  }

  /**
   * Get a task
   */
  @Public()
  @Get(':id')
  get(@Param('id') id: string) {
    return this.taskService.get(id);
  }

  /**
   * Update task
   */
  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdateTaskDto) {
    return this.taskService.update(id, payload);
  }

  /**
   * Delete task
   */
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.taskService.delete(id);
  }
}
