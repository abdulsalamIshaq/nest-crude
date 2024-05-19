import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);
