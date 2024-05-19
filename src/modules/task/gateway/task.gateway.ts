import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Task } from '../models/task.model';
import { Server } from 'socket.io';

@WebSocketGateway()
export class TaskGateway {
  @WebSocketServer()
  server: Server;

  newTaskEvent(task: Task) {
    // Emit newTask event
    this.server.emit('newTask', task);
  }

  updateTaskEvent(task: Task) {
    // Emit updateTask event
    this.server.emit('updateTask', task);
  }
}
