import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JotVote } from '../entities/vote.entity';
import { Model } from 'mongoose';
import { AddVoteDto } from '../dtos/add-vote.dto';

@Injectable()
export class VoteService {
  constructor(
    @InjectModel(JotVote.name)
    private readonly voteModel: Model<JotVote>,
  ) {}

  async addVote(req: Request, jotVote: AddVoteDto) {
    const payload = {
      ...jotVote,
      user: (req as any).user.userId,
    };

    const data = new this.voteModel(payload);
    await data.save();
    return 'Vote added !!!';
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

  async countVote(jotId: string) {
    try {
      const [downVote, upVote] = await Promise.all([
        this.voteModel.countDocuments({ jotId: jotId, voted: false }).exec(),
        this.voteModel.countDocuments({ jotId: jotId, voted: true }).exec(),
      ]);

      return { upVote, downVote };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
