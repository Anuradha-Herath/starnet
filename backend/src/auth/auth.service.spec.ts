import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../shared/supabase/supabase.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { User } from './user.interface';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let supabaseService: SupabaseService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockSupabaseService = {
    getClient: jest.fn().mockReturnValue({
      from: jest.fn().mockImplementation((table: string) => ({
        select: jest.fn().mockImplementation((fields?: string) => ({
          eq: jest.fn().mockImplementation((field: string, value: any) => ({
            single: jest.fn().mockResolvedValue({ data: null, error: null }),
          })),
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        })),
        insert: jest.fn().mockImplementation((data: any) => ({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        })),
        update: jest.fn().mockImplementation((data: any) => ({
          eq: jest.fn().mockImplementation((field: string, value: any) => 
            Promise.resolve({ error: null })
          ),
        })),
      })),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: SupabaseService, useValue: mockSupabaseService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should create a new user successfully', async () => {
      const signupDto: SignupDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        password: 'password123',
        role: 'client',
      };

      const mockUser = {
        id: 'user-id',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'client',
        phone: '1234567890',
        created_at: new Date().toISOString(),
      };

      const client = mockSupabaseService.getClient();
      client.from.mockImplementation((table: string) => {
        if (table === 'users') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: null, error: null }),
              }),
            }),
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
              }),
            }),
          };
        } else if (table === 'user_auth') {
          return {
            insert: jest.fn().mockResolvedValue({ error: null }),
            update: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({ error: null }),
            }),
          };
        }
        return {};
      });

      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await service.signup(signupDto);

      expect(result).toHaveProperty('token', 'access-token');
      expect(result).toHaveProperty('refreshToken', 'refresh-token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('john@example.com');
    });

    it('should throw ConflictException if user already exists', async () => {
      const signupDto: SignupDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        phone: '1234567890',
        password: 'password123',
        role: 'client',
      };

      const client = mockSupabaseService.getClient();
      client.from.mockImplementation((table: string) => {
        if (table === 'users') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { id: 'existing-id' }, error: null }),
              }),
            }),
          };
        }
        return {};
      });

      await expect(service.signup(signupDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 'user-id',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'client',
        phone: '1234567890',
        created_at: new Date().toISOString(),
      };

      const mockAuthData = {
        password_hash: '$2a$12$hashedpassword', // Mock bcrypt hash
      };

      const client = mockSupabaseService.getClient();
      client.from.mockImplementation((table: string) => {
        if (table === 'users') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
              }),
            }),
          };
        } else if (table === 'user_auth') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: mockAuthData, error: null }),
              }),
            }),
            update: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({ error: null }),
            }),
          };
        }
        return {};
      });

      // Mock bcrypt.compare to return true
      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(true);

      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('token', 'access-token');
      expect(result).toHaveProperty('refreshToken', 'refresh-token');
      expect(result).toHaveProperty('user');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'wrong@example.com',
        password: 'wrongpass',
      };

      const client = mockSupabaseService.getClient();
      client.from.mockImplementation((table: string) => {
        if (table === 'users') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: null, error: null }),
              }),
            }),
          };
        }
        return {};
      });

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const user: User = {
        id: 'user-id',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'client',
        phone: '1234567890',
        created_at: new Date().toISOString(),
      };

      const client = mockSupabaseService.getClient();
      client.from.mockImplementation((table: string) => {
        if (table === 'user_auth') {
          return {
            update: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({ error: null }),
            }),
          };
        }
        return {};
      });

      mockJwtService.sign.mockClear();
      mockJwtService.sign
        .mockReturnValueOnce('new-access-token')
        .mockReturnValueOnce('new-refresh-token');

      const result = await service.refreshToken(user);

      expect(result).toHaveProperty('token', 'new-access-token');
      expect(result).toHaveProperty('refreshToken', 'new-refresh-token');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user data', () => {
      const user: User = {
        id: 'user-id',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'client',
        phone: '1234567890',
        created_at: new Date().toISOString(),
      };

      const result = service.getCurrentUser(user);

      expect(result).toHaveProperty('id', 'user-id');
      expect(result).toHaveProperty('email', 'john@example.com');
      expect(result).toHaveProperty('firstName', 'John');
      expect(result).toHaveProperty('lastName', 'Doe');
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const user: User = {
        id: 'user-id',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'client',
        phone: '1234567890',
        created_at: new Date().toISOString(),
      };

      const client = mockSupabaseService.getClient();
      client.from.mockImplementation((table: string) => {
        if (table === 'user_auth') {
          return {
            update: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({ error: null }),
            }),
          };
        }
        return {};
      });

      const result = await service.logout(user);

      expect(result).toHaveProperty('message', 'Logged out successfully');
    });
  });
});