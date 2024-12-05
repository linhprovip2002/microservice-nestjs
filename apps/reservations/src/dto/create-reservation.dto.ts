import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

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
}
