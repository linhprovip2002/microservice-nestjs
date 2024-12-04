import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../config';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGODB_URL');
        const logger = new Logger('DatabaseModule');
        if (!mongoUri) {
          logger.error('MongoDB URL is not defined!');
          throw new Error('MongoDB URL is not defined!');
        }

        logger.log('Connecting to MongoDB...');
        return {
          uri: mongoUri,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
