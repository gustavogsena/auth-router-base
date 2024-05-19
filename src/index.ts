import 'reflect-metadata'
import * as dotenv from 'dotenv';
dotenv.config();
import { useContainer, useExpressServer } from 'routing-controllers';
import express from 'express';
import { Container } from 'typedi';
import SessionService from './util/services/session.service';
import RedisService from './util/services/redis.service';
import { AuthController } from './auth/auth.controller';
import { DbErrorHandler } from './util/middlewares/dbError.middleware';
import { HttpErrorHandler } from './util/middlewares/httpError.middleware';
import Checker from '@src/util/services/checker.service';
import { UserController } from '@src/user/user.controller';
import { ValidationErrorHandler } from '@src/util/middlewares/validationError.middleware';
import { KeyRemoverInterceptor } from '@src/util/interceptors/keyRemover.interceptor';
import { Server } from 'node:http';


useContainer(Container);

const port = Number(process.env.SERVER_PORT)
const host = process.env.SERVER_HOST!

const store = RedisService.store();

const app = express()
app.use(SessionService.sessionConfiguration(store))
app.use(express.json())
useExpressServer(app, {
    currentUserChecker: Checker.currentUserChecker,
    validation: { whitelist: true },
    cors: true,
    controllers: [AuthController, UserController],
    middlewares: [HttpErrorHandler, DbErrorHandler, ValidationErrorHandler],
    interceptors: [KeyRemoverInterceptor],
    defaultErrorHandler: false
});

let server: Server;
app.set('trust proxy', 1)
if (process.env.NODE_ENV !== 'test') {
    server = app.listen(port, host, () => {
        console.log(`Servidor iniciado em ${host}:${port}`)
    })
}

export default app
export { server }

