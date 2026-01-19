// ARQUIVO: backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// --- SEUS MÓDULOS ANTIGOS (Mantidos para o Login funcionar) ---
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module'; 
import { AlertsModule } from './alerts/alerts.module';
// --------------------------------------------------------------

// --- O NOVO CONTROLLER (Para o Pânico funcionar) ---
import { EmergencyController } from './emergency.controller'; 
// ---------------------------------------------------

@Module({
  imports: [
    // Mantemos sua estrutura original
    UsersModule, 
    AuthModule, 
    AlertsModule 
  ],
  controllers: [
    AppController,
    // ADICIONAMOS APENAS ISTO AQUI:
    EmergencyController 
  ],
  providers: [AppService],
})
export class AppModule {}