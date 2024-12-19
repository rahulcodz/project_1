import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Name should not be empty if provided' })
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty({ message: 'User id is not provided' })
  id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Username should not be empty if provided' })
  userName?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  @ArrayNotEmpty({ message: 'Tags array should not be empty if provided' })
  @IsString({ each: true, message: 'Each tag should be a string' })
  tags?: string[];
}
