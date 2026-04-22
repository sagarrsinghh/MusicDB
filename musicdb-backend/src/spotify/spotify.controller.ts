import { Controller, Get, Query, Param } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('search')
  search(@Query('q') query: string) {
    return this.spotifyService.searchTracks(query);
  }

  @Get('track/:id')
  getTrack(@Param('id') id: string) {
    return this.spotifyService.getTrack(id);
  }

  @Get('artist/:id')
  getArtist(@Param('id') id: string) {
    return this.spotifyService.getArtist(id);
  }
}
