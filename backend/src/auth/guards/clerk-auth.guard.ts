import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { createClerkClient, verifyToken } from '@clerk/backend';
import { AuthService } from '../auth.service';
import { User } from '../interfaces/user.interface';

/**
 * Guard that verifies Clerk JWT from Authorization header and attaches
 * the app User (from DB, synced by clerkUserId) to the request.
 */
@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.slice(7);
    const secretKey = process.env.CLERK_SECRET_KEY;

    if (!secretKey) {
      throw new UnauthorizedException('Server auth configuration error');
    }

    try {
      const payload = await verifyToken(token, { secretKey });
      const clerkUserId = payload.sub as string;

      let email = (payload as Record<string, unknown>).email as string | undefined;
      let name =
        ([
          (payload as Record<string, unknown>).first_name,
          (payload as Record<string, unknown>).last_name,
        ]
          .filter(Boolean)
          .join(' ')
          .trim() as string) ||
        ((payload as Record<string, unknown>).name as string) ||
        '';

      if (!email || !name) {
        const clerk = createClerkClient({ secretKey });
        const clerkUser = await clerk.users.getUser(clerkUserId);
        const primaryEmail = clerkUser.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId);
        email = email || primaryEmail?.emailAddress || '';
        name =
          name ||
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ').trim() ||
          clerkUser.username ||
          'User';
      }

      const user = await this.authService.getOrCreateUserFromClerk({
        clerkUserId,
        email: email || '',
        name: name || 'User',
      });

      request.user = user as User;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
