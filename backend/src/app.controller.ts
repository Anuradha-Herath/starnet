import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MongodbService } from './mongodb.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mongodbService: MongodbService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-db')
  async testDatabaseConnection() {
    try {
      const isConnected = await this.mongodbService.testConnection();
      if (!isConnected) {
        return { status: 'error', message: 'Database not connected' };
      }
      return {
        status: 'success',
        message: 'Database connection is working!',
        connectionState: 'connected',
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { status: 'error', message: err.message };
      } else {
        return { status: 'error', message: 'Unknown error' };
      }
    }
  }
}
