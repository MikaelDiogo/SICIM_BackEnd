import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'sicim'),
        password: config.get<string>('DB_PASSWORD', 'sicim_dev_pass'),
        database: config.get<string>('DB_NAME', 'sicim'),
        autoLoadEntities: true,
        // Só em desenvolvimento — em produção o schema evolui via migrations.
        synchronize: config.get<string>('NODE_ENV', 'development') !== 'production',
      }),
    }),
  ],
})
export class DatabaseModule {}
