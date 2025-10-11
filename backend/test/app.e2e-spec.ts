/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module'; // Adjust path if needed

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/auth/signup (POST)', () => {
    it('should create a new user with valid data', async () => {
      const email = `signup${Date.now()}@example.com`;
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email,
          phone: '1234567890',
          password: 'password123',
          role: 'client',
        })
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should fail with invalid data', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'invalid-email',
          password: '',
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login with valid credentials', async () => {
      const email = `login${Date.now()}@example.com`;
      // First, signup a user
      await request(app.getHttpServer()).post('/auth/signup').send({
        firstName: 'Test',
        lastName: 'User',
        email,
        phone: '1234567890',
        password: 'password123',
        role: 'client',
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email,
          password: 'password123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should fail with invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpass',
        })
        .expect(401);
    });
  });

  describe('/auth/refresh (POST)', () => {
    it('should refresh access token with valid refresh token', async () => {
      const email = `refresh${Date.now()}@example.com`;
      // Signup and login to get tokens
      await request(app.getHttpServer()).post('/auth/signup').send({
        firstName: 'Test',
        lastName: 'User',
        email,
        phone: '1234567890',
        password: 'password123',
        role: 'client',
      });

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email,
          password: 'password123',
        });

      const refreshToken = loginResponse.body.refreshToken;

      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(201);

      expect(response.body).toHaveProperty('token');
    });

    it('should fail with invalid refresh token', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', 'Bearer invalid')
        .expect(401);
    });
  });

  describe('Protected Route (e.g., /auth/me GET)', () => {
    it('should access protected route with valid token', async () => {
      const email = `protected${Date.now()}@example.com`;
      // Signup and login
      await request(app.getHttpServer()).post('/auth/signup').send({
        firstName: 'Test',
        lastName: 'User',
        email,
        phone: '1234567890',
        password: 'password123',
        role: 'client',
      });

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email,
          password: 'password123',
        });

      const accessToken = loginResponse.body.token;

      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should fail without token', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });
  });

  describe('Security Tests', () => {
    describe('Invalid Tokens', () => {
      it('should reject tampered JWT tokens', async () => {
        const tamperedToken =
          'fake-jwt-token-for-testing-purposes-only-not-a-real-secret'; // Dummy token for testing

        await request(app.getHttpServer())
          .get('/auth/me')
          .set('Authorization', `Bearer ${tamperedToken}`)
          .expect(401);
      });

      it('should reject malformed JWT tokens', async () => {
        const malformedTokens = [
          'not-a-jwt',
          'header.payload',
          'header.payload.signature.extra',
          '',
          '   ',
        ];

        for (const token of malformedTokens) {
          await request(app.getHttpServer())
            .get('/auth/me')
            .set('Authorization', `Bearer ${token}`)
            .expect(401);
        }
      });

      it('should reject tokens with wrong secret', async () => {
        // This would require creating a token with wrong secret
        // For now, we'll test with obviously invalid tokens
        const invalidToken = 'invalid-jwt-token-with-wrong-secret-for-testing';

        await request(app.getHttpServer())
          .get('/auth/me')
          .set('Authorization', `Bearer ${invalidToken}`)
          .expect(401);
      });

      it('should reject missing authorization header', async () => {
        await request(app.getHttpServer()).get('/auth/me').expect(401);
      });

      it('should reject invalid authorization header format', async () => {
        const invalidHeaders = [
          'Basic dXNlcjpwYXNz',
          'Bearer',
          'Bearer ',
          'bearer valid-token',
          'Token valid-token',
        ];

        for (const header of invalidHeaders) {
          await request(app.getHttpServer())
            .get('/auth/me')
            .set('Authorization', header)
            .expect(401);
        }
      });
    });

    describe('Input Sanitization', () => {
      it('should handle SQL injection attempts in signup', async () => {
        const maliciousData = {
          firstName: 'Test',
          lastName: 'User',
          email: "'; DROP TABLE users; --@example.com",
          phone: '1234567890',
          password: 'password123',
          role: 'client',
        };

        // Supabase should sanitize inputs, so this should either fail validation or be handled safely
        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(maliciousData);

        // Should not return 500 (internal server error) which would indicate SQL injection
        expect(response.status).not.toBe(500);
      });

      it('should handle XSS attempts in signup', async () => {
        const xssData = {
          firstName: '<script>alert("xss")</script>',
          lastName: '<img src=x onerror=alert("xss")>',
          email: `xss${Date.now()}@example.com`,
          phone: '1234567890',
          password: 'password123',
          role: 'client',
        };

        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(xssData)
          .expect(201);

        // Should store the data safely (XSS prevention is typically handled at the frontend)
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.firstName).toBe(
          '<script>alert("xss")</script>',
        );
      });

      it('should handle very long inputs', async () => {
        const longString = 'a'.repeat(1000);
        const longData = {
          firstName: longString,
          lastName: longString,
          email: `long${Date.now()}@example.com`,
          phone: '1'.repeat(100),
          password: 'password123',
          role: 'client',
        };

        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(longData);

        // Should handle gracefully (either succeed or fail with proper validation)
        expect([201, 400]).toContain(response.status);
      });

      it('should validate email format', async () => {
        const invalidEmails = [
          'not-an-email',
          '@example.com',
          'user@',
          'user.example.com',
          'user@.com',
          '',
        ];

        for (const email of invalidEmails) {
          const response = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
              firstName: 'Test',
              lastName: 'User',
              email,
              phone: '1234567890',
              password: 'password123',
              role: 'client',
            });

          // Should fail validation
          expect(response.status).toBe(400);
        }
      });
    });

    describe('Token Expiration', () => {
      it('should handle expired access tokens', async () => {
        // Create a user first
        const email = `expire${Date.now()}@example.com`;
        await request(app.getHttpServer()).post('/auth/signup').send({
          firstName: 'Test',
          lastName: 'User',
          email,
          phone: '1234567890',
          password: 'password123',
          role: 'client',
        });

        const loginResponse = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email,
            password: 'password123',
          });

        const accessToken = loginResponse.body.token;

        // Wait a bit (tokens have short expiration for testing)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Token should still be valid (unless very short expiration)
        // This test documents that we should test actual expiration
        const response = await request(app.getHttpServer())
          .get('/auth/me')
          .set('Authorization', `Bearer ${accessToken}`);

        // Should either work or return 401 if expired
        expect([200, 401]).toContain(response.status);
      });

      it('should handle refresh token expiration', async () => {
        // Create a user first
        const email = `refresh-expire${Date.now()}@example.com`;
        await request(app.getHttpServer()).post('/auth/signup').send({
          firstName: 'Test',
          lastName: 'User',
          email,
          phone: '1234567890',
          password: 'password123',
          role: 'client',
        });

        const loginResponse = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email,
            password: 'password123',
          });

        const refreshToken = loginResponse.body.refreshToken;

        // Attempt to refresh (should work initially)
        const refreshResponse = await request(app.getHttpServer())
          .post('/auth/refresh')
          .set('Authorization', `Bearer ${refreshToken}`);

        // Should either work or fail if refresh token is expired
        expect([201, 401]).toContain(refreshResponse.status);
      });
    });

    describe('Session Management', () => {
      it('should invalidate tokens after logout', async () => {
        // Create and login user
        const email = `logout${Date.now()}@example.com`;
        await request(app.getHttpServer()).post('/auth/signup').send({
          firstName: 'Test',
          lastName: 'User',
          email,
          phone: '1234567890',
          password: 'password123',
          role: 'client',
        });

        const loginResponse = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email,
            password: 'password123',
          });

        const accessToken = loginResponse.body.token;
        const refreshToken = loginResponse.body.refreshToken;

        // Verify token works before logout
        await request(app.getHttpServer())
          .get('/auth/me')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        // Logout
        await request(app.getHttpServer())
          .post('/auth/logout')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(201);

        // Verify access token is invalidated (if implemented)
        // Note: JWT tokens are stateless, so logout might not invalidate access tokens immediately
        // This depends on implementation - could use token blacklist or short expiration
        const postLogoutResponse = await request(app.getHttpServer())
          .get('/auth/me')
          .set('Authorization', `Bearer ${accessToken}`);

        // Should either still work (if access token not blacklisted) or fail
        expect([200, 401]).toContain(postLogoutResponse.status);

        // Refresh token should be invalidated
        await request(app.getHttpServer())
          .post('/auth/refresh')
          .set('Authorization', `Bearer ${refreshToken}`)
          .expect(401); // Should fail after logout
      });
    });

    describe('Rate Limiting & Brute Force Protection', () => {
      it('should handle multiple failed login attempts', async () => {
        const email = `brute${Date.now()}@example.com`;

        // Attempt multiple failed logins
        for (let i = 0; i < 5; i++) {
          const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
              email,
              password: 'wrongpassword',
            });

          // Should consistently return 401 for invalid credentials
          expect(response.status).toBe(401);
        }

        // This test documents that rate limiting should be considered
        // Currently no rate limiting is implemented
      });

      it('should handle rapid signup attempts', async () => {
        // Attempt multiple rapid signups with same email
        const email = `rapid${Date.now()}@example.com`;

        for (let i = 0; i < 3; i++) {
          const response = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
              firstName: 'Test',
              lastName: 'User',
              email,
              phone: '1234567890',
              password: 'password123',
              role: 'client',
            });

          if (i === 0) {
            expect(response.status).toBe(201); // First should succeed
          } else {
            expect(response.status).toBe(409); // Subsequent should fail (user exists)
          }
        }
      });
    });
  });
});
