import { Module } from '@nestjs/common';
import { SearchController } from './controller/search.controller';
import { SearchService } from './services/search.service';

@Module({
  imports: [
    // MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
