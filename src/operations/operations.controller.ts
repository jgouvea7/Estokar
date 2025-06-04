import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';


@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post('/sendOperation')
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
  
}
