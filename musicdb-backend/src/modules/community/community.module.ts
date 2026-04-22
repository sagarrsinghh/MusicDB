import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { Review } from '../../database/entities/review.entity';
import { Favorite } from '../../database/entities/favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Favorite])],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}
