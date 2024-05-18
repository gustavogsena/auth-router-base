import { Authorized, BadRequestError, Body, CurrentUser, Get, JsonController, Post, Req, Res, Session, UnauthorizedError } from "routing-controllers";
import { LoginDTO } from "./dtos/login.dto";
import { AuthService } from "./auth.service";
import { Service } from "typedi";
import { Response } from "express";
import SessionService from "../util/services/session.service";
import { Request, SessionUserData } from "@src/types/session.interface";
import { AuthorizationMiddleware } from "@src/util/middlewares/authorization.middleware";

@Service()
@JsonController('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/login')
    async login(@Req() req: Request, @Body() login: LoginDTO) {

        const userData: SessionUserData = await this.authService.login(login)

        return SessionService.regenerateSession(req, userData).then(() => {
            return SessionService.saveSession(req, userData).then(() => {

                return {
                    access: userData.role,
                    name: userData.name,
                    companyName: userData.email
                }
            })

        })
    }

    @AuthorizationMiddleware()
    @Post('/logout')
    async logout(@Res() res: Response, @Req() req: Request) {

        return SessionService.detroySession(req).then(() => {

            return res.clearCookie('connect.sid').status(200).json({
                status: "success",
                message: "Logout realizado"
            })
        })
    }



}