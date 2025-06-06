import { Controller, Post, Body, BadRequestException, Get, Param } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { EventPattern, Payload } from '@nestjs/microservices';


@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post('/send-operation')
  async sendOperation(@Body() createOperationDto: CreateOperationDto) {
    
    const response = await this.operationsService.validateOperation(createOperationDto.productId, createOperationDto.quantity)

    if (response === true) {
      const operation = await this.operationsService.operationProduct(createOperationDto);
      return {
        message: 'Operation concluide',
        orderId: operation._id
      }
    } else {
      throw new BadRequestException('insufficient stock');
    }
    
  }

  @Get(':id')
  async validateOrder(@Param() productId: string) {
    const quantity: number = 5;
    this.operationsService.validateOperation(productId, quantity)
  }

  @EventPattern('operation-created')
  async handleOperationEvent(@Payload() message: any) {
    const data = JSON.parse(message.value);
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
