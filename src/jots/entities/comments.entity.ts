import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users';

@Schema({ timestamps: true })
export class JotComments extends Document {
  @Prop({ required: true })
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true, type: String })
  jotId: string;

  @Prop({ required: true, type: Number, min: 1, max: 5 })
  rated: number;

  @Prop({ default: false })
  deleted: boolean;
}

export const JotsCommentsSchema = SchemaFactory.createForClass(JotComments);
