import { IsEmail, Matches, MinLength } from "class-validator";

export class CreateUserDto {
    name: string;
    @IsEmail({}, {message: 'E-mail invalido'})
    email: string;
    @MinLength(8, {message: 'A senha deve ter no mínimo 8 caracteres'})
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]+$/, {
        message: 'A senha deve conter letras e números',
    })
    password: string
}
