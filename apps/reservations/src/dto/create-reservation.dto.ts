import { CreateChargeDto } from '@app/common';
import {
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateReservationDto {
  @IsDateString()
  startDay: Date;
  @IsDateString()
  endDate: Date;
  @IsString()
  @IsNotEmpty()
  placeId: string;
  @IsString()
  @IsNotEmpty()
  invoiceId: string;
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  charge: CreateChargeDto;
}
