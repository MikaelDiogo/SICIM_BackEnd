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
        migrations: [__dirname + '/migrations/*.{js,ts}'],
        // Schema changes go through versioned migrations, run automatically on boot.
        synchronize: false,
        migrationsRun: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
