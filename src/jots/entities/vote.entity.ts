import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users';

@Schema({ timestamps: true })
export class JotVote extends Document {
  @Prop({ required: true, type: Boolean, default: true })
  voted: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true, type: String })
  jotId: string;
}

export const JotsVoteSchema = SchemaFactory.createForClass(JotVote);
