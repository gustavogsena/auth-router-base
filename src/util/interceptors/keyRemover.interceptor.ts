import { Action, Interceptor, InterceptorInterface } from "routing-controllers";
import { Service } from "typedi";

@Service()
@Interceptor()
export class KeyRemoverInterceptor implements InterceptorInterface {
    intercept(action: Action, content: any) {
        if (Array.isArray(content)) {
            content.forEach(item => {
                if (item && typeof item === 'object') {
                    REMOVABLE_KEYS.forEach(keyToRemove => {
                        if (item.hasOwnProperty(keyToRemove)) delete item[keyToRemove]
                    })
                }
            })
        } else if (content && typeof content === 'object') {
            REMOVABLE_KEYS.forEach(keyToRemove => {
                if (content.hasOwnProperty(keyToRemove)) delete content[keyToRemove]
            })
        }

        return content
    }
}

const REMOVABLE_KEYS = ['password']