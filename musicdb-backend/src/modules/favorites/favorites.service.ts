import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../../database/entities/favorite.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async toggleFavorite(userId: number, songId: number) {
    const favorite = await this.favoritesRepository.findOne({
      where: { user: { id: userId }, song: { id: songId } },
    });

    if (favorite) {
      await this.favoritesRepository.remove(favorite);
      return { liked: false };
    } else {
      const newFavorite = this.favoritesRepository.create({
        user: { id: userId },
        song: { id: songId },
      });
      await this.favoritesRepository.save(newFavorite);
      return { liked: true };
    }
  }

  async getUserFavorites(userId: number) {
    return this.favoritesRepository.find({
      where: { user: { id: userId } },
      relations: ['song', 'song.artist'],
      order: { created_at: 'DESC' },
    });
  }

  async updateVisibility(userId: number, isPublic: boolean) {
    await this.usersRepository.update(userId, {
      favorites_is_public: isPublic,
    });
    return { favorites_is_public: isPublic };
  }

  async isLiked(userId: number, songId: number) {
    const favorite = await this.favoritesRepository.findOne({
      where: { user: { id: userId }, song: { id: songId } },
    });
    return { liked: !!favorite };
  }
}
