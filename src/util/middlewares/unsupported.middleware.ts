import app from '@src/index';
import { Request } from '@src/types/session.interface';
import { Middleware, ExpressErrorMiddlewareInterface, HttpError, ExpressMiddlewareInterface, NotFoundError } from 'routing-controllers';
import { Service } from 'typedi';

/** 
* (In development)
* Throw NotFoundError for not Allowed routes
*/
@Service()
@Middleware({ type: 'before' })
export class UnsupportedRouteHandler implements ExpressMiddlewareInterface {
    use(request: Request, response: any, next: (err?: any) => any): void {
        const routes: string[] = app._router.stack.filter((r: any) => r.route)
            .map((r: any) => r.route.path.replace(/\//g, ''))

        const nomalizeUrl = request.url.replace(/(\/)|(\?.*$)/g, '') // remove queryURLs and slashes
        if (routes.includes(nomalizeUrl)) return next()
        return next(new NotFoundError());
    }
}