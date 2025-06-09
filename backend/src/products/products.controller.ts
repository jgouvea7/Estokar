import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto, @Req() req) {
    const userId = req.user.userId
    return this.productsService.create({ ...createProductDto, userId });
  }

  @Get('/all')
  findAll() {
    return this.productsService.findAll();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findUserProducts(@Request() req) {
    const userId = req.user.userId;
    return this.productsService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req
  ) {
    const userId = req.user.userId;
    return this.productsService.updateProduct(id,{ ...updateProductDto, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update-stock/:id')
  updateStock(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req
  ) {
    const userId = req.user.userId;
    return this.productsService.updateStock(id,{ ...updateProductDto, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string,
         @Req() req
  ) {
    const userId = req.user.userId;
    return this.productsService.remove(id, userId);
  }

  @EventPattern('operation-created')
  async handleOperationCreated(@Payload() message: any) {
    
    const result = await this.productsService.decreaseStock(message.productId, message.quantity)

    return result;
  }
}