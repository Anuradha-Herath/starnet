import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-db')
  async testDatabaseConnection() {
    try {
      const users = await this.prisma.user.findMany({ take: 1 });
      return {
        status: 'success',
        message: 'Database connection is working!',
        data: users,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { status: 'error', message: err.message };
      }
      return { status: 'error', message: 'Unknown error' };
    }
  }
}
