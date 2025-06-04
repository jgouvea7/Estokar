import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductStatus } from './entities/product.entity';
import { Model } from 'mongoose';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class ProductsService {

  constructor(
    @InjectModel(Product.name) private productSchema: Model<Product>,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ){}

  async create(createProductDto: CreateProductDto) {

    const createdProduct = await this.productSchema.create({
      userId: createProductDto.userId,
      name: createProductDto.name,
      description: createProductDto.description,
      stock: createProductDto.stock,
      productStatus: ProductStatus.AVAILABLE
    })

    this.kafkaClient.emit('product-created',{
      value: JSON.stringify({
        userId: createProductDto.userId,
        name: createProductDto.name,
        description: createProductDto.description,
        stock: createProductDto.stock,
        typeCreate: 'CREATE'
      })
    });

    return createdProduct;
  }

  findAll() {
    return this.productSchema.find();
  }

  findOne(id: string) {
    return this.productSchema.findById({ _id: id });
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productSchema.findById(id);
    
    if(!product){
      throw new NotFoundException("Product not found");
    }

    const changes: Record<string, {old: any; new: any}> = {};
    if (updateProductDto.name && updateProductDto.name !== product.name) {
      changes.name = { old: product.name, new: updateProductDto.name};
    }
    if (updateProductDto.description && updateProductDto.description !== product.description) {
      changes.description = { old: product.description, new: updateProductDto.description };
    }

    const updateProduct = await this.productSchema.findByIdAndUpdate(id, updateProductDto, {new :true})

    if (Object.keys(changes).length > 0) {
      this.kafkaClient.emit('product-updated', {
        value: JSON.stringify({
          productId: id,
          userId: updateProductDto.userId,
          changes,
          typeUpdate: 'UPDATE'
        })
      });
    }

    return updateProduct;
  }

  async updateStock(id: string, updateProductDto: UpdateProductDto){

    const product = await this.productSchema.findById(id)

    if (!product) {
      throw new NotFoundException("Product not found")
    }

    const newStock = updateProductDto.stock;
    const updateStatus = newStock > 0 ? ProductStatus.AVAILABLE : ProductStatus.SOLD_OUT

    return await this.productSchema.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          stock: newStock,
          productStatus: updateStatus
        },
      },
      { new: true }   
    )
  }

  remove(id: string) {
    return this.productSchema.deleteOne({ _id: id });
  }

  async decreaseStock(id: string, quantity: number){
    const product = await this.productSchema.findById(id)

    if (!product){
      throw new NotFoundException("Product not found");
    }

    const newStock = product.stock - quantity
    const statusUpdate = newStock > 0 ? ProductStatus.AVAILABLE : ProductStatus.SOLD_OUT

    const result = await this.productSchema.updateOne(
      { _id : id },
      { $set: {
         stock: newStock, 
         productStatus: statusUpdate 
        }
      }
    )

    return result;

  }
  
}
