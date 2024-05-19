import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from '../models/task.model';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import CurrentUser from '../../../shared/utils/current-user.util';
import { TaskGateway } from '../gateway/task.gateway';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private taskGateway: TaskGateway,
  ) {}

  public async all(): Promise<TaskDocument[]> {
    // Get all tasks
    return await this.taskModel.find({ user: CurrentUser.get('_id') });
  }

  public async get(_id: string): Promise<TaskDocument> {
    // Get task
    const task = await this.taskModel.findOne({
      _id,
      user: CurrentUser.get('_id'),
    });

    // Check if task exist
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  public async create(data: CreateTaskDto): Promise<TaskDocument> {
    // Create task
    const task = await this.taskModel.create({
      user: CurrentUser.get('_id'),
      title: data.title,
      description: data.description,
      isCompleted: false,
    });

    // Emit the 'newTask' event
    this.taskGateway.newTaskEvent(task);

    return task;
  }

  public async update(_id: string, data: UpdateTaskDto): Promise<Task> {
    // Get task or throw if task does not exist
    const task = await this.get(_id);

    task.title = data.title;
    task.description = data.description;
    task.isCompleted = data.isCompleted;

    const updatedTask = await task.save();

    // Emit updatedTask event
    this.taskGateway.updateTaskEvent(updatedTask);

    return updatedTask;
  }

  public async delete(_id: string): Promise<null> {
    // Get task or throw if task does not exist
    await this.get(_id);

    // Delete task
    return null;
  }
}
