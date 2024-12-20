import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JotVote } from '../entities/vote.entity';
import mongoose, { Model } from 'mongoose';
import { AddVoteDto } from '../dtos/add-vote.dto';

@Injectable()
export class VoteService {
  constructor(
    @InjectModel(JotVote.name)
    private readonly voteModel: Model<JotVote>,
  ) {}

  async addVote(req: Request, jotVote: AddVoteDto) {
    try {
      const payload = {
        ...jotVote,
        user: (req as any).user.userId,
      };

      const data = new this.voteModel(payload);
      await data.save();
      return 'Vote added !!!';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getVoteByJoy(id: string) {
    try {
      const data = this.voteModel
        .find({ jotId: id })
        .select('voted jotId createdAt')
        .populate('user', 'name userName')
        .exec();

      return data;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Count the number of up votes and down votes for a specific Jot.
   * If an afterDate is provided, filter votes based on createdAt.
   * @param jotId - The ID of the Jot
   * @param afterDate - The date after which the votes should be counted (optional)
   * @returns The count of up votes and down votes
   */
  async countVote(jotId: string, afterDate?: Date) {
    try {
      const baseFilter = { jotId: jotId };

      if (afterDate) {
        const filterDate = new Date(afterDate);
        baseFilter['createdAt'] = { $gte: filterDate };
      }

      const [downVote, upVote] = await Promise.all([
        this.voteModel
          .countDocuments({
            ...baseFilter,
            voted: false,
          })
          .exec(),

        this.voteModel
          .countDocuments({
            ...baseFilter,
            voted: true,
          })
          .exec(),
      ]);

      return { upVote, downVote };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Count the number of up votes and down votes for a specific Jot.
   * If an afterDate is provided, filter votes based on createdAt.
   * @param userId - The ID of the Jot
   * @param afterDate - The date after which the votes should be counted (optional)
   * @returns The count of up votes and down votes
   */
  async countUserVote(Id: string, afterDate?: Date) {
    try {
      const matchConditions: any = {
        jotId: { $ne: null },
      };

      if (afterDate) {
        matchConditions.createdAt = { $gte: afterDate };
      }

      const count = await this.voteModel.aggregate([
        {
          $match: matchConditions,
        },
        {
          $lookup: {
            from: 'jots',
            localField: 'jotId',
            foreignField: '_id',
            as: 'jotDetails',
          },
        },
        {
          $match: {
            'jotDetails.user': new mongoose.Types.ObjectId(Id),
          },
        },
        {
          $facet: {
            trueVotes: [{ $match: { voted: true } }, { $count: 'totalCount' }],
            falseVotes: [
              { $match: { voted: false } },
              { $count: 'totalCount' },
            ],
          },
        },
      ]);

      const trueVotesCount = count[0]?.trueVotes[0]?.totalCount || 0;

      const falseVotesCount = count[0]?.falseVotes[0]?.totalCount || 0;

      return { upvote: trueVotesCount, downvote: falseVotesCount };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
