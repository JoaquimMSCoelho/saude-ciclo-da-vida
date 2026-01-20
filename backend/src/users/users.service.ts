/**
 * -------------------------------------------------------------------------
 * PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
 * ARQUITETURA: DATA LAYER (NestJS + Prisma)
 * GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
 * -------------------------------------------------------------------------
 * MÓDULO: USERS SERVICE
 * DESCRIÇÃO: Centraliza busca de identidade, cadastro e prontuário farmacêutico.
 * -------------------------------------------------------------------------
 */

import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from '../auth/dto/register.dto'; // Importação do DTO

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * PGT-01: Criação de Identidade (Cadastro).
   * Verifica duplicidade e gera perfil inicial.
   */
  async create(data: RegisterDto) {
    try {
      // 1. Verifica duplicidade
      const userExists = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (userExists) {
        throw new ConflictException('Este e-mail já está em uso no sistema.');
      }

      // 2. Cria o usuário com Avatar automático
      return await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password, // TODO: Implementar Bcrypt no futuro
          photoUrl: `https://ui-avatars.com/api/?background=0891b2&color=fff&name=${data.name}`,
        },
      });

    } catch (error) {
      if (error instanceof ConflictException) throw error;
      
      console.error(`[ERRO CRÍTICO] Falha ao criar usuário: ${error.message}`);
      throw new InternalServerErrorException('Falha ao registrar novo usuário.');
    }
  }

  /**
   * PGT-01: Segurança e Identidade.
   * Utilizado pelo AuthService para localização de hash de senha.
   * IMPORTANTE: Mantivemos o nome 'findByEmail' do seu padrão original.
   */
  async findByEmail(email: string) {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error(`[ERRO CRÍTICO] Falha ao buscar e-mail: ${error.message}`);
      throw new InternalServerErrorException('Falha na comunicação com o banco de dados.');
    }
  }

  /**
   * PGT-01: Fonte Única de Verdade.
   * Busca medicamentos vinculados ao UUID do usuário com horários integrados.
   */
  async findUserMedications(userId: string) {
    try {
      const userExists = await this.prisma.user.findUnique({ where: { id: userId } });
      
      if (!userExists) {
        throw new NotFoundException('Usuário não localizado no ecossistema.');
      }

      return await this.prisma.medication.findMany({
        where: { userId },
        include: {
          schedules: true, // Garante que horários (ex: 08:00) venham do PostgreSQL
        },
        orderBy: { name: 'asc' }
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      
      console.error(`[ERRO CRÍTICO] Falha ao buscar prontuário farmacêutico: ${error.message}`);
      throw new InternalServerErrorException('Erro interno ao processar dados de saúde.');
    }
  }

  // Métodos CRUD simplificados para manutenção futura
  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id }, include: { profile: true } });
  }
}