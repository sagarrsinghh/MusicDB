import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req,
    @Body() createRatingDto: { songId: number; value: number },
  ) {
    return this.ratingsService.create(req.user.userId, createRatingDto);
  }

  @Get()
  findAll() {
    return this.ratingsService.findAll();
  }

  @Get('song/:id')
  findBySong(@Param('id') id: string) {
    return this.ratingsService.findBySong(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findByUser(@Request() req) {
    return this.ratingsService.findByUser(req.user.userId);
  }
}
