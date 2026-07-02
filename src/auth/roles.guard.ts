import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../users/users.entity';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Récupère les rôles requis
    const rolesRequis = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si pas de rôle requis → tout le monde peut accéder
    if (!rolesRequis) return true;

    // Récupère l'utilisateur connecté
    const { user } = context.switchToHttp().getRequest();

    // Vérifie si l'utilisateur a le bon rôle
    return rolesRequis.includes(user.role);
  }
}