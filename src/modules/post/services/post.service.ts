import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { Post, PostDocument } from '../models/post.model';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import CurrentUser from '../../../shared/utils/current-user.util';
import { PostGateway } from '../gateway/post.gateway';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private postGateway: PostGateway,
  ) {}

  public async all(): Promise<PostDocument[]> {
    // Get all posts
    return await this.postModel.find();
  }

  public async get(_id: string): Promise<PostDocument> {
    // Get post
    const post = await this.postModel.findOne({ _id });

    // Check if post exist
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  public async create(data: CreatePostDto): Promise<PostDocument> {
    // Create post
    const post = await this.postModel.create({
      user: CurrentUser.get('_id'),
      title: data.title,
      content: data.content,
    });

    // Emit the 'newPost' event
    this.postGateway.newPostEvent(post);

    return post;
  }

  public async update(_id: string, data: UpdatePostDto): Promise<Post> {
    // Get post or throw if post does not exist
    const post = await this.get(_id);

    post.title = data.title;
    post.content = data.content;

    const updatedPost = await post.save();

    // Emit updatePost event
    this.postGateway.updatePostEvent(updatedPost);

    return updatedPost;
  }

  public async delete(_id: string): Promise<null> {
    // Get post or throw if post does not exist
    await this.get(_id);

    // Delete post
    return null;
  }
}
