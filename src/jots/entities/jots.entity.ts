import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserType } from 'src/enums/user-type/user-type.enum';
import { User } from 'src/users';
import { JotComments } from './comments.entity';

@Schema({ timestamps: true })
export class Jots extends Document {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ default: [] })
  tags: string[];

  @Prop({
    type: Number,
    enum: UserType,
    default: UserType.PUBLIC,
  })
  JotsType: UserType;

  @Prop({ type: [JotComments], default: [] })
  comments: JotComments[];

  @Prop({ default: false })
  deleted: boolean;
}

export const JotsSchema = SchemaFactory.createForClass(Jots);
