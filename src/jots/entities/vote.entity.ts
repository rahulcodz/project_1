import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users';
import { Jots } from './jots.entity';

@Schema({ timestamps: true })
export class JotVote extends Document {
  @Prop({ required: true, type: Boolean, default: true })
  voted: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Jots', required: true })
  jotId: Jots;
}

export const JotsVoteSchema = SchemaFactory.createForClass(JotVote);

JotsVoteSchema.index({ user: 1, jotId: 1 }, { unique: true });
