/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TokenRefreshPayloadDTO } from '../AuthDTO/auths.dto';
import { SECRET_SECRET_WORD } from 'src/config/config.envs';
import { Role } from 'src/User/UserDTO/Role.enum';
import { UserStatus } from 'src/User/UserDTO/users.dto';
import { Subscriptions } from 'src/Subscription/SubscriptionDTO/Subscription.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic: boolean = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) return true;

    const req: any = context.switchToHttp().getRequest();
    const header: string | undefined = req.headers['authorization'];
    if (!header) return false;
    const token: string = header.split(' ')[1];
    if (!header.startsWith('Bearer '))
      throw new UnauthorizedException('Formato de autoriazación invalido.');
    if (!token)
      throw new UnauthorizedException(
        'No se detecto el token de autorización.',
      );

    try {
      const payload: TokenRefreshPayloadDTO = await this.jwtService.verifyAsync(
        token,
        { secret: SECRET_SECRET_WORD },
      );

      if (payload.userStatus === UserStatus.ban)
        throw new UnauthorizedException(
          'Tu cuenta ha sido baneada. Ya no tienes acceso al sistema.',
        );

      if (payload.userStatus === UserStatus.delete)
        throw new UnauthorizedException(
          'Esta cuenta no existe. No tienes acceso al sistema crea un usuario por favor.',
        );

      payload.isAdmin ? payload.roles = [Role.admin] : payload.roles = [Role.user];
      payload.isSubscribed ? payload.subscribe = [Subscriptions.GOLD] : payload.subscribe = [Subscriptions.NULL];
      
      req.access = {
        ...payload,
        exp: new Date(payload.exp * 1000),
        iat: new Date(payload.iat * 1000),
      };

      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('El token ha expirado.');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token inválido.');
      }
      throw new UnauthorizedException('Error de autenticación.');
    }
  }
}
