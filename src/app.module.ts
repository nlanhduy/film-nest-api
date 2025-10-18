import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ActorsModule } from './actors/actors.module'
import { FilmsModule } from './films/films.module'
import { LanguagesModule } from './languages/languages.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // from Neon
      autoLoadEntities: true,
      synchronize: true, // auto create tables
    }),
    FilmsModule,
    LanguagesModule,
    ActorsModule,
  ],
})
export class AppModule {}
