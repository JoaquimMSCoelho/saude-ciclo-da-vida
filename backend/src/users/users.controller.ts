/*
-------------------------------------------------------------------------
MÓDULO: USERS CONTROLLER
DESCRIÇÃO: Interface REST para perfil, localização e farmácia.
STATUS: ATUALIZADO (Sincronizado com o esquema de rastreamento dinâmico)
-------------------------------------------------------------------------
*/
import { Controller, Get, Body, Param, UseGuards, Patch, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ===========================================================================
  // ROTA 1: MEU PERFIL (Protegido)
  // ===========================================================================
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  // ===========================================================================
  // ROTA 2: ATUALIZAR LOCALIZAÇÃO (Protegido - Celular envia)
  // AJUSTE: Mapeado para receber lat/lng do corpo da requisição via Token
  // ===========================================================================
  @UseGuards(JwtAuthGuard)
  @Patch('location')
  async updateLocation(@Request() req, @Body() body: { lat: number; lng: number }) {
    // Log de auditoria no terminal para validação do Arquiteto
    console.log(`📍 Rastreamento recebido de [ID: ${req.user.userId}]: Lat ${body.lat}, Lng ${body.lng}`);
    return this.usersService.updateLocation(req.user.userId, body.lat, body.lng);
  }

  // ===========================================================================
  // ROTA 3: MEUS MEDICAMENTOS (Protegido)
  // ===========================================================================
  @UseGuards(JwtAuthGuard)
  @Get(':id/medications')
  async getMyMeds(@Param('id') id: string) {
    return await this.usersService.findUserMedications(id);
  }

  // ===========================================================================
  // ROTA 4: BUSCAR UM USUÁRIO (Protegido)
  // ===========================================================================
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // ===========================================================================
  // ROTA 5: LISTAR TODOS (PÚBLICO)
  // ===========================================================================
  @Get() 
  findAll() {
    return this.usersService.findAll();
  }
}