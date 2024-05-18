import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Post } from '../models/post.model';
import { Server } from 'socket.io';

@WebSocketGateway()
export class PostGateway {
  @WebSocketServer()
  server: Server;

  newPostEvent(post: Post) {
    // Emit newPost event
    this.server.emit('newPost', post);
  }

  updatePostEvent(post: Post) {
    // Emit updatePost event
    this.server.emit('updatePost', post);
  }
}
