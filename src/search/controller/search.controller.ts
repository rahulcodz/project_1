import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Search')
@Controller('search')
export class SearchController {
  @Get()
  async findAll() {
    return 'sdfsdf';
  }
}
