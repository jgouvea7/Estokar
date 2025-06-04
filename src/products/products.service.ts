import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductStatus } from './entities/product.entity';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {

  constructor(
    @InjectModel(Product.name) private productSchema: Model<Product>
  ){}

  create(createProductDto: CreateProductDto) {
    return this.productSchema.create({
      userId: createProductDto.userId,
      name: createProductDto.name,
      description: createProductDto.description,
      stock: createProductDto.stock,
      productStatus: ProductStatus.AVAILABLE
    })
  }

  findAll() {
    return this.productSchema.find();
  }

  findOne(id: string) {
    return this.productSchema.findById({ _id: id });
  }

  updateProduct(id: string, updateProductDto: UpdateProductDto) {
    return this.productSchema.findByIdAndUpdate(
      { _id: id },
      {
        name: updateProductDto.name,
        description: updateProductDto.description,
      },
      { new: true }
    );
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
