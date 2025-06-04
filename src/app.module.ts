import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OperationsModule } from './operations/operations.module';
import { AuthModule } from './auth/auth.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [
     MongooseModule.forRoot(
      'mongodb://root:root@localhost:27017/inventorymanagament?authSource=admin&directConnection=true',
    ),
    UsersModule,
    ProductsModule,
    OperationsModule,
    AuthModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
