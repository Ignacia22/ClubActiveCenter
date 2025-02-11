import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Subscriptions } from 'src/Subscription/SubscriptionDTO/Subscription.enum';
import { Role } from 'src/User/UserDTO/Role.enum';

@Injectable()
export class SubscriptiondGuard implements CanActivate {
  constructor(private readonly reflector: Reflector){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isAdmin: string = context.switchToHttp().getRequest()?.access.roles;
    if(isAdmin === Role.admin) return true;
    const isSubscribed: boolean = context.switchToHttp().getRequest()?.access.isSubscribed;
    if(!isSubscribed) throw new UnauthorizedException('No cuentas con una suscripción.');
    const RequireSubs: Subscriptions[] = this.reflector.getAllAndOverride<Subscriptions[]>(
      'subscriptions', 
      [context.getHandler(), context.getClass()]
    );
    const subUser: Subscriptions[] = context.switchToHttp().getRequest()?.access.subscribe;
    const hasRequireSub: boolean = RequireSubs.some((sub) => subUser.includes(sub));
    if(!hasRequireSub) throw new UnauthorizedException('No tienes la suscripción necesaria.')
    return true;
  }
}
