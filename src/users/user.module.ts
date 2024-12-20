import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { User, UserSchema } from './entities/user.entity';
import { JotsModule } from 'src/jots';
import { CredibilityService } from './services/credibility.service';
import { Credibility, CredibilitySchema } from './entities/credibility.entity';

@Module({
  imports: [
    forwardRef(() => JotsModule),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Credibility.name, schema: CredibilitySchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, CredibilityService],
  exports: [UserService, CredibilityService],
})
export class UsersModule {}
