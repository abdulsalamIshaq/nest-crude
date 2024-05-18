import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Model,
  DeleteWriteOpResultObject,
  UpdateWriteOpResult,
} from 'mongoose';
import { Post, PostDocument } from '../models/post.model';
import { PostGateway } from '../../../post/post/post.gateway';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePost, UpdatePostDto } from '../dto/update-post.dto';
import CurrentUser from '../../../shared/utils/current-user.util';

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
      throw new BadRequestException('Post not found');
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

  public async update(
    _id: string,
    data: UpdatePostDto,
  ): Promise<UpdateWriteOpResult> {
    // Get post or throw if post does not exist
    const post = await this.get(_id);

    const dataToUpdate = {
      title: data.title,
      content: data.content,
    };

    // Update post
    const updatedPost = await this.postModel.updateOne({ _id }, dataToUpdate);

    // Emit updatePost event
    this.postGateway.updatePostEvent(Object.assign(post, dataToUpdate));

    return updatedPost;
  }

  public async delete(_id: string): Promise<DeleteWriteOpResultObject> {
    // Get post or throw if post does not exist
    await this.get(_id);

    // Delete post
    return await this.postModel.deleteOne({ _id });
  }
}
