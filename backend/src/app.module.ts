import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { AdminModule } from './admin/admin.module';
import { ResultModule } from './result/result.module';
import { SubAdminModule } from './sub-admin/sub-admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Leaderboard } from './leaderboard/entities/leaderboard.entity';
import { Result } from './result/entities/result.entity';
import { User } from './users/entities/user.entity';
import { SubAdmin } from './sub-admin/entities/sub-admin-entity';
import { Admin } from './admin/entities/admin.entity';
import envConfiguration from 'config/envConfiguration';
import { validate } from '../config/env.validation';
import { GuestModule } from './guest/guest.module';
import { GuestController } from './guest/guest.controller';
import { GamemodeModule } from './gamemode/gamemode.module';
import { GuestUserModule } from './guest/guest.module';
import { GuestFeaturesModule } from './guest-features/guest-features.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { GuestUserGuard } from './guest/guest.guard';
import { RedisService } from './guest/provider/redis.service';
import { GuestUserController } from './guest/guest.controller';
import { GuestUserService } from './guest/guest.service';
import { MailModule } from './mail/mail.module';

import { PaginationModule } from './common/pagination/pagination-controller.controller'; // Your change




import { DictionaryModule } from './dictionary/dictionary.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfiguration],
      validate,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: String(process.env.DB_PASSWORD),
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      entities: [User, Result, Leaderboard, Admin, SubAdmin],
      migrations: ['src/migrations/*.ts'],
      synchronize: true,
    }),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 300, // 10 minutes expiration
    }),
    UsersModule,
    AuthModule,
    LeaderboardModule,
    AdminModule,
    ResultModule,
    SubAdminModule,
    GuestModule,
    PaginationModule, 
    MailModule, 
    GamemodeModule,
    GuestUserModule,
    GuestFeaturesModule,
    MailModule,
    // DictionaryModule,
  ],
  controllers: [AppController, GuestUserController],
  providers: [AppService, GuestUserGuard, RedisService, GuestUserService], // Provide RedisService & GuestGuard globally
})
export class AppModule {}