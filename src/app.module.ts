import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ActorsModule } from './actors/actors.module'
import { FilmsModule } from './films/films.module'
import { LanguagesModule } from './languages/languages.module'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { LoggingInterceptor } from './logger/logging.interceptor'
import { winstonConfig } from './logger/winston.config'
import { WinstonModule } from 'nest-winston'
import { LogSearchController } from './logger/log-search.controller'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot(winstonConfig),
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
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  controllers: [LogSearchController],
})
export class AppModule {}
