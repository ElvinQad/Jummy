import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // 1. Check if Authorization header exists
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // 2. Extract and verify JWT token
      const token = authHeader.split(' ')[1];
      const payload = this.jwtService.verify(token);

      // 3. Find user and check admin status
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          isAdmin: true, // Make sure to select isAdmin field
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // 4. Check if user is admin
      if (!user.isAdmin) {
        throw new ForbiddenException('User is not an admin');
      }

      // 5. Attach user to request for later use
      request.user = user;

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
