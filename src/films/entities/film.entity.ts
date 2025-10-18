/* eslint-disable prettier/prettier */
import { Language } from 'src/languages/entities/language.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('film')
export class Film {
  @PrimaryGeneratedColumn()
  film_id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'smallint', nullable: true })
  release_year?: number;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'original_language_id' })
  original_language: Language;

  @Column({ type: 'smallint', default: 3 })
  rental_duration: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 4.99 })
  rental_rate: number;

  @Column({ type: 'smallint', nullable: true })
  length?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 19.99 })
  replacement_cost: number;

  @Column({ type: 'varchar', length: 10, default: 'G' })
  rating: string;

  @Column('text', { array: true, nullable: true })
  special_features?: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_update: Date;
}
