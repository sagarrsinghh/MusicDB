import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../database/entities/review.entity';
import { Favorite } from '../../database/entities/favorite.entity';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
  ) {}

  async getGlobalFeed() {
    // Fetch recent reviews
    const reviews = await this.reviewsRepository.find({
      relations: ['user', 'song', 'song.artist'],
      order: { created_at: 'DESC' },
      take: 15,
    });

    // Fetch recent favorites
    const favorites = await this.favoritesRepository.find({
      relations: ['user', 'song', 'song.artist'],
      order: { created_at: 'DESC' },
      take: 15,
    });

    // Combine and sort by date
    const feed = [
      ...reviews.map((r) => ({
        id: `review-${r.id}`,
        type: 'review',
        user: r.user,
        song: r.song,
        content: r.comment,
        timestamp: r.created_at,
      })),
      ...favorites.map((f) => ({
        id: `fav-${f.id}`,
        type: 'favorite',
        user: f.user,
        song: f.song,
        timestamp: f.created_at,
      })),
    ].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    return feed.slice(0, 25);
  }
}
