// -------------------------------------------------------------------------
// MÓDULO: LOCATION (MODO GUARDIÃO)
// ARQUIVO: location-log.entity.ts
// DESCRIÇÃO: Tabela de alta escrita para rastreamento GPS
// -------------------------------------------------------------------------

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('location_logs')
// INDEXAÇÃO: Cria um índice composto por user_id e data.
// Motivo: Otimiza drasticamente consultas como "Onde o usuário X estava ontem?"
@Index(['user', 'timestamp']) 
export class LocationLog {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Precisão Decimal: (10, 6) garante precisão de ~11cm, ideal para GPS.
  @Column({ type: 'decimal', precision: 10, scale: 6 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  longitude: number;

  // Nível de Bateria: Crítico para sabermos se o celular morreu ou foi desligado
  @Column({ name: 'battery_level', type: 'int', nullable: true })
  batteryLevel: number;

  // Fonte do dado: 'GPS', 'NETWORK', 'MANUAL' (Botão Pânico)
  @Column({ length: 20, default: 'GPS' })
  source: string;

  // Relação: Muitos logs pertencem a Um Usuário
  @ManyToOne(() => User, user => user.locationLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  timestamp: Date;
}