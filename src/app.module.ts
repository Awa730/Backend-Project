import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Modules coéquipier (on touche pas)
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// Tes modules
import { VehiculesModule } from './vehicules/vehicules.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ClientsModule } from './clients/clients.module';
import { ExchangeModule } from './exchange/exchange.module';

// Entité coéquipier
import { User } from './users/users.entity';

// Tes entités
import { Vehicule } from './vehicules/vehicule.entity';
import { Reservation } from './reservations/reservation.entity';

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
        entities: [
          User,        // coéquipier
          Vehicule,    // toi
          Reservation, // toi
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    // Modules coéquipier
    AuthModule,
    UsersModule,

    // Tes modules
    VehiculesModule,
    ReservationsModule,
    ClientsModule,
    ExchangeModule,
  ],
})
export class AppModule {}