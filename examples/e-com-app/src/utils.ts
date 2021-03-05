type param = string|{[key:string]:boolean}
export function classNames(...names:param[]):string {
    return names.reduce((arr:string[], item:param)=>{
        switch (typeof item) {
            case 'string':
                arr.push(item)
                break;
        
            case 'object':
                arr.push(...Object.entries(item).filter(([key, value])=>value).map(([k])=>k))
                break;
                
        }
        return arr;
    },[]).join(' ');
    
}