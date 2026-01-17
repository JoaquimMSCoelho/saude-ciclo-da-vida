/**
 * -------------------------------------------------------------------------
 * PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
 * ARQUITETURA: BACKEND (Service Layer)
 * GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
 * -------------------------------------------------------------------------
 * MÓDULO: ALERTS SERVICE
 * DESCRIÇÃO: Conecta ao Banco para buscar alertas.
 * IMPORTANTE: Traz os dados do Usuário (include: user) para a Torre saber quem é.
 * -------------------------------------------------------------------------
 */

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AlertsService {
  private prisma = new PrismaClient();

  // 1. CRIAR ALERTA (Chamado pelo App Mobile)
  async create(data: any) {
    return this.prisma.panicAlert.create({ data });
  }

  // 2. LISTAR TODOS (Chamado pela Torre)
  // Ordena pelos mais recentes primeiro
  async findAll() {
    return this.prisma.panicAlert.findMany({
      orderBy: { createdAt: 'desc' }, 
      include: {
        user: true, // <--- TRAZ O NOME E FOTO DO JOÃO
      },
    });
  }

  // 3. BUSCAR UM ESPECÍFICO
  async findOne(id: string) {
    return this.prisma.panicAlert.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  // 4. ATUALIZAR (Resolver)
  async update(id: string, data: any) {
    return this.prisma.panicAlert.update({ where: { id }, data });
  }

  // 5. REMOVER
  async remove(id: string) {
    return this.prisma.panicAlert.delete({ where: { id } });
  }
}