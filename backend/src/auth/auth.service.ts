import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { User, UserResponse } from './user.interface';
import { User as UserDocument, UserDocument as UserDocumentType } from '../schemas/user.schema';
import { UserAuth, UserAuthDocument } from '../schemas/user-auth.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(UserDocument.name) private userModel: Model<UserDocumentType>,
    @InjectModel(UserAuth.name) private userAuthModel: Model<UserAuthDocument>,
  ) {}

  async signup(
    signupDto: SignupDto,
  ): Promise<{ token: string; refreshToken: string; user: UserResponse }> {
    const { firstName, lastName, email, phone, password, role } = signupDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email }).exec();

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user in database
    const fullName = `${firstName} ${lastName}`;
    const newUser = await this.userModel.create({
      email,
      name: fullName,
      role,
      phone,
    });

    // Store password hash separately
    await this.userAuthModel.create({
      user_id: newUser._id,
      password_hash: hashedPassword,
    });

    // Generate tokens
    const payload = {
      sub: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      phone: newUser.phone,
    };

    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Convert to UserResponse format
    const userResponse: UserResponse = {
      id: newUser._id.toString(),
      firstName,
      lastName,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role as 'client' | 'performer' | 'admin',
      createdAt: newUser.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: newUser.updatedAt?.toISOString() || new Date().toISOString(),
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
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Get password hash
    const authData = await this.userAuthModel
      .findOne({ user_id: user._id })
      .exec();

    if (!authData) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      authData.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate tokens
    const payload = {
      sub: user._id.toString(),
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
      id: user._id.toString(),
      firstName,
      lastName,
      email: user.email,
      phone: user.phone,
      role: user.role as 'client' | 'performer' | 'admin',
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
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

  refreshToken(user: User): { token: string } {
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
