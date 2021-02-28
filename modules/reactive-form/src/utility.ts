export const RESET = Symbol('reset');
export const REFRESH = Symbol('refresh');
export const AUTO_FOCUS = Symbol('auto_focus');
export const CHECK_ERROR = Symbol('check_error');

export function toMultiKeys(obj: any) {
    return Object.keys(obj).reduce((nobj: any, key: string) => {
        const keys = key.split('.'), len = keys.length;
        if (len > 1) {
            let currentProp = nobj[keys[0]] || (nobj[keys[0]] = {}), i = 1;
            while (i < len - 1) {
                currentProp = currentProp[keys[i]] || (currentProp[keys[i]] = {});
                i++;
            }
            currentProp[keys[i]] = obj[key];
        } else {
            nobj[key] = obj[key];
        }
        return nobj;
    }, {});
}

function isPlainObj(o: any) {
    return typeof o == 'object' && o.constructor == Object;
}

export function toSingleKey(obj: any) {
    let res: any = {};
    function helper(dic: any, keys: string[]) {
        for (let key in dic) {
            keys.push(key)
            if (isPlainObj(dic[key])) {
                helper(dic[key], keys);
                keys = [];
            }
            else {
                res[keys.join('.')] = dic[key];
                keys.pop();
            }
        }
    }
    helper(obj, []);
    return res;
}
