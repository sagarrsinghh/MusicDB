import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { Rating } from '../../database/entities/rating.entity';
import { Song } from '../../database/entities/song.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Song])],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}
