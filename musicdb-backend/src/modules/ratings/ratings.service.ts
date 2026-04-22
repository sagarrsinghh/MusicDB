import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../../database/entities/rating.entity';
import { Song } from '../../database/entities/song.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
  ) {}

  async create(
    userId: number,
    createRatingDto: { songId: number; value: number },
  ) {
    const { songId, value } = createRatingDto;

    // 1. Check if rating already exists
    let rating = await this.ratingsRepository.findOne({
      where: { user: { id: userId }, song: { id: songId } },
    });

    if (rating) {
      rating.value = value;
    } else {
      rating = this.ratingsRepository.create({
        value,
        user: { id: userId } as User,
        song: { id: songId } as Song,
      });
    }

    await this.ratingsRepository.save(rating);

    // 2. Update Song Average Rating
    await this.updateSongRating(songId);

    return rating;
  }

  async updateSongRating(songId: number) {
    const ratings = await this.ratingsRepository.find({
      where: { song: { id: songId } },
    });
    const total = ratings.reduce((acc, r) => acc + r.value, 0);
    const average = total / ratings.length;

    await this.songsRepository.update(songId, {
      average_rating: parseFloat(average.toFixed(2)),
      rating_count: ratings.length,
    });
  }

  findAll() {
    return this.ratingsRepository.find({ relations: ['user', 'song'] });
  }

  findBySong(songId: number) {
    return this.ratingsRepository.find({
      where: { song: { id: songId } },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  findByUser(userId: number) {
    return this.ratingsRepository.find({
      where: { user: { id: userId } },
      relations: ['song', 'song.artist'],
      order: { created_at: 'DESC' },
    });
  }
}
