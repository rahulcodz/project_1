import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth';
import { CreateJotsDto } from '../dtos/create-jots.dto';
import { JotsService } from '../services/jots.service';
import { CommentsService } from '../services/comments.service';
import { AddCommentDto } from '../dtos/add-comment.dto';
import { AddVoteDto } from '../dtos/add-vote.dto';
import { VoteService } from '../services/vote.service';
import { UpdateJotsDto } from '../dtos/update-jots.dto';
import { AddCommentVoteDto } from '../dtos/add-comment-vote';
import { CommentsVoteService } from '../services/comment-vote.service';

@ApiTags('Jots')
@Controller('jots')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class JotsController {
  constructor(
    private readonly jotsService: JotsService,
    private readonly commentService: CommentsService,
    private readonly voteService: VoteService,
    private readonly commentVoteService: CommentsVoteService,
  ) {}

  @Get()
  async findAll() {
    return this.jotsService.getJots();
  }

  @Get('/current')
  async getCurrent(@Request() req) {
    return this.jotsService.getCurrent(req);
  }

  @Post()
  async create(@Request() req, @Body() jot: CreateJotsDto) {
    return this.jotsService.create(req, jot);
  }

  @Put()
  async update(@Request() req, @Body() jot: UpdateJotsDto) {
    return this.jotsService.update(req, jot);
  }

  @Post('/comment/add')
  async addComment(@Request() req, @Body() jotComment: AddCommentDto) {
    return this.commentService.addComment(req, jotComment);
  }

  @Get('/comment/:id')
  async getCommentByJot(@Param('id') id: string) {
    return this.commentService.getCommentByJot(id);
  }

  @Get('/:id')
  async getJotById(@Param('id') id: string) {
    return this.jotsService.getPostById(id);
  }

  @Get('/vote/:id')
  async getVoteByJoy(@Param('id') id: string) {
    return this.voteService.getVoteByJoy(id);
  }

  @Post('/vote')
  async addVote(@Request() req, @Body() vote: AddVoteDto) {
    return this.voteService.addVote(req, vote);
  }

  @Post('/comment/vote')
  async addCommentVote(@Request() req, @Body() commentVote: AddCommentVoteDto) {
    return this.commentVoteService.addCommentVote(req, commentVote);
  }
}
