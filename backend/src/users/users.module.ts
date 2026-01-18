import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service'; // Importante para o banco

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService], // <--- OBRIGATÓRIO: Permite que o AuthModule use este serviço
})
export class UsersModule {}