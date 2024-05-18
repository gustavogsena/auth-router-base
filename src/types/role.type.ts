import { Role } from "@prisma/client"

export const SESSION_PERMITTED_ROLES: { [key in Role]: Role[] } = {
    ADMIN: [Role.NORMAL, Role.MANAGER],
    MANAGER: [Role.NORMAL],
    NORMAL: [],
}

export const SESSION_ROLE_CREATION: { [key in Role]: Role[] } = {
    ADMIN: [Role.NORMAL, Role.MANAGER],
    MANAGER: [Role.NORMAL],
    NORMAL: [],
}
