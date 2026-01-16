// ARQUIVO: src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 1. Criar Usuário (Lógica Base)
  async create(data: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password, 
        role: 'USER',
      },
    });
  }

  // 2. Buscar por Email (Lógica Nova - Necessária para Login)
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // 3. Listar Todos (Lógica Base)
  async findAll() {
    return this.prisma.user.findMany();
  }

  // 4. Buscar por ID (Lógica Base)
  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}