import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        UsersModule, 
        JwtModule.register({
          secret: 'secret', 
          signOptions: { expiresIn: '1m' }, 
        }),
      ],
      providers: [AuthService, JwtStrategy],
      controllers: [AuthController],
      exports: [AuthService]
})
export class AuthModule {}
