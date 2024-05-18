import { ExpressMiddlewareInterface, ForbiddenError } from 'routing-controllers';
import { Service } from 'typedi';
import { SESSION_ROLE_CREATION } from '@src/types/role.type';
import { Request } from '@src/types/session.interface';
import { Role } from "@prisma/client"


@Service()
export class CreateAccountMiddleWare implements ExpressMiddlewareInterface {
    use(request: Request, response: any, next: (err?: any) => any): void {
        const sessionRole: Role = request.session.user?.role as Role
        
        const newAccountRole = request.body.role?.toUpperCase()
        Object.assign(request.body, {Role: newAccountRole})
        if (sessionRole === Role.ADMIN) return next()

        if (!SESSION_ROLE_CREATION[sessionRole].includes(newAccountRole)) {
            throw new ForbiddenError("User role creation is not allowed by your role")
        }

        next()
    }
}


