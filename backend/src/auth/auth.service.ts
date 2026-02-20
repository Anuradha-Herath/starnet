import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { User, UserResponse } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signup(
    signupDto: SignupDto,
  ): Promise<{ token: string; refreshToken: string; user: UserResponse }> {
    const { firstName, lastName, email, phone, password, role } = signupDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const fullName = `${firstName} ${lastName}`;
    const newUser = await this.prisma.user.create({
      data: {
        email,
        name: fullName,
        role,
        phone,
      },
    });

    await this.prisma.userAuth.create({
      data: {
        userId: newUser.id,
        passwordHash: hashedPassword,
        refreshToken: null,
        refreshTokenExpiresAt: null,
      },
    });

    const payload = {
      sub: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      phone: newUser.phone,
    };

    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      { expiresIn: '7d' },
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.prisma.userAuth.update({
      where: { userId: newUser.id },
      data: {
        refreshToken,
        refreshTokenExpiresAt: expiresAt,
      },
    });

    const userResponse: UserResponse = {
      id: newUser.id,
      firstName,
      lastName,
      email: newUser.email,
      phone: newUser.phone ?? '',
      role: newUser.role as 'client' | 'performer' | 'admin',
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString(),
    };

    return {
      token,
      refreshToken,
      user: userResponse,
    };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ token: string; refreshToken: string; user: UserResponse }> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { auth: true },
    });

    if (!user || !user.auth) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.auth.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
    };

    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      { expiresIn: '7d' },
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.prisma.userAuth.update({
      where: { userId: user.id },
      data: {
        refreshToken,
        refreshTokenExpiresAt: expiresAt,
      },
    });

    const nameParts = user.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const userResponse: UserResponse = {
      id: user.id,
      firstName,
      lastName,
      email: user.email,
      phone: user.phone ?? '',
      role: user.role as 'client' | 'performer' | 'admin',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return {
      token,
      refreshToken,
      user: userResponse,
    };
  }

  getCurrentUser(user: User): UserResponse {
    const nameParts = user.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      id: user.id,
      firstName,
      lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.created_at,
    };
  }

  async refreshToken(
    user: User,
  ): Promise<{ token: string; refreshToken: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
    };

    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      { expiresIn: '7d' },
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.prisma.userAuth.updateMany({
      where: { userId: user.id },
      data: {
        refreshToken,
        refreshTokenExpiresAt: expiresAt,
      },
    });

    return { token, refreshToken };
  }

  async logout(user: User): Promise<{ message: string }> {
    await this.prisma.userAuth.updateMany({
      where: { userId: user.id },
      data: {
        refreshToken: null,
        refreshTokenExpiresAt: null,
      },
    });

    return { message: 'Logged out successfully' };
  }
}
