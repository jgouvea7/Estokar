import { Controller, Get, Param } from '@nestjs/common';
import { LogsService } from './logs.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get('user/:userId')
  async getLogsByUser(@Param('userId') userId: string){
    return this.logsService.findByUser(userId);
  }

  @Get('user/:userId/product/:productId')
  async getLogsByUserAndProduct(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.logsService.findByUserAndProduct(userId, productId);
  }

  @EventPattern('operation-created')
  async handleOperationCreated(@Payload() message: any){

    await this.logsService.createFromOperation({
      operationId: message.operationId,
      userId: message.userId,
      productId: message.productId,
      quantity: message.quantity,
      typeOperation: message.typeOperation,
    })
  }

  @EventPattern('product-updated')
  async handleProductUpdated(@Payload() message: any){


    await this.logsService.createFromProductUpdate({
      productId: message.productId,
      userId: message.userId,
      changes: message.changes,
      typeUpdate: message.typeUpdate,
    });
  }

  @EventPattern('product-created')
  async handleProductCreate(@Payload() message: any){
    await this.logsService.createFromProductCreate({
      userId: message.userId,
      name: message.name,
      description: message.description,
      stock: message.stock,
      typeCreate: message.typeCreate,
    })
  }

  @EventPattern('product-stock-updated')
  async handleProductStockUpdated(@Payload() message: any){
    await this.logsService.createFromProductUpdateStock({
      userId: message.userId,
      productId: message.productId,
      changes: message.changes,
      typeUpdate: message.typeUpdate
    })
  }

  @EventPattern('product-deleted')
  async handleProductDeleted(@Payload() message: any){
    await this.logsService.createFromProductDelete({
      productId: message.productId,
      userId: message.userId,
      typeDelete: message.typeDelete,
    })
  }

}
