import { Injectable } from '@nestjs/common';
import { TypeLog } from './dto/create-log.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Log } from './entities/log.entity';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class LogsService {

  constructor(
    @InjectModel(Log.name) private logSchema: Model<Log>,
    private readonly httpService: HttpService,
  ){}

  async findByUser(userId: string) {
    return this.logSchema.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findByUserAndProduct(userId: string, productId: string) {
    return this.logSchema.find({ userId, productId }).sort({ createdAt: -1 }).exec();
  }

  async createFromOperation(data: {
    operationId: string;
    userId: string;
    productId: string;
    quantity: number;
    typeOperation: string;
  }) {

    const response = await firstValueFrom(this.httpService.get(`http://localhost:3001/products/${data.productId}`));
    const product = response.data;

    const stockBefore = product.stock - data.quantity;
    const stockAfter = product.stock;

    return this.logSchema.create({
      operationId: data.operationId,
      userId: data.userId,
      productId: data.productId,
      stockBefore,
      stockAfter,
      typeLog: TypeLog.OPERATION,
      extraInfo: { typeOperation: data.typeOperation, quantity: data.quantity }
  });
}

  async createFromProductCreate(data: {
    userId: string;
    name: string;
    description: string;
    stock: number;
    typeCreate: string;
  }){
    return this.logSchema.create({
      userId: data.userId,
      name: data.name,
      description: data.description,
      stock: data.stock,
      typeLog: TypeLog.CREATE,
    })
  }

  async createFromProductDelete(data: {
    productId: string;
    userId: string;
    typeDelete: string;
  }) {
    return this.logSchema.create({
      productId: data.productId,
      userId: data.userId,
      typeLog: TypeLog.DELETE
    })
  }

  async createFromProductUpdate(data: {
    productId: string;
    userId: string;
    changes: Record<string, { old: any; new: any }>;
    typeUpdate: string;
    }) {
    return this.logSchema.create({
      userId: data.userId,
      productId: data.productId,
      stockBefore: data.changes.stock?.old,
      stockAfter: data.changes.stock?.new,
      typeLog: TypeLog.UPDATE,
      extraInfo: { changes: data.changes }
    });
  }

  async createFromProductUpdateStock(data: {
    productId: string;
    userId: string;
    changes: Record<string, { old: any; new: any }>;
    typeUpdate: string
  }) {
    return this.logSchema.create({
      productId: data.productId,
      userId: data.userId,
      typeLog: TypeLog.UPDATESTOCK,
      extraInfo: { changes: data.changes }
    })
  }

}
