import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { AuthModule } from './modules/auth/auth.module';
import { ManagingUnitModule } from './modules/managing-unit/managing-unit.module';
import { PropertyModule } from './modules/property/property.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    ManagingUnitModule,
    AuditLogModule,
    PropertyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
