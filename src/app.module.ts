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
import { FileModule } from './file/file.module';
import { ImageModule } from './image/image.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { dirname, join } from 'path';
import { ImageController } from './image/image.controller';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'),
      serveRoot: '/images',
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
    FileModule,
    ImageModule,
    CategoryModule,
  ],
  controllers: [AppController, ImageController],
  providers: [AppService],
})
export class AppModule { }
