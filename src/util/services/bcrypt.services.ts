import * as bcrypt from 'bcrypt';
import { Service } from 'typedi';

/**
* Service for handling cryptographic operations.
*/
@Service()
export class CryptService {

    public readonly crypto = bcrypt
    private readonly rounds = 10

    /**
    * Compare a text and a hashedText
    */
    async compare(plainText: string, hashedText: string): Promise<Boolean> {
        const isEquals = await this.crypto.compare(plainText, hashedText);
        return isEquals;
    }

    /**
     * Hash a text
     */
    async hash(plainText: string): Promise<string> {
        const hashedText = await this.crypto.hash(plainText, this.rounds);
        return hashedText
    }

}    