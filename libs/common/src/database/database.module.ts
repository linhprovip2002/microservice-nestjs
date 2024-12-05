import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [],
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
export class DatabaseModule {
  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}
