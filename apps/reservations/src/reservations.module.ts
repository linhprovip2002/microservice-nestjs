import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import { ReservationRepository } from './repositories/reservation.repository';
import {
  ReservationDocument,
  ReservationSchema,
} from './Models/reservation.schema';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ReservationDocument.name, schema: ReservationSchema },
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGODB_URL: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      isGlobal: true,
      envFilePath: 'apps/reservations/.env',
    }),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationRepository],
})
export class ReservationsModule {}
