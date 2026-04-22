import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  SetMetadata,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../../database/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateProfile(
    @Request() req,
    @Body() body: { bio?: string; profile_image?: string },
  ) {
    return this.usersService.updateProfile(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('follow/:artistId')
  followArtist(@Request() req, @Param('artistId') artistId: string) {
    return this.usersService.followArtist(req.user.userId, +artistId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unfollow/:artistId')
  unfollowArtist(@Request() req, @Param('artistId') artistId: string) {
    return this.usersService.unfollowArtist(req.user.userId, +artistId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('following')
  getFollowing(@Request() req) {
    return this.usersService.getFollowedArtists(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.ADMIN])
  @Get('admin/stats')
  getSystemStats() {
    return this.usersService.getSystemStats();
  }
}
