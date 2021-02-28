import {ajwahTest} from 'ajwah-test';
import {CounterController} from './counterController'

describe('counterState', ()=>{
  
    let cs:CounterController;
 
     beforeEach(()=>{
       cs=new CounterController();
     })
     afterEach(()=>{
       cs.dispose();
     }) 
 
     it('initial state', async()=> {
         await ajwahTest({
             build:()=> cs.stream$,
             verify:(states)=>{
                 expect(states[0]).toBe(2)
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
                 expect(states[0]).toBe(3)
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
                 expect(states[0]).toBe(1)
             }
         });
     });

     it('async increment', async()=> {
        await ajwahTest({
            build:()=> cs.stream$,
            act:()=>{
                cs.asyncInc()
            },
            skip:1 ,
            wait:1000,
            verify:(states)=>{
                expect(states[0]).toBe(3)
            }
        });
    });
 
 })
 