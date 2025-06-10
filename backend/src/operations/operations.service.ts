import { Inject, Injectable } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Operation } from './entities/operation.entity';
import { Model } from 'mongoose';
import { ClientKafka } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OperationsService {

  constructor(
    @InjectModel(Operation.name) private operationSchema: Model<Operation>,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly httpService: HttpService,
  ){}

  async moduleInit() {
    await this.kafkaClient.connect()
  }

  async operationProduct(createOperationDto: CreateOperationDto){

    console.log('Criando operação para produto:', createOperationDto.productId, 'quantidade:', createOperationDto.quantity);
    const operation = await this.operationSchema.create({
      userId: createOperationDto.userId,
      productId: createOperationDto.productId,
      quantity: createOperationDto.quantity,
      typeOperation: createOperationDto.typeOperation
    });

    this.kafkaClient.emit('operation-created', {
      value: JSON.stringify({
        operationId: operation._id,
        userId: createOperationDto.userId,
        productId: createOperationDto.productId,
        quantity: createOperationDto.quantity,
        typeOperation: createOperationDto.typeOperation,
      })
    });

    return operation;
  }

  async validateOperation(productId: string, quantity: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3001/products/${productId}`)
      );

      const product = response.data;

      return product.stock >= quantity;
    } catch (error) {
      console.error('Erro ao validar operação:', error.message);
      return false;
    }
  }
}
