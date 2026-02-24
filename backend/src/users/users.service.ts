import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { createClerkClient, ClerkClient } from '@clerk/backend';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly clerk: ClerkClient;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {
    // Safely pull the key using ConfigService upon instantiation
    const secretKey = this.configService.get<string>('CLERK_SECRET_KEY');
    if (!secretKey) {
      throw new InternalServerErrorException(
        'CLERK_SECRET_KEY is not set in environment variables',
      );
    }
    this.clerk = createClerkClient({ secretKey });
  }

  async findByClerkId(clerkId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ clerkId }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async deleteByClerkId(clerkId: string): Promise<void> {
    this.logger.log(`[deleteByClerkId] Deleting | clerkId=${clerkId}`);
    try {
      await this.userModel.deleteOne({ clerkId }).exec();
      this.logger.log(`[deleteByClerkId] ✓ Deleted | clerkId=${clerkId}`);
    } catch (err: any) {
      this.logger.error(
        `[deleteByClerkId] MongoDB delete FAILED | clerkId=${clerkId} | ${err?.message}`,
        err?.stack,
      );
      throw new InternalServerErrorException(`MongoDB delete failed for clerkId=${clerkId}`);
    }
  }

  async createOrUpdateFromClerk(clerkData: {
    clerkId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    phone?: string;
    role?: string;
    metadata?: Record<string, any>;
  }): Promise<UserDocument> {
    this.logger.log(`[createOrUpdateFromClerk] START | clerkId=${clerkData.clerkId} email=${clerkData.email}`);

    const updateFields: Record<string, any> = {
      clerkId: clerkData.clerkId,
      email: clerkData.email,
      firstName: clerkData.firstName,
      lastName: clerkData.lastName,
      imageUrl: clerkData.imageUrl,
      phone: clerkData.phone,
      metadata: clerkData.metadata,
    };

    if (clerkData.role) {
      updateFields.role = clerkData.role;
    }

    try {
      const saved = await this.userModel
        .findOneAndUpdate(
          { clerkId: clerkData.clerkId },
          { $set: updateFields },
          { new: true, upsert: true },
        )
        .exec();
      
      this.logger.log(`[createOrUpdateFromClerk] ✓ SUCCESS | clerkId=${clerkData.clerkId} | mongoId=${saved._id}`);
      return saved;
    } catch (err: any) {
      this.logger.error(
        `[createOrUpdateFromClerk] MongoDB write FAILED | clerkId=${clerkData.clerkId} | ${err?.message}`,
        err?.stack,
      );
      throw new InternalServerErrorException(
        `MongoDB save failed for clerkId=${clerkData.clerkId}: ${err?.message}`,
      );
    }
  }

  async setUserRole(clerkId: string, role: string): Promise<UserDocument> {
    this.logger.log(`[setUserRole] START | clerkId=${clerkId} newRole=${role}`);

    // ── 1. Fetch & Snapshot Clerk User ───────────────────────────────────────
    let clerkUser: any;
    try {
      clerkUser = await this.clerk.users.getUser(clerkId);
    } catch (err: any) {
      this.logger.error(`[setUserRole] Failed to fetch Clerk user | clerkId=${clerkId} | ${err?.message}`);
      throw new InternalServerErrorException('Could not fetch user from Clerk');
    }

    const email = clerkUser.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      throw new InternalServerErrorException(`No email found on Clerk user clerkId=${clerkId}`);
    }

    // Capture the exact previous state to use if we need to roll back
    const previousClerkMetadata = clerkUser.publicMetadata ?? {};
    const previousRole = (previousClerkMetadata as any).role ?? null;
    this.logger.log(`[setUserRole] Previous Clerk role=${previousRole} → new role=${role}`);
    
    // ── 2. Update Clerk (Phase 1) ────────────────────────────────────────────
    try {
      await this.clerk.users.updateUser(clerkId, {
        publicMetadata: { ...previousClerkMetadata, role },
      });
      this.logger.log(`[setUserRole] ✓ Clerk metadata updated | clerkId=${clerkId} role=${role}`);
    } catch (err: any) {
      this.logger.error(`[setUserRole] Clerk update FAILED | clerkId=${clerkId} | ${err?.message}`, err?.stack);
      throw new InternalServerErrorException('Failed to update role in Clerk');
    }

    // ── 3. Update MongoDB (Phase 2) ──────────────────────────────────────────
    try {
      // Passwords are not included; we only extract safe profile data.
      const updateData = {
        clerkId,
        email,
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        imageUrl: clerkUser.imageUrl || '',
        role,
        metadata: {
          role,
          username: clerkUser.username,
          publicMetadata: { ...previousClerkMetadata, role },
        },
      };

      const mongoUser = await this.userModel.findOneAndUpdate(
        { clerkId },
        { $set: updateData },
        { new: true, upsert: true },
      ).exec();

      this.logger.log(`[setUserRole] ✓ MongoDB updated | clerkId=${clerkId} role=${role} mongoId=${mongoUser._id}`);
      return mongoUser;

    } catch (err: any) {
      // ── 4. ROLLBACK PROCESS ────────────────────────────────────────────────
      this.logger.error(
        `[setUserRole] MongoDB write FAILED | clerkId=${clerkId} | ${err?.message} – INITIATING ROLLBACK`,
        err?.stack,
      );

      try {
        // Revert Clerk back to the snapshot we took in Step 1
        await this.clerk.users.updateUser(clerkId, {
          publicMetadata: previousClerkMetadata,
        });
        this.logger.warn(`[setUserRole] ↩ Rollback SUCCESS – Clerk restored to role=${previousRole} | clerkId=${clerkId}`);
      } catch (rollbackErr: any) {
        // Severe error: Database failed AND the rollback failed
        this.logger.error(
          `[setUserRole] ↩ CRITICAL ROLLBACK FAILED – Clerk and MongoDB are OUT OF SYNC | clerkId=${clerkId} | ${rollbackErr?.message}`,
          rollbackErr?.stack,
        );
      }

      throw new InternalServerErrorException('Database sync failed. All changes have been rolled back.');
    }
  }
}