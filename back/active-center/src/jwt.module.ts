/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SECRET_SECRET_WORD } from './config/config.envs';

@Module({
    imports: [JwtModule.register({
        global: true,
        signOptions: {expiresIn: '7d'},
        secret: SECRET_SECRET_WORD,
    })]
})
export class JWTModule {}
