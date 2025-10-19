import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ActorsModule } from './actors/actors.module'
import { FilmsModule } from './films/films.module'
import { LanguagesModule } from './languages/languages.module'
import { ClientAuthMiddleware } from './middleware/client-auth.middleware'

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClientAuthMiddleware).forRoutes('films')
  }
}
