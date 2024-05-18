import { LoginDTO } from "./dtos/login.dto";
import { CryptService } from "../util/services/bcrypt.services";
import { UnauthorizedError } from "routing-controllers";
import { Service } from "typedi";
import { SessionUserData } from "@src/types/session.interface";
import { UserRepository } from "@src/user/user.repository";

@Service()
export class AuthService {
    constructor(
        private readonly cryptService: CryptService,
        private readonly userRepository: UserRepository
    ) { }

    async login({ email, loginPassword }: LoginDTO): Promise<SessionUserData> {
        const user = await this.userRepository.getUserByEmail({ email })
        await this.validateCredentials(loginPassword, user.password)

        const { password, createdAt, updatedAt, isActive, ...userData } = user

        return userData
    }

    private async validateCredentials(password: string, dbPassword: string): Promise<boolean> {
        if (!await this.cryptService.compare(password, dbPassword)) throw new UnauthorizedError(messages.wrongPassword)
        else return true;
    }
}


const messages = {
    wrongPassword: "Credenciais inválidas"
}