import {StateObserver} from './stateObserver';
interface ValidatorParams {
    value: any,
    emitError: (errorMessage?: string) => void,
    values?: any
}
export interface FiledChange{
    observer:StateObserver,
    value:any,
    data:any,
    elm?:any
}

export type Validator = (args: ValidatorParams) => void

export function required(errorMessage:string):Validator {
    return ({value, emitError})=>{
        if(!value)emitError(errorMessage);
        else emitError('');
    }
}

export function min(num:number, errorMessage:string):Validator {
    return ({value, emitError})=>{
        if(value && +value > num)emitError(errorMessage);
        else emitError('');
    }
}

export function max(num:number, errorMessage:string):Validator {
    return ({value, emitError})=>{
        if(value && +value < num)emitError(errorMessage);
        else emitError('');
    }
}
export function maxLength(num:number, errorMessage:string):Validator {
    return ({value, emitError})=>{
        if(value && value.toString().length > num)emitError(errorMessage);
        else emitError('');
    }
}

export function minLength(num:number, errorMessage:string):Validator {
    return ({value, emitError})=>{
        if(value && value.toString().length < num)emitError(errorMessage);
        else emitError('');
    }
}
const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export function email(errorMessage:string):Validator {
    return ({value, emitError})=>{
        if(value && !emailReg.test(value))emitError(errorMessage);
        else emitError('');
    }
}
export function pattern(expression:RegExp, errorMessage:string):Validator {
    return ({value, emitError})=>{
        if(value && !expression.test(value))emitError(errorMessage);
        else emitError('');
    }
}