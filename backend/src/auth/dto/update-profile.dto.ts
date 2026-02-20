import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsIn(['client', 'performer'])
  role?: 'client' | 'performer';

  @IsOptional()
  @IsString()
  phone?: string;
}
