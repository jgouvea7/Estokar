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

  findByUser(userId: string){
    return this.productSchema.find({ userId })
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
    const changes: Record<string, {old: any; new: any;}> = {};
    if (updateProductDto.stock && updateProductDto.stock !== product.stock) {
      changes.stock = { old: product.stock, new: newStock}
    }

    const updateStock =  await this.productSchema.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          stock: newStock,
          productStatus: updateStatus
        },
      },
      { new: true }   
    )

    this.kafkaClient.emit('product-stock-updated', {
      value: JSON.stringify({
        productId: id,
        userId: updateProductDto.userId,
        changes,
        typeUpdate: 'UPDATE_STOCK'
      })
    })

    return updateStock;
  }

  async remove(productId: string, userId: string) {
    const deleteProduct = await this.productSchema.findByIdAndDelete({
      _id: productId,
      userId: userId,
    });

    this.kafkaClient.emit('product-deleted', {
      value: JSON.stringify({
        productId: productId,
        userId: userId,
        typeDelete: 'DELETE'
      })
    })

    return deleteProduct;
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
