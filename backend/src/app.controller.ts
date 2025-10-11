import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SupabaseService } from './shared/supabase/supabase.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-db')
  async testDatabaseConnection() {
    try {
      // Simple test: Try to select from a table (adjust 'users' if your table name differs)
      const { data, error } = await this.supabaseService
        .getClient()
        .from('users')
        .select('*')
        .limit(1);
      if (error) {
        return { status: 'error', message: error.message };
      }
      return {
        status: 'success',
        message: 'Database connection is working!',
        data,
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
