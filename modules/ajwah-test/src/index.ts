import { skip } from 'rxjs/operators';
import { Observable } from 'rxjs';


export interface ajwahTestOptions<S>{
    build: ()=>Observable<S>,
    act?:()=>void,
    wait?: number,
    skip?:number,
    verify:(states:Array<S>)=>void,
    log?:(states:Array<S>)=>void,
    tearDown?:()=>void
}
export async function ajwahTest<S>(options:ajwahTestOptions<S>){
    const states:S[] = [];
    const stream = options.build();
    const subscription = stream.pipe( skip(options.skip||0)).subscribe(res=>{
        states.push(res);
    });
    if( typeof options.act === 'function'){
        await options.act();
    }
    if( typeof options.wait === 'number'){
        await new Promise(resolve=>{
            setTimeout(()=>{resolve('resume');},options.wait||0);
        });
    }
    await new Promise(resolve=>{
        setTimeout(()=>{resolve('resume');},0);
    });
    if( typeof options.log === 'function'){
       options.log(states);
    }
    await options.verify(states);
    if( typeof options.tearDown === 'function'){
       await options.tearDown();
    }
    subscription.unsubscribe();
}