import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private usersService: UsersService) {} 

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; 
    const userId = request.params.id; 

    const existingUser = await this.usersService.getUser(userId);
    if (!existingUser) {
      throw new ForbiddenException('User not found');
    }

    if (existingUser.id !== user.id) {
      throw new ForbiddenException('You do not own this user resource');
    }

    return true;
  }
}
