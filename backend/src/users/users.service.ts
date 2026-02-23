import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findByClerkId(clerkId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ clerkId }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async createOrUpdateFromClerk(clerkData: {
    clerkId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    metadata?: Record<string, any>;
  }): Promise<UserDocument> {
    const existingUser = await this.findByClerkId(clerkData.clerkId);

    if (existingUser) {
      // Update existing user
      Object.assign(existingUser, clerkData);
      return existingUser.save();
    }

    // Create new user
    return this.userModel.create(clerkData);
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async deleteByClerkId(clerkId: string): Promise<void> {
    await this.userModel.deleteOne({ clerkId }).exec();
  }
}
