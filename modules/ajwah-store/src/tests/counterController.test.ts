import {CounterController} from './counterController';
import {ajwahTest} from 'ajwah-test';
import { dispatch } from '../dispatch';
import {actions$} from '../actions'

  
  describe("counterController", () => {
    let cs: CounterController;
  
    beforeEach(() => {
      cs = new CounterController();
    });
  
    afterEach(()=>{
        cs.dispose();
    });
    
    it("initial state", async () => {
      await ajwahTest({
        build: () => cs.stream$,
        verify: (states) => {
          expect(states[0]).toMatchObject({count:2, isLoading:false})
        },
      });
    });
  
    it("increment", async () => {
      await ajwahTest({
        build: () => cs.stream$,
        act: () => {
          cs.increment();
        },
        skip: 1,
        verify: (states) => {
          expect(states[0]).toMatchObject({count:3, isLoading:false})
        },
      });
    });
  
    it("decrement", async () => {
      await ajwahTest({
        build: () => cs.stream$,
        act: () => {
          cs.decrement();
        },
        skip: 1,
        verify: (states) => {
          expect(states[0]).toMatchObject({count:1, isLoading:false});
        },
      });
    });

    it('async-inc', async () => {
        await ajwahTest({
            build: () => cs.stream$,
            act: () => {
              dispatch({type:'async-inc'})
            },
            skip: 1,
            verify: (states) => {
              expect(states[0]).toMatchObject({count:2, isLoading:true})
              expect(states[1]).toMatchObject({count:3, isLoading:false})
            },
          });
    });

    it("importState", async () => {
      await ajwahTest({
        build: () => cs.stream$,
        act: () => {
          cs.importState({count:101, isLoading:false})
        },
        skip: 1,
        verify: (states) => {
          expect(states[0]).toMatchObject({count:101, isLoading:false});
        },
      });
    });

    it("exportstate", async () => {
      await ajwahTest({
        build: () => cs.exportState(),
        act: () => {
         dispatch('inc')
        },
        skip: 1,
        verify: (states) => {
          expect(states[0][0]).toMatchObject({type:'inc', payload:undefined});
          expect(states[0][1]).toMatchObject({count:3, isLoading:false});
        },
      });
    });

    

    it("java-loom action", async () => {
      await ajwahTest({
        build: () => cs.stream$,
        act: () => {
          cs.importState({count:0, isLoading:false})
          dispatch('java-loom')
        },
        skip: 2,
        verify: (states) => {
          expect(states[0]).toMatchObject({count:1, isLoading:false})
        },
      });
    });

  
    it("select()", async () => {
      await ajwahTest({
        build: () => cs.select(state=>state.count),
        act: () => {
          cs.importState({count:0, isLoading:false})
          dispatch('java-loom')
        },
        skip: 2,
        verify: (states) => {
          expect(states[0]).toEqual(1)
        },
      });
    });

    it('throw TypeError if input is not a function', ()=>{
      expect(() => {cs.select(234 as any)}).toThrow(TypeError);
    })

    it("awesome", async () => {
      await ajwahTest({
        build: () => actions$.whereType('awesome'),
        act: () => {
          
          dispatch('awesome')
        },
        verify: (states) => {
          expect(states[0].type).toEqual('awesome')
        },
      });
    });

    it("emit-anything without object-does not merge with current state", async () => {
      await ajwahTest({
        build: () => cs.stream$,
        act: () => {
          cs.emit(101)
        },
        skip:1,
        verify: (states) => {
          expect(states[0]).toEqual(101)
        },
      });
    });

    it("dispose", async () => {
      await ajwahTest({
        build: () => cs.stream$,
        act: () => {
          cs.importState({count:0, isLoading:false})
          cs.dispose();
          dispatch('inc')
          cs.increment()
        },
        skip:1,
        verify: (states) => {
          expect(states.length).toEqual(1)
        },
      });
    });
    it("incrementNext action", async () => {
      await ajwahTest({
        build: () => cs.stream$,
        act: () => {
          cs.importState({count:0, isLoading:false})
          dispatch('incrementNext')
        },
        skip: 2,
        verify: (states) => {
          expect(states[0]).toMatchObject({count:5, isLoading:false})
        },
      });
    });
  });
