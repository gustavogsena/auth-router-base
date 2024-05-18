import { HttpError } from "routing-controllers";
/* 
https://www.postgresql.org/docs/12/errcodes-appendix.html
*/
export class DbError extends HttpError {
    public operationName: string;
    public message: string;
    public args: any[];

    constructor(operationName: string, message: string, args: any[] = []) {
        super(500);
        Object.setPrototypeOf(this, DbError.prototype);
        this.operationName = operationName;
        this.message = message;
        this.args = args; // can be used for internal logging
    }

    toJSON() {
        return {
            status: this.httpCode,
            message: this.message,
            failedOperation: this.operationName,
        };
    }
}