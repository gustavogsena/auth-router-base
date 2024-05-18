import { User } from "@prisma/client"
import { Action } from "routing-controllers"
import Container from "typedi"
import { Request } from "@src/types/session.interface"
import { UserRepository } from "@src/user/user.repository"

/**
 * Checker for handling routing-controllers checker options
 */
class Checker {
    private static userRepository = Container.get(UserRepository)

    // Not in use. 
    // authorizationChecker from routing-controllers acts after middlewares
    // The option was to create an high priority Authorization middleware for it.
    static async authorizationChecker(action: Action, roles: string[]) {

        if (action.request.session && action.request.session.user) {
            const user = action.request.session.user
            if (user && !roles.length) return true
            if (user && roles.some(role => user.role === role || user.role === "ADMIN")) return true
            else return false
        }
        return false
    }

    static async currentUserChecker(action: Action) {
        const request = action.request as Request
        if (request && request.session.user) {
            const userId = request.session.user.id
            const currentUserAccount = await Checker.userRepository.getUserById({ userId })

            return currentUserAccount
        }

        return false
    }

}


export type CurrentUserAccount = User

export default Checker;