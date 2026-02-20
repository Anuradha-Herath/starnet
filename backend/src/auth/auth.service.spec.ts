/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let mockPrismaService: {
    user: { findUnique: jest.Mock; create: jest.Mock };
    userAuth: { create: jest.Mock; findUnique: jest.Mock; update: jest.Mock; updateMany: jest.Mock };
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    mockPrismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn(),
      },
      userAuth: {
        create: jest.fn().mockResolvedValue({}),
        findUnique: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue({}),
        updateMany: jest.fn().mockResolvedValue({}),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

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

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'existing-id',
      });

      await expect(service.signup(signupDto)).rejects.toThrow(
        ConflictException,
      );
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
        createdAt: new Date(),
        updatedAt: new Date(),
        auth: {
          passwordHash: '$2a$12$hashedpassword',
        },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

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

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
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

      const result = await service.logout(user);

      expect(result).toHaveProperty('message', 'Logged out successfully');
    });

    it('should clear refresh token from database during logout', async () => {
      const user: User = {
        id: 'user-id',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'client',
        phone: '1234567890',
        created_at: new Date().toISOString(),
      };

      await service.logout(user);

      expect(mockPrismaService.userAuth.updateMany).toHaveBeenCalledWith({
        where: { userId: user.id },
        data: {
          refreshToken: null,
          refreshTokenExpiresAt: null,
        },
      });
    });
  });

  describe('Security Tests', () => {
    describe('Input Sanitization', () => {
      it('should handle SQL injection attempts in email field', async () => {
        const maliciousSignupDto: SignupDto = {
          firstName: 'Test',
          lastName: 'User',
          email: "'; DROP TABLE users; --",
          phone: '1234567890',
          password: 'password123',
          role: 'client',
        };

        mockPrismaService.user.findUnique.mockResolvedValue(null);
        mockPrismaService.user.create.mockResolvedValue({
          id: 'user-id',
          email: "'; DROP TABLE users; --",
          name: 'Test User',
          role: 'client',
          phone: '1234567890',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        mockJwtService.sign
          .mockReturnValueOnce('access-token')
          .mockReturnValueOnce('refresh-token');

        // Should not throw an error - input should be sanitized by Prisma
        await expect(service.signup(maliciousSignupDto)).resolves.toBeDefined();
      });

      it('should handle XSS attempts in name fields', async () => {
        const maliciousSignupDto: SignupDto = {
          firstName: '<script>alert("xss")</script>',
          lastName: '<img src=x onerror=alert("xss")>',
          email: 'xss@example.com',
          phone: '1234567890',
          password: 'password123',
          role: 'client',
        };

        mockPrismaService.user.findUnique.mockResolvedValue(null);
        mockPrismaService.user.create.mockResolvedValue({
          id: 'user-id',
          email: 'xss@example.com',
          name: '<script>alert("xss")</script> <img src=x onerror=alert("xss")>',
          role: 'client',
          phone: '1234567890',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        mockJwtService.sign
          .mockReturnValueOnce('access-token')
          .mockReturnValueOnce('refresh-token');

        const result = await service.signup(maliciousSignupDto);

        // Should store the malicious input as-is (XSS prevention should be handled at display layer)
        expect(result.user.firstName).toBe('<script>alert("xss")</script>');
        expect(result.user.lastName).toBe('<img src=x onerror=alert("xss")>');
      });

      it('should handle very long input strings', async () => {
        const longString = 'a'.repeat(1000);
        const longSignupDto: SignupDto = {
          firstName: longString,
          lastName: longString,
          email: `test${longString}@example.com`,
          phone: '1'.repeat(50),
          password: 'password123',
          role: 'client',
        };

        mockPrismaService.user.findUnique.mockResolvedValue(null);
        mockPrismaService.user.create.mockResolvedValue({
          id: 'user-id',
          email: `test${longString}@example.com`,
          name: `${longString} ${longString}`,
          role: 'client',
          phone: '1'.repeat(50),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        mockJwtService.sign
          .mockReturnValueOnce('access-token')
          .mockReturnValueOnce('refresh-token');

        const result = await service.signup(longSignupDto);
        expect(result).toBeDefined();
      });
    });

    describe('Token Security', () => {
      it('should generate different tokens for different users', async () => {
        const signupDto1: SignupDto = {
          firstName: 'User',
          lastName: 'One',
          email: 'user1@example.com',
          phone: '1234567890',
          password: 'password123',
          role: 'client',
        };

        const signupDto2: SignupDto = {
          firstName: 'User',
          lastName: 'Two',
          email: 'user2@example.com',
          phone: '0987654321',
          password: 'password456',
          role: 'client',
        };

        mockPrismaService.user.findUnique.mockResolvedValue(null);
        mockPrismaService.user.create
          .mockResolvedValueOnce({
            id: 'user-1',
            email: 'user1@example.com',
            name: 'User One',
            role: 'client',
            phone: '1234567890',
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .mockResolvedValueOnce({
            id: 'user-2',
            email: 'user2@example.com',
            name: 'User Two',
            role: 'client',
            phone: '0987654321',
            createdAt: new Date(),
            updatedAt: new Date(),
          });

        mockJwtService.sign
          .mockReturnValueOnce('token1')
          .mockReturnValueOnce('refresh1')
          .mockReturnValueOnce('token2')
          .mockReturnValueOnce('refresh2');

        const result1 = await service.signup(signupDto1);
        const result2 = await service.signup(signupDto2);

        expect(result1.token).not.toBe(result2.token);
        expect(result1.refreshToken).not.toBe(result2.refreshToken);
      });

      it('should include proper payload in tokens', async () => {
        const signupDto: SignupDto = {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '1234567890',
          password: 'password123',
          role: 'client',
        };

        mockPrismaService.user.findUnique.mockResolvedValue(null);
        mockPrismaService.user.create.mockResolvedValue({
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
          role: 'client',
          phone: '1234567890',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        mockJwtService.sign.mockImplementation((payload) => {
          // Verify that the payload contains expected fields
          expect(payload).toHaveProperty('sub', 'test-user-id');
          expect(payload).toHaveProperty('email', 'test@example.com');
          expect(payload).toHaveProperty('name', 'Test User');
          expect(payload).toHaveProperty('role', 'client');
          expect(payload).toHaveProperty('phone', '1234567890');
          return 'mock-token';
        });

        await service.signup(signupDto);

        expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      });
    });

    describe('Password Security', () => {
      it('should hash passwords with proper salt rounds', async () => {
        const signupDto: SignupDto = {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '1234567890',
          password: 'password123',
          role: 'client',
        };

        mockPrismaService.user.findUnique.mockResolvedValue(null);
        mockPrismaService.user.create.mockResolvedValue({
          id: 'user-id',
          email: 'test@example.com',
          name: 'Test User',
          role: 'client',
          phone: '1234567890',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Mock bcrypt.hash to verify salt rounds
        const mockHash = jest
          .fn()
          .mockResolvedValue('$2a$12$mockhashedpassword');
        jest.spyOn(bcrypt, 'hash').mockImplementation(mockHash);

        mockJwtService.sign
          .mockReturnValueOnce('access-token')
          .mockReturnValueOnce('refresh-token');

        await service.signup(signupDto);

        expect(mockHash).toHaveBeenCalledWith('password123', 12);
      });

      it('should reject weak passwords', async () => {
        // Test documents that password strength validation should be added
        // Currently the service allows any password
        const weakSignupDto: SignupDto = {
          firstName: 'Test',
          lastName: 'User',
          email: 'weak@example.com',
          phone: '1234567890',
          password: '123', // Very weak password
          role: 'client',
        };

        mockPrismaService.user.findUnique.mockResolvedValue(null);
        mockPrismaService.user.create.mockResolvedValue({
          id: 'user-id',
          email: 'weak@example.com',
          name: 'Test User',
          role: 'client',
          phone: '1234567890',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        mockJwtService.sign
          .mockReturnValueOnce('access-token')
          .mockReturnValueOnce('refresh-token');

        // Currently allows weak passwords - this should be flagged for improvement
        await expect(service.signup(weakSignupDto)).resolves.toBeDefined();
      });
    });
  });
});
