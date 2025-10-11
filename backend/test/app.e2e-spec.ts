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
    process.env.JWT_SECRET = 'test-secret-key';
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
});
