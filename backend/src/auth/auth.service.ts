import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SupabaseService } from '../shared/supabase/supabase.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { User, UserResponse } from './user.interface';

interface SupabaseUser {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string;
  created_at: string;
}

interface SupabaseAuthData {
  password_hash: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
  ) {}

  async signup(
    signupDto: SignupDto,
  ): Promise<{ token: string; refreshToken: string; user: UserResponse }> {
    const { firstName, lastName, email, phone, password, role } = signupDto;

    // Check if user already exists
    const existingUserResponse = await this.supabaseService
      .getClient()
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUserResponse.data) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user in database
    const fullName = `${firstName} ${lastName}`;
    const newUserResponse = await this.supabaseService
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

    if (newUserResponse.error || !newUserResponse.data) {
      throw new Error(
        `Failed to create user: ${newUserResponse.error?.message || 'Unknown error'}`,
      );
    }

    const typedNewUser = newUserResponse.data as SupabaseUser;

    // Store password hash separately (you might want to create a separate auth table for this)
    // For now, we'll store it in a simple way - in production, consider using Supabase Auth
    await this.supabaseService.getClient().from('user_auth').insert({
      user_id: typedNewUser.id,
      password_hash: hashedPassword,
    });

    // Generate tokens
    const payload = {
      sub: typedNewUser.id,
      email: typedNewUser.email,
      name: typedNewUser.name,
      role: typedNewUser.role,
      phone: typedNewUser.phone,
    };

    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign({ ...payload, type: 'refresh' }, { expiresIn: '7d' });

    // Store refresh token in database
    const updateResult = await this.supabaseService.getClient().from('user_auth').update({
      refresh_token: refreshToken,
      refresh_token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    }).eq('user_id', typedNewUser.id);

    if (updateResult.error) {
      console.error('Failed to store refresh token:', updateResult.error);
      // Don't throw error, just log it - user is already created
    }

    // Convert to UserResponse format
    const userResponse: UserResponse = {
      id: typedNewUser.id,
      firstName,
      lastName,
      email: typedNewUser.email,
      phone: typedNewUser.phone,
      role: typedNewUser.role as 'client' | 'performer' | 'admin',
      createdAt: typedNewUser.created_at,
      updatedAt: typedNewUser.created_at,
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

    // Get user from database
    const loginUserResponse = await this.supabaseService
      .getClient()
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (loginUserResponse.error || !loginUserResponse.data) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const typedUser = loginUserResponse.data as SupabaseUser;

    // Get password hash
    const { data: authData, error: authError } = await this.supabaseService
      .getClient()
      .from('user_auth')
      .select('password_hash')
      .eq('user_id', typedUser.id)
      .single();

    if (authError || !authData) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const typedAuthData = authData as SupabaseAuthData;

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      typedAuthData.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate tokens
    const payload = {
      sub: typedUser.id,
      email: typedUser.email,
      name: typedUser.name,
      role: typedUser.role,
      phone: typedUser.phone,
    };

    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign({ ...payload, type: 'refresh' }, { expiresIn: '7d' });

    // Store refresh token in database
    const updateResult = await this.supabaseService.getClient().from('user_auth').update({
      refresh_token: refreshToken,
      refresh_token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    }).eq('user_id', typedUser.id);

    if (updateResult.error) {
      console.error('Failed to store refresh token during login:', updateResult.error);
      // Don't throw error, just log it - allow login to continue
    }

    // Split name into firstName and lastName
    const nameParts = typedUser.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const userResponse: UserResponse = {
      id: typedUser.id,
      firstName,
      lastName,
      email: typedUser.email,
      phone: typedUser.phone,
      role: typedUser.role as 'client' | 'performer' | 'admin',
      createdAt: typedUser.created_at,
      updatedAt: typedUser.created_at,
    };

    return {
      token,
      refreshToken,
      user: userResponse,
    };
  }

  getCurrentUser(user: User): UserResponse {
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
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.created_at,
    };
  }

  async refreshToken(user: User): Promise<{ token: string; refreshToken: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
    };

    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign({ ...payload, type: 'refresh' }, { expiresIn: '7d' });

    // Store new refresh token in database
    const updateResult = await this.supabaseService.getClient().from('user_auth').update({
      refresh_token: refreshToken,
      refresh_token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    }).eq('user_id', user.id);

    if (updateResult.error) {
      console.error('Failed to store refresh token during token refresh:', updateResult.error);
    }

    return { token, refreshToken };
  }

  async logout(user: User): Promise<{ message: string }> {
    // Clear refresh token from database to prevent further token refresh
    await this.supabaseService.getClient()
      .from('user_auth')
      .update({
        refresh_token: null,
        refresh_token_expires_at: null
      })
      .eq('user_id', user.id);

    return { message: 'Logged out successfully' };
  }
}
