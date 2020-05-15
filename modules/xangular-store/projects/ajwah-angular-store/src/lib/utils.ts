
export function copyObj(obj) {
    return Array.isArray(obj) ? [...obj] : { ...obj };
}
export function flatMap(arr: any[]): any[] {
    return [].concat.apply([], arr);
}