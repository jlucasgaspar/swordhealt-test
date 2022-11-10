import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { EncryptProvider } from '@/shared/providers/encrypt.provider';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [UserService, UserRepository, EncryptProvider],
  controllers: [UserController],
})
export class UserModule {}
