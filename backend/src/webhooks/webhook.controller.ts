import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { Webhook } from 'svix';
import { UsersService } from '../users/users.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly usersService: UsersService) {}

  @Post('clerk')
  async handleClerkWebhook(
    @Body() payload: any,
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
  ) {
    // Verify webhook signature
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      throw new UnauthorizedException('CLERK_WEBHOOK_SECRET not configured');
    }

    try {
      const wh = new Webhook(webhookSecret);
      const evt = wh.verify(JSON.stringify(payload), {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as any;

      // Handle different event types
      const eventType = evt.type;
      
      switch (eventType) {
        case 'user.created':
        case 'user.updated':
          await this.handleUserCreatedOrUpdated(evt.data);
          break;
        case 'user.deleted':
          await this.handleUserDeleted(evt.data);
          break;
        default:
          console.log(`Unhandled webhook event type: ${eventType}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error verifying webhook:', error);
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }

  private async handleUserCreatedOrUpdated(data: any) {
    const clerkId = data.id;
    const email = data.email_addresses?.[0]?.email_address;
    const firstName = data.first_name;
    const lastName = data.last_name;
    const imageUrl = data.image_url;

    if (!email) {
      console.error('No email found in Clerk user data');
      return;
    }

    await this.usersService.createOrUpdateFromClerk({
      clerkId,
      email,
      firstName,
      lastName,
      imageUrl,
      metadata: {
        username: data.username,
        publicMetadata: data.public_metadata,
      },
    });
  }

  private async handleUserDeleted(data: any) {
    const clerkId = data.id;
    await this.usersService.deleteByClerkId(clerkId);
  }
}
