import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ClerkAuthGuard } from '../guards/clerk-auth.guard';
import { CurrentUser, UserId } from '../decorators/clerk.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(ClerkAuthGuard)
  async getCurrentUser(@UserId() userId: string, @CurrentUser() auth: any) {
    // Get user from database
    const user = await this.usersService.findByClerkId(userId);
    
    return {
      user,
      clerkAuth: auth,
    };
  }
}
