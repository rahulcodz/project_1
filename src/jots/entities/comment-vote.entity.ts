import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users';
import { Jots } from './jots.entity';
import { JotComments } from './comments.entity';

@Schema({ timestamps: true })
export class JotCommentVote extends Document {
  @Prop({ required: true, type: Boolean, default: true })
  voted: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'JotComments',
    required: true,
  })
  jotComment: JotComments;
}

export const JotCommentVoteSchema =
  SchemaFactory.createForClass(JotCommentVote);

JotCommentVoteSchema.index({ user: 1, jotComment: 1 }, { unique: true });
