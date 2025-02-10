/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/Entities/User.entity';
import { UserModule } from 'src/User/user.module';
import { SendGridModule } from 'src/SendGrid/sendGrid.module';
import { Chat } from 'src/Entities/Chat.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([User,Chat]),
    forwardRef(() => UserModule),
    SendGridModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
