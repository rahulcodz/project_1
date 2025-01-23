import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Jots, JotsSchema } from './entities/jots.entity';
import { JotsController } from './controllers/jots.controller';
import { JotsService } from './services/jots.service';
import { UsersModule } from 'src/users';
import { JotComments, JotsCommentsSchema } from './entities/comments.entity';
import { CommentsService } from './services/comments.service';
import { JotsVoteSchema, JotVote } from './entities/vote.entity';
import { VoteService } from './services/vote.service';
import {
  JotCommentVote,
  JotCommentVoteSchema,
} from './entities/comment-vote.entity';
import { CommentsVoteService } from './services/comment-vote.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      { name: Jots.name, schema: JotsSchema },
      { name: JotComments.name, schema: JotsCommentsSchema },
      { name: JotVote.name, schema: JotsVoteSchema },
      { name: JotCommentVote.name, schema: JotCommentVoteSchema },
    ]),
  ],
  controllers: [JotsController],
  providers: [JotsService, CommentsService, VoteService, CommentsVoteService],
  exports: [JotsService, CommentsService, VoteService, CommentsVoteService],
})
export class JotsModule {}
