import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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

@ApiTags('Jots')
@Controller('jots')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class JotsController {
  constructor(
    private readonly jotsService: JotsService,
    private readonly commentService: CommentsService,
    private readonly voteService: VoteService,
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
}
