import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddCommentDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  jotId: string;

  @ApiProperty({ default: 5 })
  @IsNumber()
  rated: number;
}
