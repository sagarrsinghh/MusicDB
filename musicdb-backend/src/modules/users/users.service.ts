import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../database/entities/user.entity';
import { Artist } from '../../database/entities/artist.entity';
import { Song } from '../../database/entities/song.entity';
import { BadgesService } from './badges.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
    private badgesService: BadgesService,
  ) {}

  async getProfile(userId: number) {
    const user = await this.findById(userId);
    if (!user) return null;

    const badges = await this.badgesService.getUserBadges(userId);
    return {
      ...user,
      badges,
    };
  }

  async getSystemStats() {
    const totalUsers = await this.usersRepository.count();
    const totalArtists = await this.artistsRepository.count();
    const totalSongs = await this.songsRepository.count();
    // For reviews, we can count total reviews across all songs if we don't have a direct review repo injected here.
    // Or better, we can query the review table directly if we had the entity.
    // For MVP simplicity, let's just count users, artists, songs.

    return {
      totalUsers,
      totalArtists,
      totalSongs,
    };
  }

  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['followed_artists'],
    });
  }

  async create(user: Partial<User>): Promise<User> {
    try {
      const userCount = await this.usersRepository.count();
      if (userCount === 0) {
        user.role = UserRole.ADMIN;
      }

      // Proactive: Also check for potential ADMIN_EMAIL env var
      if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL) {
        user.role = UserRole.ADMIN;
      }

      const newUser = this.usersRepository.create(user);
      return await this.usersRepository.save(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateProfile(
    userId: number,
    updateData: { name?: string; bio?: string; profile_image?: string },
  ) {
    await this.usersRepository.update(userId, updateData);
    return this.findById(userId);
  }

  async followArtist(userId: number, artistId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['followed_artists'],
    });

    if (!user) throw new Error('User not found');

    // Check if already following
    const isFollowing = user.followed_artists.some((a) => a.id === artistId);
    if (!isFollowing) {
      // We need to fetch the artist entity properly, but for now we can rely on TypeORM handling id references if we pass object-like structure
      // However, cleaner way is to load artist. Let's assume we can push an object with ID.
      user.followed_artists.push({ id: artistId } as any);
      await this.usersRepository.save(user);
    }
    return user;
  }

  async unfollowArtist(userId: number, artistId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['followed_artists'],
    });

    if (!user) throw new Error('User not found');

    user.followed_artists = user.followed_artists.filter(
      (a) => a.id !== artistId,
    );
    await this.usersRepository.save(user);
    return user;
  }

  async getFollowedArtists(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['followed_artists'],
    });
    return user ? user.followed_artists : [];
  }
}
