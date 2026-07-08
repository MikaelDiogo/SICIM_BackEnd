import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        const isProduction = config.get<string>('NODE_ENV') === 'production';
        return {
          type: 'postgres',
          ...(databaseUrl
            ? { url: databaseUrl }
            : {
                host: config.get<string>('DB_HOST', 'localhost'),
                port: config.get<number>('DB_PORT', 5432),
                username: config.get<string>('DB_USERNAME', 'sicim'),
                password: config.get<string>('DB_PASSWORD', 'sicim_dev_pass'),
                database: config.get<string>('DB_NAME', 'sicim'),
              }),
          // Render's external DB URL requires SSL; internal (same-region) connections don't need it,
          // but rejectUnauthorized: false is harmless either way since Render uses self-signed certs.
          ssl: isProduction ? { rejectUnauthorized: false } : false,
          autoLoadEntities: true,
          migrations: [__dirname + '/migrations/*.{js,ts}'],
          // Schema changes go through versioned migrations, run automatically on boot.
          synchronize: false,
          migrationsRun: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
