import { Service } from "typedi";
import { UserRepository } from "./user.repository";
import { GetUserByIdDTO } from "./dtos/getUserById.dto";
import { GetUserByEmailDTO } from "./dtos/getUserByEmail.dto";
import { CreateUserDTO } from "./dtos/createUser.dto";
import { GetAllUsersDTO } from "./dtos/getAllUsers.dto";


@Service()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository
    ) { }

    async getAllUsers({ isActive, limit, offset }: GetAllUsersDTO) {
        const users = await this.userRepository.getAllUsers({ isActive, limit, offset })
        return users
    }

    async getUserById({ userId }: GetUserByIdDTO) {
        const user = await this.userRepository.getUserById({ userId })
        return user
    }

    async getUserByEmail({ email }: GetUserByEmailDTO) {
        const user = await this.userRepository.getUserByEmail({ email })
        return user
    }


    async createUser(newUser: CreateUserDTO) {
        const user = await this.userRepository.createUser(newUser)

        return user
    }

    async updateUser() {
        const user = await this.userRepository.updateUser()
        return user
    }

    async deleteUser() {
        const user = await this.userRepository.deleteUser()
        return user
    }


}