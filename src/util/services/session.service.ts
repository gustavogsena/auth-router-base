import session from "express-session";
import { Request, Session, SessionUserData } from "@src/types/session.interface"
import { SESSION_PERMITTED_ROLES } from "@src/types/role.type";
import { Role } from "@prisma/client"


/**
 * Service for handling express-session library.
 */
class SessionService {

    static sessionConfiguration(store?: session.Store) {
        return session({
            store,
            secret: process.env.SERVER_SESSION_SECRET!,
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 600000, httpOnly: false }
        })
    }

    static saveSession(req: Request, sessionUserData: SessionUserData): Promise<void> {
        return new Promise((resolve) => {
            req.session.user = sessionUserData;
            req.session.permittedRoles = SessionService.getSessionPermittedRoles(sessionUserData.role)

            req.session.save((err: any) => {
                if (err) throw new Error(SESSION_ERROR_MESSAGES.save)
                resolve()
            })
        })
    }

    static detroySession(req: Request): Promise<void> {
        return new Promise((resolve) => {
            // removing user data from session
            req.session.user = null
            req.session.permittedRoles = null
            req.session.destroy((err: any) => {
                if (err) throw new Error(SESSION_ERROR_MESSAGES.destroy)
                resolve()
            })
        });
    }

    static regenerateSession(req: Request, sessionData: SessionUserData): Promise<void> {
        return new Promise((resolve) => {
            req.session.regenerate((err: any) => {
                // req.session.user = sessionData;
                if (err) throw new Error(SESSION_ERROR_MESSAGES.regenerate)
                resolve()
            })
        });
    }

    static reloadSession(req: Request): Promise<void> {
        return new Promise((resolve) => {
            req.session.reload((err: any) => {
                if (err) throw new Error(SESSION_ERROR_MESSAGES.reload)
                resolve()
            })
        });
    }

    static isAdmin(session: Session): Boolean {
        return session.user?.role === Role.ADMIN
    }

    private static getSessionPermittedRoles(sessionRole: Role): Role[] {
        return SESSION_PERMITTED_ROLES[sessionRole]
    }
}

const SESSION_ERROR_MESSAGES = {
    reload: 'Reload session error',
    regenerate: 'Regenerate session error',
    save: 'Save session error',
    destroy: 'Destroy session error',
}


export default SessionService;