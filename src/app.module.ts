import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { StylistModule } from './stylist/stylist.module';
import { BodyModule } from './body/body.module';
import { ChatModule } from './chat/chat.module';
import jwtConfig from './auth/jwt/jwt.config';
import userConfig from './user/user.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [jwtConfig, userConfig],
    }),
    AuthModule,
    UserModule,
    StylistModule,
    BodyModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
