import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/create-post.dto';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @HttpCode(HttpStatus.OK)
  @Post('')
  create(@Body() payload: CreatePostDto) {
    return this.postService.create(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Get('')
  all() {
    return this.postService.all();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  get(@Param('id') id: string) {
    return this.postService.get(id);
  }
}
