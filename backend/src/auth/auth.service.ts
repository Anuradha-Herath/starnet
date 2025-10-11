import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
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
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
  ) {}

  async signup(
    signupDto: SignupDto,
  ): Promise<{ token: string; refreshToken: string; user: UserResponse }> {
    try {
      const { firstName, lastName, email, phone, password, role } = signupDto;

      // Check if user already exists
      const existingUserResponse = await this.supabaseService
        .getClient()
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUserResponse.data) {
        throw new ConflictException('An account with this email already exists. Please try logging in instead.');
      }

      if (existingUserResponse.error && existingUserResponse.error.code !== 'PGRST116') {
        this.logger.error(`Database error checking existing user: ${existingUserResponse.error.message}`, existingUserResponse.error);
        throw new InternalServerErrorException('Unable to process signup request. Please try again later.');
      }

      // Hash password
      let hashedPassword: string;
      try {
        hashedPassword = await bcrypt.hash(password, 12);
      } catch (error) {
        this.logger.error('Password hashing failed', error);
        throw new InternalServerErrorException('Unable to process signup request. Please try again later.');
      }

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
        this.logger.error(`Failed to create user: ${newUserResponse.error?.message}`, newUserResponse.error);
        throw new InternalServerErrorException('Account creation failed. Please try again later.');
      }

      const typedNewUser = newUserResponse.data as SupabaseUser;

      // Store password hash separately
      const authInsertResponse = await this.supabaseService.getClient().from('user_auth').insert({
        user_id: typedNewUser.id,
        password_hash: hashedPassword,
      });

      if (authInsertResponse.error) {
        this.logger.error(`Failed to store password hash: ${authInsertResponse.error.message}`, authInsertResponse.error);
        // Rollback user creation
        await this.supabaseService.getClient().from('users').delete().eq('id', typedNewUser.id);
        throw new InternalServerErrorException('Account creation failed. Please try again later.');
      }

      // Generate tokens
      const payload = {
        sub: typedNewUser.id,
        email: typedNewUser.email,
        name: typedNewUser.name,
        role: typedNewUser.role,
        phone: typedNewUser.phone,
      };

      let token: string;
      let refreshToken: string;
      try {
        token = this.jwtService.sign(payload);
        refreshToken = this.jwtService.sign(
          { ...payload, type: 'refresh' },
          { expiresIn: '7d' },
        );
      } catch (error) {
        this.logger.error('Token generation failed', error);
        // Cleanup created user
        await this.supabaseService.getClient().from('users').delete().eq('id', typedNewUser.id);
        await this.supabaseService.getClient().from('user_auth').delete().eq('user_id', typedNewUser.id);
        throw new InternalServerErrorException('Account creation failed. Please try again later.');
      }

      // Store refresh token in database
      const updateResult = await this.supabaseService
        .getClient()
        .from('user_auth')
        .update({
          refresh_token: refreshToken,
          refresh_token_expires_at: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        })
        .eq('user_id', typedNewUser.id);

      if (updateResult.error) {
        this.logger.warn(`Failed to store refresh token: ${updateResult.error.message}`, updateResult.error);
        // Don't fail signup, just log warning
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

      this.logger.log(`User ${email} signed up successfully`);
      return {
        token,
        refreshToken,
        user: userResponse,
      };
    } catch (error) {
      // Re-throw known exceptions
      if (error instanceof ConflictException || error instanceof InternalServerErrorException) {
        throw error;
      }
      // Log unexpected errors
      this.logger.error('Unexpected error during signup', error);
      throw new InternalServerErrorException('An unexpected error occurred. Please try again later.');
    }
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ token: string; refreshToken: string; user: UserResponse }> {
    try {
      const { email, password } = loginDto;

      // Get user from database
      const loginUserResponse = await this.supabaseService
        .getClient()
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (loginUserResponse.error) {
        if (loginUserResponse.error.code === 'PGRST116') {
          // User not found
          throw new UnauthorizedException('Invalid email or password');
        }
        this.logger.error(`Database error fetching user: ${loginUserResponse.error.message}`, loginUserResponse.error);
        throw new InternalServerErrorException('Login failed. Please try again later.');
      }

      if (!loginUserResponse.data) {
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

      if (authError) {
        if (authError.code === 'PGRST116') {
          throw new UnauthorizedException('Invalid email or password');
        }
        this.logger.error(`Database error fetching auth data: ${authError.message}`, authError);
        throw new InternalServerErrorException('Login failed. Please try again later.');
      }

      if (!authData) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const typedAuthData = authData as SupabaseAuthData;

      // Verify password
      let isPasswordValid: boolean;
      try {
        isPasswordValid = await bcrypt.compare(password, typedAuthData.password_hash);
      } catch (error) {
        this.logger.error('Password verification failed', error);
        throw new InternalServerErrorException('Login failed. Please try again later.');
      }

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

      let token: string;
      let refreshToken: string;
      try {
        token = this.jwtService.sign(payload);
        refreshToken = this.jwtService.sign(
          { ...payload, type: 'refresh' },
          { expiresIn: '7d' },
        );
      } catch (error) {
        this.logger.error('Token generation failed during login', error);
        throw new InternalServerErrorException('Login failed. Please try again later.');
      }

      // Store refresh token in database
      const updateResult = await this.supabaseService
        .getClient()
        .from('user_auth')
        .update({
          refresh_token: refreshToken,
          refresh_token_expires_at: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        })
        .eq('user_id', typedUser.id);

      if (updateResult.error) {
        this.logger.warn(`Failed to store refresh token during login: ${updateResult.error.message}`, updateResult.error);
        // Allow login to continue
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

      this.logger.log(`User ${email} logged in successfully`);
      return {
        token,
        refreshToken,
        user: userResponse,
      };
    } catch (error) {
      // Re-throw known exceptions
      if (error instanceof UnauthorizedException || error instanceof InternalServerErrorException) {
        throw error;
      }
      // Log unexpected errors
      this.logger.error('Unexpected error during login', error);
      throw new InternalServerErrorException('An unexpected error occurred. Please try again later.');
    }
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

    // Store new refresh token in database
    const updateResult = await this.supabaseService
      .getClient()
      .from('user_auth')
      .update({
        refresh_token: refreshToken,
        refresh_token_expires_at: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 7 days
      })
      .eq('user_id', user.id);

    if (updateResult.error) {
      console.error(
        'Failed to store refresh token during token refresh:',
        updateResult.error,
      );
    }

    return { token, refreshToken };
  }

  async logout(user: User): Promise<{ message: string }> {
    // Clear refresh token from database to prevent further token refresh
    await this.supabaseService
      .getClient()
      .from('user_auth')
      .update({
        refresh_token: null,
        refresh_token_expires_at: null,
      })
      .eq('user_id', user.id);

    return { message: 'Logged out successfully' };
  }
}
