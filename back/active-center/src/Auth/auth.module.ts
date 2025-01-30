/* eslint-disable prettier/prettier */
import { Module, forwardRef  } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService  } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/Entities/User.entity';
import { UserModule } from 'src/User/user.module';
import { SendGridService } from 'src/sendGrid/sendGrid.service';
import { SendGridModule } from 'src/sendGrid/sendGrid.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SendGridService],
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => UserModule), SendGridModule],
  exports: [AuthService]
})
export class AuthModule {}
