import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private userSchema: Model<User>
  ){}


  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }


  async createUser(createUserDto: CreateUserDto) {

    const hashed_password = await this.hashPassword(createUserDto.password)

    return await this.userSchema.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashed_password,
    });
  }

  
  findAll() {
    return this.userSchema.find();
  }


  findOneByEmail(email: string) {
    return this.userSchema.findOne({ email: email });
  }


  async updateUser(id: string, updateUserDto: UpdateUserDto) {

    const hashed_password = await this.hashPassword(updateUserDto.password)

    return await this.userSchema.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          name: updateUserDto.name,
          email: updateUserDto.email,
          password: hashed_password,
        },
      },
      { new: true }
    );
  }
  

  async updatePassword(id: string, password: string ) {

    const hashed_password = await this.hashPassword(password)

    return await this.userSchema.findByIdAndUpdate(
      id,
      {
        $set: {
          password: hashed_password,
        }
      },
      { new: true }
    )
  }


  deleteUserById(id: string) {
    return this.userSchema.findByIdAndDelete(id);
  }



}