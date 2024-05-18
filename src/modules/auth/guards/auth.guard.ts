import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import CurrentUser from '../../../shared/utils/current-user.util';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get IS_PUBLIC decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // return true if route is public
    if (isPublic) {
      return true;
    }

    // get request
    const request = context.switchToHttp().getRequest();

    // get token
    const token = this.extractTokenFromHeader(request);

    // check if token is valid
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // verify token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // add user to request
      request['user'] = payload.user;

      // save user to memory
      CurrentUser.set(payload.user);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // seperate Bearer and token
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    // return token
    return type === 'Bearer' ? token : undefined;
  }
}
