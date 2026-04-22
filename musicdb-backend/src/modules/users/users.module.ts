import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../../database/entities/user.entity';
import { Artist } from '../../database/entities/artist.entity';
import { Song } from '../../database/entities/song.entity';

import { Rating } from '../../database/entities/rating.entity';
import { Review } from '../../database/entities/review.entity';
import { BadgesService } from './badges.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Artist, Song, Rating, Review])],
  providers: [UsersService, BadgesService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
