import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt'; // Para criptografar senha se criar usuário novo

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Busca por e-mail (Usado no Login)
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Cria usuário (Criptografando a senha)
  async create(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  // MUDANÇA AQUI: id: string
  findOne(id: string) { 
    return this.prisma.user.findUnique({
      where: { id },
      include: { profile: true } // Já traz o perfil junto
    });
  }

  // MUDANÇA AQUI: id: string
  async update(id: string, data: UpdateUserDto) {
    // Se estiver atualizando senha, precisa criptografar de novo
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // MUDANÇA AQUI: id: string
  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}