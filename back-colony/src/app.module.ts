import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    // Configuração básica de variáveis de ambiente
    ConfigModule.forRoot({ 
      isGlobal: true 
    }),

    // Configuração MUITO SIMPLES do TypeORM - sem Async, sem ConfigService
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/colony_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Apenas para desenvolvimento
      logging: true,
    }),

    // Módulos
    PostModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}