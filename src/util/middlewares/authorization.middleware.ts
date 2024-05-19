import { UseBefore } from 'routing-controllers';
import { Request } from '@src/types/session.interface';
import { AccessDeniedError } from '@src/util/errors/accessDenied.error';
import { Role } from "@prisma/client"


export function Authorization(allowedRole: Role[] = []) {
    return (request: Request, response: any, next: (err?: any) => any): void => {
        if (request.session && request.session.user) {
            const user = request.session.user
            if (user && !allowedRole.length) return next()
            if (user && allowedRole.some(role => user.role === role || user.role === Role.ADMIN)) return next()
        }
        next(new AccessDeniedError(request))
    }
}

export function AuthorizationMiddleware(allowedRole: Role[] = []) {
    return UseBefore(Authorization(allowedRole));
}

