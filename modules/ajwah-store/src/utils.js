
export function copyObj(obj) {
    return Array.isArray(obj) ? [...obj] : { ...obj };
}