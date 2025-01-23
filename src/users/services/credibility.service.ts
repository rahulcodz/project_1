import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { VoteService } from 'src/jots/services/vote.service';

@Injectable()
export class CredibilityService {
  constructor(private readonly voteService: VoteService) {}

  async refreshCredibility() {
    try {
      const data = await this.voteService.countUserVote(
        '676d00622ce722699cba9dfc',
      );
      console.log('🚀 ~ CredibilityService ~ refreshCredibility ~ data:', data);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
