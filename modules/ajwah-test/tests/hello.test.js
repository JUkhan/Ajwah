

import {ajwahTest} from '../dist/esm/index';

import {StateController} from 'ajwah-store'


export class CounterState extends StateController{
    constructor(){
        super({initialState:2})
    }
    increment(){
        this.update(state=>state+1)
    }
    decrement(){
        this.update(state=>state-1)
    }
}


describe('counter test', ()=>{
  
   let cs;

    beforeEach(()=>{
      cs=new CounterState();
    })


    it('initial state', async()=> {
        await ajwahTest({
            build:()=> cs.stream$,
            verify:(states)=>{
                expect(2).toBe(states[0])
            }
        });
    });

    it('increment', async()=> {
        await ajwahTest({
            build:()=> cs.stream$,
            act:()=>{
                cs.increment()
            },
            skip:1,
            verify:(states)=>{
                expect(3).toBe(states[0])
            }
        });
    });

    it('decrement', async()=> {
        await ajwahTest({
            build:()=> cs.stream$,
            act:()=>{
                cs.decrement()
            },
            skip:1,
            verify:(states)=>{
                expect(1).toBe(states[0])
            }
        });
    });

})
