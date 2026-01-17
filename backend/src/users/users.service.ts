/**
 * -------------------------------------------------------------------------
 * PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
 * ARQUITETURA: BACKEND (Service Layer)
 * -------------------------------------------------------------------------
 * MÓDULO: USERS SERVICE (v2.0)
 * DESCRIÇÃO: Regras de negócio + Método especial para Auth (Login).
 * -------------------------------------------------------------------------
 */

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  private prisma = new PrismaClient();

  // --- MÉTODO ESPECIAL PARA O AUTH (LOGIN) ---
  // Busca usuário pelo email para verificar senha
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  // --------------------------------------------

  // 1. CRIAR USUÁRIO
  async create(data: any) {
    return this.prisma.user.create({ data });
  }

  // 2. LISTAR TODOS
  async findAll() {
    return this.prisma.user.findMany({
      include: { profile: true },
    });
  }

  // 3. BUSCAR UM PELO ID
  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        medications: true,
        emergencyContacts: true,
        carePlans: true,
      },
    });
  }

  // 4. ATUALIZAR
  async update(id: string, data: any) {
    return this.prisma.user.update({ where: { id }, data });
  }

  // 5. REMOVER
  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}