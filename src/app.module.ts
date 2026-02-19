import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { OpenAIModule } from './openai/openai.module';
import { OpenAIController } from './openai/openai.controller';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OpenAIModule,
  ],
  controllers: [AppController, OpenAIController],
  providers: [AppService],
})
export class AppModule {}
