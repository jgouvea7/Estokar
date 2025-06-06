import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Operation, OperationSchema } from './entities/operation.entity';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { Product, ProductSchema } from 'src/products/entities/product.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Operation.name,
        schema: OperationSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'inventory-operation-consumer'
          },
        },
      },
    ]),
    HttpModule,
  ],
  controllers: [OperationsController],
  providers: [OperationsService],
})
export class OperationsModule {}
