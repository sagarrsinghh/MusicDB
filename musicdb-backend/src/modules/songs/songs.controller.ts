import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  async findAll() {
    return this.songsService.findAll();
  }

  @Get('search')
  async search(@Query('q') query: string) {
    if (!query) return [];
    return this.songsService.search(query);
  }

  @Get('top')
  async getTopRated() {
    return this.songsService.findAllTopRated();
  }

  @Get('top50')
  async getTop50() {
    return this.songsService.getTop50();
  }

  @Get('trending')
  async getTrending() {
    return this.songsService.getTrending();
  }

  @Get('playable')
  async getPlayable() {
    return this.songsService.findPlayable();
  }

  @Get('genre/:genre')
  async getByGenre(@Param('genre') genre: string) {
    return this.songsService.findByGenre(genre);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const song = await this.songsService.findOne(+id);
    if (!song) {
      throw new NotFoundException('Song not found');
    }
    return song;
  }
}
