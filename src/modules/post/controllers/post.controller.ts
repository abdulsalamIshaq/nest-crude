import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  /**
   * Create post
   */
  @Post('')
  create(@Body() payload: CreatePostDto) {
    return this.postService.create(payload);
  }

  /**
   * Get all posts
   */
  @Public()
  @Get('')
  all() {
    return this.postService.all();
  }

  /**
   * Get a post
   */
  @Public()
  @Get(':id')
  get(@Param('id') id: string) {
    return this.postService.get(id);
  }

  /**
   * Update post
   */
  @Put(':id')
  update(@Param('id') id: string, @Body() payload: CreatePostDto) {
    return this.postService.update(id, payload);
  }

  /**
   * Delete post
   */
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.postService.delete(id);
  }
}
