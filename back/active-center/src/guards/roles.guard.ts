import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "src/Auth/roles.enun";

@Injectable()
export class RolesGuard implements CanActivate{
 constructor(private readonly reflector:Reflector){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>("roles" ,[
            context.getHandler(),
             context.getClass()]);
             console.log('Required Roles:', requiredRoles);
    
            const request = context.switchToHttp().getRequest()
            const user = request.user;
            
            console.log(user)
        
            if (!requiredRoles || requiredRoles.length === 0) {
                return true; 
              }
            const hasrole = () => requiredRoles.some((role) => user?.roles?.includes(role));
            const valid = user && user.roles && hasrole();
            
            if(!valid){
                throw new ForbiddenException("no tienes permiso para acceder a esta ruta")
            }
            return valid;
    }

}