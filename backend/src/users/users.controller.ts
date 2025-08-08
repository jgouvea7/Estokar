import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }


  @Get()
  findAll() {
    return this.usersService.findAll();
  }


  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }


  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateUser(id, updateUserDto);
    
  }


  @Patch(':id/password')
  async updatePassword(
    @Param('id') id:string,
    @Body('password') password:string ) {
      return await this.usersService.updatePassword(id, password)
    }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.deleteUserById(id);
  }
 
}
