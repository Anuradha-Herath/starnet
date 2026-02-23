import { Controller, Get, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ClerkAuthGuard } from '../guards/clerk-auth.guard';
import { CurrentUser, UserId } from '../decorators/clerk.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(ClerkAuthGuard)
  async getCurrentUser(@UserId() userId: string, @CurrentUser() auth: any) {
    const user = await this.usersService.findByClerkId(userId);
    return { user, clerkAuth: auth };
  }

  @Post('role')
  @UseGuards(ClerkAuthGuard)
  async setRole(
    @UserId() userId: string,
    @Body() body: { role: string },
  ) {
    const { role } = body;
    if (!role || !['client', 'performer', 'admin'].includes(role)) {
      throw new BadRequestException('Invalid role. Must be client, performer, or admin.');
    }
    const user = await this.usersService.setUserRole(userId, role);
    return { success: true, role, user };
  }
}
