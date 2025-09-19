import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SupabaseService } from '../supabase.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { User, UserResponse } from './user.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
  ) {}

  async signup(signupDto: SignupDto): Promise<{ token: string; refreshToken: string; user: UserResponse }> {
    const { firstName, lastName, email, phone, password, role } = signupDto;

    // Check if user already exists
    const { data: existingUser } = await this.supabaseService
      .getClient()
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user in database
    const fullName = `${firstName} ${lastName}`;
    const { data: newUser, error } = await this.supabaseService
      .getClient()
      .from('users')
      .insert({
        email,
        name: fullName,
        role,
        phone,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    // Store password hash separately (you might want to create a separate auth table for this)
    // For now, we'll store it in a simple way - in production, consider using Supabase Auth
    await this.supabaseService
      .getClient()
      .from('user_auth')
      .insert({
        user_id: newUser.id,
        password_hash: hashedPassword,
      });

    // Generate tokens
    const payload = {
      sub: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      phone: newUser.phone,
    };

    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Convert to UserResponse format
    const userResponse: UserResponse = {
      id: newUser.id,
      firstName,
      lastName,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role as 'client' | 'performer' | 'admin',
      createdAt: newUser.created_at,
      updatedAt: newUser.created_at,
    };

    return {
      token,
      refreshToken,
      user: userResponse,
    };
  }

  async login(loginDto: LoginDto): Promise<{ token: string; refreshToken: string; user: UserResponse }> {
    const { email, password } = loginDto;

    // Get user from database
    const { data: user, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Get password hash
    const { data: authData, error: authError } = await this.supabaseService
      .getClient()
      .from('user_auth')
      .select('password_hash')
      .eq('user_id', user.id)
      .single();

    if (authError || !authData) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, authData.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate tokens
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
    };

    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Split name into firstName and lastName
    const nameParts = user.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const userResponse: UserResponse = {
      id: user.id,
      firstName,
      lastName,
      email: user.email,
      phone: user.phone,
      role: user.role as 'client' | 'performer' | 'admin',
      createdAt: user.created_at,
      updatedAt: user.created_at,
    };

    return {
      token,
      refreshToken,
      user: userResponse,
    };
  }

  async getCurrentUser(user: User): Promise<UserResponse> {
    // Split name into firstName and lastName
    const nameParts = user.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      id: user.id,
      firstName,
      lastName,
      email: user.email,
      phone: user.phone,
      role: user.role as 'client' | 'performer' | 'admin',
      createdAt: user.created_at,
      updatedAt: user.created_at,
    };
  }

  async refreshToken(user: User): Promise<{ token: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
    };

    const token = this.jwtService.sign(payload);
    return { token };
  }
}