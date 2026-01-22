/*
-------------------------------------------------------------------------
MÓDULO: USERS CONTROLLER
DESCRIÇÃO: Interface REST para perfil, localização e farmácia.
STATUS: CORRIGIDO (Rota de Listagem PÚBLICA para evitar erro 401)
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
  // ===========================================================================
  @UseGuards(JwtAuthGuard)
  @Patch('location')
  async updateLocation(@Request() req, @Body() body: { lat: number; lng: number }) {
    console.log(`📍 Rastreamento recebido de [${req.user.userId}]: ${body.lat}, ${body.lng}`);
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
  // Correção Técnica: Removemos o @UseGuards aqui para o Dashboard acessar.
  // ===========================================================================
  @Get() 
  findAll() {
    return this.usersService.findAll();
  }
}