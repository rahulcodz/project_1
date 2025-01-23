import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JotCommentVote } from '../entities/comment-vote.entity';
import { Model } from 'mongoose';
import { AddCommentVoteDto } from '../dtos/add-comment-vote';
import { Request } from 'express';

@Injectable()
export class CommentsVoteService {
  constructor(
    @InjectModel(JotCommentVote.name)
    private readonly commentsModel: Model<JotCommentVote>,
  ) {}

  async addCommentVote(req: Request, commentVote: AddCommentVoteDto) {
    try {
      const payload = {
        ...commentVote,
        jotComment: commentVote.commentId,
        user: String((req as any).user.userId),
      };
      const data = new this.commentsModel(payload);
      await data.save();
      return 'Voted !!!';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
