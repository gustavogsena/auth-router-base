import { IsBoolean, IsInt, IsOptional } from "class-validator"


export class GetAllUsersDTO {

    @IsOptional()
    @IsBoolean()
    isActive?: boolean

    @IsOptional()
    @IsInt()
    limit: number

    @IsOptional()
    @IsInt()
    offset: number

    constructor() {
        this.limit = 10;
        this.offset = 0;
    }
}