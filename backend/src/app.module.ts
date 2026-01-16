// ARQUIVO: backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [UsersModule, AuthModule, AlertsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService], // Adicionamos o PrismaService aqui
})
export class AppModule {}