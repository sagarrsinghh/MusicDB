import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ArtistsModule } from './modules/artists/artists.module';
import { SongsModule } from './modules/songs/songs.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { SpotifyModule } from './spotify/spotify.module';
import { User } from './database/entities/user.entity';
import { Artist } from './database/entities/artist.entity';
import { Song } from './database/entities/song.entity';
import { Favorite } from './database/entities/favorite.entity';
import { Review } from './database/entities/review.entity';
import { Rating } from './database/entities/rating.entity';
import { ReviewLike } from './database/entities/review-like.entity';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { CommunityModule } from './modules/community/community.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'musicdb',
      entities: [User, Artist, Song, Review, Rating, Favorite, ReviewLike],
      synchronize: true, // Auto-create tables (dev only)
    }),
    AuthModule,
    UsersModule,
    ArtistsModule,
    SongsModule,
    ReviewsModule,
    RatingsModule,
    SpotifyModule,
    FavoritesModule,
    CommunityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
