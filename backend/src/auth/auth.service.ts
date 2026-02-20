import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserResponse } from './interfaces/user.interface';

export interface ClerkUserPayload {
  clerkUserId: string;
  email: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get or create app User from Clerk token payload.
   * New users get default role 'client'; they can update via PATCH /auth/me.
   */
  async getOrCreateUserFromClerk(payload: ClerkUserPayload): Promise<User> {
    const { clerkUserId, email, name } = payload;

    let user = await this.prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (user) {
      return this.dbUserToInterface(user);
    }

    // Try by email in case of legacy or duplicate Clerk accounts
    const existingByEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingByEmail) {
      if (!existingByEmail.clerkUserId) {
        const updated = await this.prisma.user.update({
          where: { id: existingByEmail.id },
          data: { clerkUserId },
        });
        return this.dbUserToInterface(updated);
      }
      throw new ConflictException('User with this email already exists');
    }

    const newUser = await this.prisma.user.create({
      data: {
        clerkUserId,
        email,
        name: name || 'User',
        role: 'client',
        phone: null,
      },
    });

    return this.dbUserToInterface(newUser);
  }

  getCurrentUser(user: User): UserResponse {
    const nameParts = (user.name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      id: user.id,
      firstName,
      lastName,
      email: user.email,
      phone: user.phone ?? '',
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  async updateProfile(
    user: User,
    data: { role?: 'client' | 'performer'; phone?: string },
  ): Promise<UserResponse> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        ...(data.role != null && { role: data.role }),
        ...(data.phone != null && { phone: data.phone }),
      },
    });

    return this.getCurrentUser(this.dbUserToInterface(updated));
  }

  private dbUserToInterface(row: {
    id: string;
    email: string;
    name: string;
    role: string;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
    clerkUserId?: string | null;
  }): User {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role as 'client' | 'performer' | 'admin',
      phone: row.phone ?? '',
      created_at: row.createdAt.toISOString(),
      updated_at: row.updatedAt.toISOString(),
    };
  }
}
