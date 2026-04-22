import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { Song } from '../../database/entities/song.entity';
import { Artist } from '../../database/entities/artist.entity';
import { SpotifyModule } from '../../spotify/spotify.module';
import { ArtistsModule } from '../artists/artists.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Song, Artist]),
    SpotifyModule,
    ArtistsModule,
  ],
  providers: [SongsService],
  controllers: [SongsController],
  exports: [SongsService],
})
export class SongsModule {}
