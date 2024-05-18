import { ForbiddenError } from "routing-controllers";
import { Request } from "@src/types/session.interface";

export class AccessDeniedError extends ForbiddenError {
    public name: string = 'AccessDeniedError';
    public message: string;
    public args: any[];

    constructor(request: Request) {
        super();
        Object.setPrototypeOf(this, AccessDeniedError.prototype);
        const uri = `${request.method} ${request.url}`; 
        this.message = `Access denied for request on ${uri}`;
    }

    toJSON() {
        return {
            status: this.httpCode,
            name: this.name,
            message: this.message,
        };
    }

}