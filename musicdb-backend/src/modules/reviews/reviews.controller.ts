import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req,
    @Body() createReviewDto: { songId: number; comment: string },
  ) {
    return this.reviewsService.create(req.user.userId, createReviewDto);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('song/:id')
  findBySong(@Param('id') id: string) {
    return this.reviewsService.findBySong(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async findByUser(@Request() req) {
    return await this.reviewsService.findByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async toggleLike(@Request() req, @Param('id') id: string) {
    return this.reviewsService.toggleLike(req.user.userId, +id);
  }
}
