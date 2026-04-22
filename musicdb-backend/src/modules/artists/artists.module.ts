import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { Artist } from '../../database/entities/artist.entity';
import { SpotifyModule } from '../../spotify/spotify.module';

@Module({
  imports: [TypeOrmModule.forFeature([Artist]), SpotifyModule],
  providers: [ArtistsService],
  controllers: [ArtistsController],
  exports: [ArtistsService],
})
export class ArtistsModule {}
