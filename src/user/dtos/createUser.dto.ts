import { IsString, IsStrongPassword, Matches, MaxLength } from "class-validator"
import { Match } from "@src/util/validators/match.validators"
import { type Role } from "@prisma/client"


const messages = {
    password: {
        weakPassword: "Weak password",
        maxLength: "Password must contain at most 48 characters",
        notEqual: "Passwords do not match"
    },
    role: {
        notMatch: "Invalid role"
    }
}

export class CreateUserDTO {

    @IsString()
    name: string

    @IsString()
    email: string

    @Matches(/^(ADMIN|MANAGER|NORMAL)$/g, {message: messages.role.notMatch})
    role: Role

    @IsString()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    }, {
        message: messages.password.weakPassword
    })
    @MaxLength(48, {
        message: messages.password.maxLength
    })
    password: string

    @IsString()
    @Match('password', { message: messages.password.notEqual })
    passwordConfirm: string
}