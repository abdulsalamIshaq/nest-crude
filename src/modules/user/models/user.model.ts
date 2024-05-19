import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import * as argon2 from 'argon2';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

const UserSchema = SchemaFactory.createForClass(User);

// Pre-save hook to hash password
UserSchema.pre<User>('save', async function (next) {
  // check if password is modified
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const hash = await argon2.hash(this.password);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

// toJSON hook to hide password
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export { UserSchema };
