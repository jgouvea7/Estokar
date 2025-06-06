import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from './entities/log.entity';
import { Product, ProductSchema } from 'src/products/entities/product.entity';
import { Operation, OperationSchema } from 'src/operations/entities/operation.entity';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: Log.name,
        schema: LogSchema
      },
      {
        name: Product.name,
        schema: ProductSchema
      },
      {
        name: Operation.name,
        schema: OperationSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    HttpModule,
  ],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}
