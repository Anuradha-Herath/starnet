import { Module } from '@nestjs/common';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  exports: [SupabaseModule],
})
export class SharedModule {}
