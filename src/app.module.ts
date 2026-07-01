import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Base de données
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 3306,
        username: configService.get('DB_USER') || 'root',
        password: configService.get('DB_PASSWORD') || '',
        database: configService.get('DB_NAME') || 'movia_db',
        entities: [User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    // Modules
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}