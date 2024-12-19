import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateJotsDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty({ message: 'User id is not provided' })
  id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  @ArrayNotEmpty({ message: 'Tags array should not be empty if provided' })
  @IsString({ each: true, message: 'Each tag should be a string' })
  tags?: string[];
}
