import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JotComments } from '../entities/comments.entity';
import { Model } from 'mongoose';
import { AddCommentDto } from '../dtos/add-comment.dto';
import { UserService } from 'src/users';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(JotComments.name)
    private readonly commentsModel: Model<JotComments>,
    private readonly userService: UserService,
  ) {}

  async addComment(req: Request, jotComment: AddCommentDto) {
    try {
      const user = await this.userService.getCurrentUser(req);

      const payload = {
        ...jotComment,
        user: user,
      };

      const data = new this.commentsModel(payload);
      data.save();
      return 'Comment added !!!';
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getCommentByJot(id: string) {
    try {
      const data = this.commentsModel
        .find({ jotId: id, deleted: false })
        .select('content jotId createdAt')
        .populate('user', 'name userName')
        .exec();
      return data;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async countComment(jotId: string) {
    try {
      const count = await this.commentsModel
        .countDocuments({ jotId: jotId, deleted: false })
        .exec();
      return count;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getRatingAverage(jotId: string) {
    try {
      const result = await this.commentsModel.aggregate([
        {
          $match: { jotId: jotId, deleted: false },
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rated' },
          },
        },
      ]);

      const averageRating = result.length > 0 ? result[0].averageRating : null;

      return averageRating;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
