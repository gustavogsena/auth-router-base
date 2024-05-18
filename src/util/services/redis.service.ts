import RedisStore from "connect-redis"
import { Redis } from "ioredis"



class RedisService {
    private static readonly REDIS_PREFIX : string = 'facilitajuridico:'
    private static readonly REDIS_URL = process.env.SERVER_REDIS_URL!

    static client() {
        if (!this.REDIS_URL) {
            throw new Error('SERVER_REDIS_URL is not defined');
        }
        return new Redis(this.REDIS_URL)
    }

    static store() {
        return new RedisStore({
            client: RedisService.client(),
            prefix: this.REDIS_PREFIX
        })
    }

}

export default RedisService

