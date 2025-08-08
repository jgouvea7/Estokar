import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, Matches, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    name: string;
    @IsEmail({}, {message: 'E-mail invalido'})
    email: string;
    @MinLength(8, {message: 'A senha deve ter no mínimo 8 caracteres'})
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]+$/, {
        message: 'A senha deve conter letras e números',
    })
    password: string
}
