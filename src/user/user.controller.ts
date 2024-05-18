import { Body, Get, HttpCode, JsonController, NotFoundError, Param, Post, QueryParams, Session as SessionDecorator, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import { CreateAccountMiddleWare as CreateUserMiddleWare } from "@src/util/middlewares/createAccount.middleware";
import { AuthorizationMiddleware } from "@src/util/middlewares/authorization.middleware";
import { UserService } from "./user.services";
import { Role } from "@prisma/client"
import { Session } from "@src/types/session.interface";
import { GetAllUsersDTO } from "./dtos/getAllUsers.dto";
import { CreateUserDTO } from "./dtos/createUser.dto";
import { GetUserByIdDTO } from "./dtos/getUserById.dto";

@Service()
@AuthorizationMiddleware()
@JsonController('/user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @HttpCode(200)
    @Get('/session')
    async getSessionUser(@SessionDecorator() session: Session) {
        const userId = session.user?.id as string // can set this function o SessionService
        const user = await this.userService.getUserById({ userId })
        return user
    }

    @HttpCode(200)
    @AuthorizationMiddleware([Role.ADMIN])
    @Get('/all/')
    async getAllUsers(@QueryParams() { isActive, limit, offset }: GetAllUsersDTO) {
        const users = await this.userService.getAllUsers({ isActive, limit, offset })
        return users;
    }

    @HttpCode(200)
    @Get('/:id')
    async getUserById(@Param('id') userId : string) {
        const user = await this.userService.getUserById({ userId })
        return user
    }

    @UseBefore(CreateUserMiddleWare)
    @AuthorizationMiddleware([Role.ADMIN, Role.MANAGER])
    @HttpCode(201)
    @Post('/register/')
    async createUser(@Body() body: CreateUserDTO) {
        const user = await this.userService.createUser(body)
        return user
    }

    
}
