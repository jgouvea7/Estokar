import { Controller, Post, Body, BadRequestException, Get, Param } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { EventPattern, Payload } from '@nestjs/microservices';


@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post('/send-operation')
  async sendOperation(@Body() createOperationDto: CreateOperationDto) {
    const isValid = await this.operationsService.validateOperation(
      createOperationDto.productId,
      createOperationDto.quantity
    );

     if (!isValid) {
      throw new BadRequestException('Estoque insuficiente');
    }
    
    const operation = await this.operationsService.operationProduct(createOperationDto);

    return {
      message: 'Operação criada com sucesso',
      operationId: operation._id,
    };
  }


  @EventPattern('operation-created')
  async handleOperationEvent(@Payload() message: any) {
    const data = message.value;
    const { productId, quantity } = data;

    try {
      await this.operationsService.validateOperation(productId, quantity);
      await this.operationsService.operationProduct(data);
      console.log('Operation processed via Kafka event');
    } catch (error) {
      console.error('Error processing operation from Kafka:', error.message);
    }
  }
  
}
