import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class AddCommentVoteDto {
  @ApiProperty()
  @IsBoolean()
  voted: boolean;

  @ApiProperty()
  @IsString()
  commentId: string;
}
