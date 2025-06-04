import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Operation, OperationSchema } from './entities/operation.entity';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { Product, ProductSchema } from 'src/products/entities/product.entity';

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
  ],
  controllers: [OperationsController],
  providers: [OperationsService],
})
export class OperationsModule {}
