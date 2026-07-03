import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Modules coéquipier (on touche pas)
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// Modules
import { VehiclesModule } from './vehicles/vehicles.module';
import { VehiculesModule } from './vehicules/vehicules.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ClientsModule } from './clients/clients.module';
import { ExchangeModule } from './exchange/exchange.module';

// Entité coéquipier
import { User } from './users/users.entity';

// Entités
import { Vehicule } from './vehicules/vehicule.entity';
import { Reservation } from './reservations/reservation.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Base de données
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'movia_db',
      entities: [User, Vehicule, Reservation],
      synchronize: true,
      autoLoadEntities: true,
    }),

    // Modules coéquipier
    AuthModule,
    UsersModule,

    // Modules
    VehiclesModule,
    VehiculesModule,
    ReservationsModule,
    ClientsModule,
    ExchangeModule,
  ],
})
export class AppModule {}
