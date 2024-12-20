import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserCredibility } from 'src/enums/user-type/user-credibility';

@Schema()
export class CredibilityItem {
  @Prop({ required: true })
  up_vote?: number;

  @Prop({ required: true })
  down_vote?: number;

  @Prop({ required: true })
  comment_up_vote?: number;

  @Prop({ required: true })
  comment_down_vote?: number;

  @Prop({ required: true })
  awardedFromAcc?: number;

  @Prop({ required: true })
  reportedPost?: number;

  @Prop({ required: true })
  reportedComment?: number;

  @Prop({
    type: Number,
    enum: UserCredibility,
    required: true,
  })
  type: UserCredibility;
}

export const CredibilityItemSchema =
  SchemaFactory.createForClass(CredibilityItem);

@Schema({ timestamps: true })
export class Credibility extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: [CredibilityItemSchema], required: true })
  credibility: CredibilityItem[];

  @Prop({ default: new Date() })
  dated: Date;
}

export const CredibilitySchema = SchemaFactory.createForClass(Credibility);
