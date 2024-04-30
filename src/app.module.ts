import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AddressesModule } from './addresses/addresses.module';
import { ClientModule } from './client/client.module';
import { ProductModule } from './product/product.module';
import { SalesModule } from './sales/sales.module';
import { DetailSaleModule } from './detail-sale/detail-sale.module';
import { BoxModule } from './box/box.module';
/*import { FileModule } from './file/file.module';*/
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: true,
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    RolesModule,
    UsersModule,
    AuthModule,
    AddressesModule,
    ClientModule,
    ProductModule,
    SalesModule,
    DetailSaleModule,
    BoxModule,
    /*FileModule,*/
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
