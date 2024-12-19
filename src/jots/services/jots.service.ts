import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateJotsDto } from '../dtos/create-jots.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Jots } from '../entities/jots.entity';
import { Model } from 'mongoose';
import { UserService } from 'src/users';
import { JotComments } from '../entities/comments.entity';
import { CommentsService } from './comments.service';
import { VoteService } from './vote.service';
import { UpdateJotsDto } from '../dtos/update-jots.dto';

@Injectable()
export class JotsService {
  constructor(
    @InjectModel(Jots.name)
    private readonly jotsModel: Model<Jots>,
    private readonly userService: UserService,
    private readonly commentsService: CommentsService,
    private readonly voteService: VoteService,
  ) {}

  async getJots() {
    try {
      const response = await this.jotsModel
        .find({ deleted: false })
        .select('title description createdAt')
        .populate('user', 'name userName userType')
        .exec();
      return response;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getCurrent(req: Request) {
    try {
      const response = await this.jotsModel
        .find({ deleted: false, user: (req as any).user.userId })
        .select('title description createdAt')
        .exec();

      return response;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async create(req: Request, jot: CreateJotsDto) {
    try {
      const res = {
        ...jot,
        user: (req as any).user.userId,
      };

      const createdJots = new this.jotsModel({
        ...res,
      });
      await createdJots.save();
      return 'Jot saved !!!';
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(req: Request, jot: UpdateJotsDto) {
    try {
      const currentJot = await this.jotsModel
        .findById(String(jot.id))
        .select('title description JotsType user')
        .exec();

      if ((req as any).user.userId !== String(currentJot.user)) {
        throw new BadRequestException('Something went wrong');
      }
      Object.assign(currentJot, jot);
      await currentJot.save();
      return 'Details saved !!!';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getPostById(id: string) {
    try {
      const [count, rating, vote, data] = await Promise.all([
        this.commentsService.countComment(String(id)),
        this.commentsService.getRatingAverage(String(id)),
        this.voteService.countVote(String(id)),
        this.jotsModel
          .findById(String(id))
          .select('title description JotsType')
          .populate('user', 'name userName userType')
          .exec(),
      ]);

      return {
        ...data.toObject(),
        comments: count,
        rating: rating,
        ...vote,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
