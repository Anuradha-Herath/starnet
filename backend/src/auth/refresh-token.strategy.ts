import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SupabaseService } from '../shared/supabase/supabase.service';

interface RefreshTokenPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  phone: string;
  type: 'refresh';
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(private supabaseService: SupabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: RefreshTokenPayload) {
    // Verify this is a refresh token
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    // Check if refresh token exists in database and is not expired
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_auth')
      .select('user_id, refresh_token_expires_at')
      .eq('user_id', payload.sub)
      .single();

    if (error || !data) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if token is expired in database
    const now = new Date();
    const expiresAt = new Date(data.refresh_token_expires_at as string);
    if (now > expiresAt) {
      throw new UnauthorizedException('Refresh token expired');
    }

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      phone: payload.phone,
    };
  }
}
