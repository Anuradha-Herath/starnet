import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

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
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: RefreshTokenPayload) {
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const auth = await this.prisma.userAuth.findUnique({
      where: { userId: payload.sub },
      select: { refreshTokenExpiresAt: true },
    });

    if (!auth) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const now = new Date();
    const expiresAt = auth.refreshTokenExpiresAt;
    if (!expiresAt || now > expiresAt) {
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
