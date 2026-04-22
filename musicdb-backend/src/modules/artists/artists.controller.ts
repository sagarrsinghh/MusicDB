import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ArtistsService } from './artists.service';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  async findAll() {
    return this.artistsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const artist = await this.artistsService.getFullProfile(id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }
}
