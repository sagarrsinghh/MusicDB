import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../database/entities/review.entity';
import { Song } from '../../database/entities/song.entity';
import { User } from '../../database/entities/user.entity';
import { ReviewLike } from '../../database/entities/review-like.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
  ) {}

  async create(
    userId: number,
    createReviewDto: { songId: number; comment: string },
  ) {
    const { songId, comment } = createReviewDto;

    const review = this.reviewsRepository.create({
      comment,
      user: { id: userId } as User,
      song: { id: songId } as Song,
    });

    return this.reviewsRepository.save(review);
  }

  findAll() {
    return this.reviewsRepository.find({ relations: ['user', 'song'] });
  }

  findBySong(songId: number) {
    return this.reviewsRepository.find({
      where: { song: { id: songId } },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  findByUser(userId: number) {
    return this.reviewsRepository.find({
      where: { user: { id: userId } },
      relations: ['song', 'song.artist'],
      order: { created_at: 'DESC' },
    });
  }

  async toggleLike(userId: number, reviewId: number) {
    const existing = await this.reviewsRepository.manager.findOne(ReviewLike, {
      where: { user: { id: userId }, review: { id: reviewId } },
    });

    if (existing) {
      await this.reviewsRepository.manager.remove(existing);
      return { liked: false };
    } else {
      const like = this.reviewsRepository.manager.create(ReviewLike, {
        user: { id: userId } as User,
        review: { id: reviewId } as Review,
      });
      await this.reviewsRepository.manager.save(like);
      return { liked: true };
    }
  }

  async getLikesCount(reviewId: number) {
    return this.reviewsRepository.manager.count(ReviewLike, {
      where: { review: { id: reviewId } },
    });
  }

  async getGlobalLikes() {
    return this.reviewsRepository.manager.find(ReviewLike, {
      relations: ['user', 'review', 'review.song', 'review.song.artist'],
      order: { created_at: 'DESC' },
      take: 15,
    });
  }
}
