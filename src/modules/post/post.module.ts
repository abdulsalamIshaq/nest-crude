import { Module } from '@nestjs/common';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';
import { Post, PostSchema } from './models/post.model';
import { MongooseModule } from '@nestjs/mongoose';
import { PostGateway } from './gateway/post.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  providers: [PostService, PostGateway],
  controllers: [PostController],
})
export class PostModule {}
