/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('actor')
export class Actor {
  @PrimaryGeneratedColumn()
  actor_id: number;

  @Column({ length: 45 })
  first_name: string;

  @Column({ length: 45 })
  last_name: string;

  @UpdateDateColumn()
  last_update: Date;
}
