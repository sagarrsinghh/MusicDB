import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Rating } from '../../database/entities/rating.entity';
import { Review } from '../../database/entities/review.entity';
import { User } from '../../database/entities/user.entity';
import { Artist } from '../../database/entities/artist.entity';
import { Song } from '../../database/entities/song.entity';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

@Injectable()
export class BadgesService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUserBadges(userId: number): Promise<Badge[]> {
    const badges: Badge[] = [];

    // 1. Genre King Check
    const genreKing = await this.checkGenreKing(userId);
    if (genreKing) badges.push(genreKing);

    // 2. Trendsetter Check
    const trendsetter = await this.checkTrendsetter(userId);
    if (trendsetter) badges.push(trendsetter);

    // 3. Vocal Critic (10+ reviews)
    const reviewCount = await this.reviewsRepository.count({
      where: { user: { id: userId } },
    });
    if (reviewCount >= 10) {
      badges.push({
        id: 'vocal_critic',
        name: 'Vocal Critic',
        description: 'Wrote over 10 insightful reviews.',
        icon: '✍️',
        color: '#A855F7',
      });
    }

    // 4. Early Adopter (Joined in first 100 users)
    if (userId <= 100) {
      badges.push({
        id: 'pioneer',
        name: 'Pioneer',
        description: 'One of the first 100 members of MusicDB.',
        icon: '🚀',
        color: '#3B82F6',
      });
    }

    return badges;
  }

  private async checkGenreKing(userId: number): Promise<Badge | null> {
    // Find most frequent genre in user's high ratings (4 or 5)
    const highRatings = await this.ratingsRepository.find({
      where: { user: { id: userId }, value: In([4, 5]) },
      relations: ['song', 'song.artist'],
    });

    if (highRatings.length < 5) return null;

    const genreCounts: Record<string, number> = {};
    highRatings.forEach((r) => {
      const genres = r.song?.artist?.genres || [];
      genres.forEach((g) => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });

    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0];

    if (topGenre && topGenre[1] >= 5) {
      return {
        id: `genre_king_${topGenre[0].toLowerCase()}`,
        name: `${topGenre[0]} King`,
        description: `Expert in the ${topGenre[0]} genre with many high ratings.`,
        icon: '👑',
        color: '#F59E0B',
      };
    }

    return null;
  }

  private async checkTrendsetter(userId: number): Promise<Badge | null> {
    // Trendsetter: Rated a song early (among first 5 raters) that later became popular (>4.0 rating, >10 ratings)
    const userRatings = await this.ratingsRepository.find({
      where: { user: { id: userId } },
      relations: ['song'],
    });

    for (const rating of userRatings) {
      const song = rating.song;
      if (song.rating_count >= 10 && song.average_rating >= 4.0) {
        // Check if user was an early rater
        // Optimization: In a real app we'd query the rating index.
        // Here we'll just check if their created_at is among the first few for that song.
        const firstRatings = await this.ratingsRepository.find({
          where: { song: { id: song.id } },
          order: { created_at: 'ASC' },
          take: 5,
        });

        if (firstRatings.some((r) => r.id === rating.id)) {
          return {
            id: 'trendsetter',
            name: 'Trendsetter',
            description: 'Discovered high-rated songs before they were cool.',
            icon: '🔥',
            color: '#EF4444',
          };
        }
      }
    }

    return null;
  }
}
