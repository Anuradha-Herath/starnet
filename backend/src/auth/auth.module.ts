import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ClerkAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
