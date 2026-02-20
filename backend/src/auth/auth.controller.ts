import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';
import { User } from './interfaces/user.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ClerkAuthGuard)
  @Get('me')
  getProfile(@Request() req: { user: User }) {
    return this.authService.getCurrentUser(req.user);
  }

  @UseGuards(ClerkAuthGuard)
  @Patch('me')
  async updateProfile(
    @Request() req: { user: User },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(req.user, dto);
  }
}
