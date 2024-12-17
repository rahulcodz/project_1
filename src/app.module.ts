import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { databaseConfig } from './database/database.config';
import { JotsModule } from './jots/jots.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync(databaseConfig),
    AuthModule,
    UsersModule,
    JotsModule,
  ],
})
export class AppModule {}
