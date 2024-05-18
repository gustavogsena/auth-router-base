import JWT from "jsonwebtoken";

class JWTService {
    private static readonly JWT_SECRET = process.env.JWT_SECRET!

    static sign(payload: JWT.JwtPayload) {
        const token = JWT.sign(payload, this.JWT_SECRET)
        return token
    }

    static async verify(token: string) {
        try {
            const payload = JWT.verify(token, this.JWT_SECRET)
            return payload
        } catch (error) {
            throw new Error("Could not verify JWT Token")
        }
    }
}

export default JWTService