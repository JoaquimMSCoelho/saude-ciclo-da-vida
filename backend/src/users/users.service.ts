/**
 * -------------------------------------------------------------------------
 * PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
 * ARQUITETURA: DATA LAYER (NestJS + Prisma)
 * GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
 * STATUS: FUSÃO (Validações + Modo Guardião + Prontuário)
 * -------------------------------------------------------------------------
 * MÓDULO: USERS SERVICE
 * DESCRIÇÃO: Centraliza busca de identidade, cadastro, GPS e prontuário.
 * -------------------------------------------------------------------------
 */

import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * 1. CRIAÇÃO DE IDENTIDADE (Cadastro)
   * Verifica duplicidade e gera perfil inicial.
   */
  async create(data: RegisterDto) {
    try {
      // 1.1 Verifica duplicidade
      const userExists = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (userExists) {
        throw new ConflictException('Este e-mail já está em uso no sistema.');
      }

      // 1.2 Cria o usuário com Avatar automático
      // Nota: O hash da senha já vem pronto do AuthService
      return await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password, 
          role: 'PACIENTE', // Default seguro
          photoUrl: `https://ui-avatars.com/api/?background=0891b2&color=fff&name=${data.name}`,
          // Se precisar expandir no futuro para criar profile junto, faremos aqui
        },
      });

    } catch (error) {
      if (error instanceof ConflictException) throw error;
      console.error(`[ERRO CRÍTICO] Falha ao criar usuário: ${error.message}`);
      throw new InternalServerErrorException('Falha ao registrar novo usuário.');
    }
  }

  /**
   * 2. BUSCA POR EMAIL (Usado no Login)
   */
  async findByEmail(email: string) {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
        include: { profile: true }, // Traz o perfil junto
      });
    } catch (error) {
      console.error(`[ERRO CRÍTICO] Falha ao buscar e-mail: ${error.message}`);
      throw new InternalServerErrorException('Falha na comunicação com o banco de dados.');
    }
  }

  /**
   * 3. BUSCA POR ID (Perfil Completo)
   * Agora traz contatos e medicamentos para o App usar.
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { 
        profile: true,
        medications: true,       // Já traz os remédios
        emergencyContacts: true, // Já traz os contatos
      },
    });

    if (!user) throw new NotFoundException('Usuário não localizado no ecossistema.');
    return user;
  }

  /**
   * 4. ATUALIZAR LOCALIZAÇÃO (NOVO - MODO GUARDIÃO)
   * Recebe o GPS do celular e salva o rastro.
   */
  async updateLocation(userId: string, lat: number, lng: number) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          lastLatitude: lat,
          lastLongitude: lng,
          lastSeenAt: new Date(), // Marca a hora exata do "Sinal de Vida"
        },
      });
    } catch (error) {
      console.error(`[GPS ERROR] Falha ao salvar rastro de ${userId}: ${error.message}`);
      // Não lançamos erro fatal aqui para não travar o app se o GPS falhar
      return null; 
    }
  }

  /**
   * 5. FONTE ÚNICA DE VERDADE (Medicamentos)
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

  // Método auxiliar simples
  async findAll() {
    return this.prisma.user.findMany();
  }
}