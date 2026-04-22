import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('toggle/:songId')
  toggleFavorite(@Request() req, @Param('songId') songId: string) {
    return this.favoritesService.toggleFavorite(req.user.userId, +songId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserFavorites(@Request() req) {
    return this.favoritesService.getUserFavorites(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check/:songId')
  isLiked(@Request() req, @Param('songId') songId: string) {
    return this.favoritesService.isLiked(req.user.userId, +songId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('visibility')
  updateVisibility(@Request() req, @Body('isPublic') isPublic: boolean) {
    return this.favoritesService.updateVisibility(req.user.userId, isPublic);
  }
}
