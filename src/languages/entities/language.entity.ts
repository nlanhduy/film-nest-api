import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Film } from '../../films/entities/film.entity'

@Entity('language')
export class Language {
  @PrimaryGeneratedColumn()
  language_id: number

  @Column({ length: 20 })
  name: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_update: Date

  @OneToMany(() => Film, (film) => film.language)
  films!: Film[]

  @OneToMany(() => Film, (film) => film.original_language)
  original_films: Film[]
}
