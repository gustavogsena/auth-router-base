import { IsString } from "class-validator"


export class GetUserByEmailDTO {

    @IsString()
    email: string

}