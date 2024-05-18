import { ValidationError } from 'class-validator';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { Service } from 'typedi';

@Service()
@Middleware({ type: 'after', priority: 3 })
export class ValidationErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: (err?: any) => any) {
        if (error.name === 'BadRequestError' && Array.isArray(error.errors) && error.errors.some((err: Error) => err instanceof ValidationError)
        ) {
            // Return the first message of the validation error
            const [message] = Object.values(error.errors[0].constraints);
            return response.status(error.httpCode).json({ message });
        }

        next(error)
    }
}