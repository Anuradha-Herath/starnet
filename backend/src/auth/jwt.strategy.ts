import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './user.interface';

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  phone: string;
  created_at: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  validate(payload: JwtPayload): User {
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role as 'client' | 'performer' | 'admin',
      phone: payload.phone,
      created_at: payload.created_at,
    };
  }
}
