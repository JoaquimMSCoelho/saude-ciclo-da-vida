import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
// Se o erro mencionou auth.service, você provavelmente tem o AuthModule.
// Se der erro de "Cannot find module './auth/auth.module'", 
// remova a linha abaixo e o 'AuthModule' dos imports.
import { AuthModule } from './auth/auth.module'; 
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [
    UsersModule, 
    AuthModule, AlertsModule 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}