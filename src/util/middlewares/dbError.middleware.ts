import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientRustPanicError, PrismaClientUnknownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { Middleware, ExpressErrorMiddlewareInterface, NotFoundError } from 'routing-controllers';
import { DbError as DBError } from '../errors/db.error';
import { Service } from 'typedi';
import { Response } from 'express';

@Service()
@Middleware({ type: 'after', priority: 2 })
export class DbErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: Response, next: (err?: any) => any) {

        // Improvement: Add errors based on prisma code.
        try {
            if (error instanceof PrismaClientUnknownRequestError) {
                throw new DBError('PrismaClientUnknownRequestError', `Unknown Error`, [error])
            }
            if (error instanceof PrismaClientValidationError) {
                throw new DBError('PrismaClientValidationError', `Validation Error`, [error])
            }
            if (error instanceof PrismaClientRustPanicError) {
                throw new DBError('PrismaClientRustPanicError', `Critic Error`, [error])
            }
            if (error instanceof PrismaClientInitializationError) {
                throw new DBError('PrismaClientInitializationError', `Initialization Error`, [error])
            }
            if (error instanceof PrismaClientKnownRequestError) {
                
                // Idea of an error handler using prisma code

                switch (error.code) {
                    case "P2002": {
                        const modelName = error.meta?.modelName
                        const target = Array(error.meta?.target).join(', ')

                        throw new DBError('createProfile', `${target} already registered in the ${modelName} table`, [error])
                    }
                    case "P2025": {
                        throw new NotFoundError("Register not found in DB")
                    }

                    default: {
                        throw new DBError('PrismaClientKnownRequestError', `Known Error`, [error])
                    }
                }


            }

        } catch (error: any) {

            if (error instanceof DBError) {
                return response.status(error.httpCode).json(error)
            }
            
            return next(error)
        }

        next(error);
    }
}