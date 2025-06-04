import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entities/product.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { User, UserSchema } from 'src/users/entities/user.entity';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      }
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
              groupId: 'inventory-product-consumer'
          },
        },
      },
    ])
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
