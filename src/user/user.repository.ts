import { Service } from "typedi";
import { GetAllUsersDTO } from "./dtos/getAllUsers.dto";
import { CreateUserDTO } from "./dtos/createUser.dto";
import { CryptService } from "../util/services/bcrypt.services";
import { GetUserByIdDTO } from "./dtos/getUserById.dto";
import { GetUserByEmailDTO } from "./dtos/getUserByEmail.dto";
import { PrismaClient } from "@src/util/services/prisma.service";

@Service()
export class UserRepository {
    constructor(
        private readonly prismaClient: PrismaClient,
        private readonly cryptService: CryptService
    ) { }

    async getAllUsers({ isActive, limit, offset }: GetAllUsersDTO) {
        const options: { where?: { isActive?: boolean }, take?: number, skip?: number } = {}

        if (isActive !== undefined) {
            options.where = { isActive };
        }
        if (limit) {
            options.take = limit;
        }
        if (offset) {
            options.skip = offset;
        }
        const users = await this.prismaClient.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                role: true,
                isActive: true,
                password: false
            },
            ...options,
        })

        return users

    }

    async getUserById({ userId }: GetUserByIdDTO) {
        const user = await this.prismaClient.user.findUniqueOrThrow({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                role: true,
                isActive: true,
                password: true
            },
            where: {
                id: userId
            }
        })
console
        return user
    }

    async getUserByEmail({ email }: GetUserByEmailDTO) {
        const user = await this.prismaClient.user.findUniqueOrThrow({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                role: true,
                isActive: true,
                password: true
            },
            where: {
                email
            },
        })

        return user
    }

    async createUser({ name, email, role, password }: CreateUserDTO) {
        const hashedPassword = await this.cryptService.hash(password)
        const user = await this.prismaClient.user.create({
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            },
            data: {
                name,
                password: hashedPassword,
                email,
                role
            }
        })

        return user
    }

    async updateUser() { }

    async deleteUser() { }

}