import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Jots, JotsSchema } from './entities/jots.entity';
import { JotsController } from './controllers/jots.controller';
import { JotsService } from './services/jots.service';
import { UsersModule } from 'src/users';
import { JotComments, JotsCommentsSchema } from './entities/comments.entity';
import { CommentsService } from './services/comments.service';
import { JotsVoteSchema, JotVote } from './entities/vote.entity';
import { VoteService } from './services/vote.service';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Jots.name, schema: JotsSchema },
      { name: JotVote.name, schema: JotsVoteSchema },
      { name: JotComments.name, schema: JotsCommentsSchema },
    ]),
  ],
  controllers: [JotsController],
  providers: [JotsService, CommentsService, VoteService],
  exports: [JotsService, CommentsService, VoteService],
})
export class JotsModule {}
