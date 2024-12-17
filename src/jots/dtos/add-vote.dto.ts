import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class AddVoteDto {
  @ApiProperty()
  @IsBoolean()
  voted: boolean;

  @ApiProperty()
  @IsString()
  jotId: string;
}
