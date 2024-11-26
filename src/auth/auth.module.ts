import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import * as dotenv from 'dotenv';

dotenv.config();
@Module({
    imports: [
        UsersModule, 
        JwtModule.register({
          secret: process.env.JWT_SECRET, 
          signOptions: { expiresIn: '1h' }, 
        }),
      ],
      providers: [AuthService, JwtStrategy],
      controllers: [AuthController],
      exports: [AuthService]
})
export class AuthModule {}
