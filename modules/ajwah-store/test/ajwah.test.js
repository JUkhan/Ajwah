import { take, mapTo } from "rxjs/operators"
import { Tutorial, Todo } from './store/states'
import { TutorialEffect } from './store/effects'
import { ofType } from '../src/index'

function delay(milis) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(milis)
        }, milis);
    })
}

describe('ajwah', () => {
    afterAll(() => {
        store.dispose()
    })

    it('counter initialState:{count:0,isLoading:false}', done => {
        store.select('counter').pipe(take(1)).subscribe(res => {
            expect(res).toEqual({ count: 0, isLoading: false })
        }, done, done)


    })

    it('inc: {count:1,isLoading:false}', done => {

        store.dispatch('Inc')
        store.select('counter').pipe(take(1)).subscribe(res => {
            expect(res).toEqual({ count: 1, isLoading: false })
        }, done, done)

    })

    it('asyncInc: very first time counter state should be:{count:1,isLoading:true} \nand after 1ms it should be:{count:2,isLoading:false}', (done) => {
        let isFirst = true
        store.dispatch('AsyncInc')
        store.select('counter').pipe(take(2)).subscribe(res => {
            if (isFirst)
                expect(res).toEqual({ count: 1, isLoading: true })
            else
                expect(res).toEqual({ count: 2, isLoading: false })
            isFirst = false
        }, done, done)

    })

    it('dec:{count:1,isLoading:false}', done => {
        store.dispatch('Dec')
        store.select('counter').pipe(take(1)).subscribe(res => {
            expect(res).toEqual({ count: 1, isLoading: false })
        }, done, done)

    })

    it('adding state on the fly(tutorial):{data:[]}', done => {
        store.addState(Tutorial)
        store.select('tutorial').pipe(take(1)).subscribe(res => {
            expect(res.data.length).toBe(0)
        }, done, done)

    })

    it('add tutorial:{data:[{id:1,name:"tutorial1"}]}', done => {
        store.dispatch('Add', { id: 1, name: 'tutorial1' })
        store.select('tutorial').pipe(take(1)).subscribe(res => {
            expect(res.data.length).toBe(1)
        }, done, done)

    })

    it('adding effects on the fly(tutorialEffects): counter state should be mutated:{ count: 2, isLoading: false }\nbecause it has(Inc,Dec) effects for (Add, Remove) actions', done => {
        store.addEffects(TutorialEffect)
        store.select('counter').pipe(take(1)).subscribe(res => {
            expect(res).toEqual({ count: 2, isLoading: false })
        }, done, done)

    })

    it('remove tutorial: states updated as:tutorial:{data:[]},counter:{count: 1, isLoading: false}', done => {
        store.dispatch('Remove', 1)
        store.select(state => ({ tutorial: state.tutorial, counter: state.counter })).pipe(take(1)).subscribe(res => {
            expect(res.tutorial.data.length).toBe(0)
            expect(res.counter).toEqual({ count: 1, isLoading: false })
        }, done, done)


    })

    it('remove dynamic effects', done => {
        store.removeEffectsByKey('dynamicKey');
        store.dispatch('Add', { id: 1, name: 'tutorial1' })
        store.select(state => ({ tutorial: state.tutorial, counter: state.counter })).pipe(take(1)).subscribe(res => {
            expect(res.tutorial.data.length).toBe(1)
            expect(res.counter).toEqual({ count: 1, isLoading: false })
        }, done, done)

    })

    it('add tutorial:{data:[{id:1,name:"tutorial1"},{ id: 2, name: "tutorial2" }]} \nbut no mutation in counter state because effects has been removed', done => {
        store.dispatch('Add', { id: 2, name: 'tutorial2' })
        store.select(state => ({ tutorial: state.tutorial, counter: state.counter })).pipe(take(1)).subscribe(res => {
            expect(res.tutorial.data.length).toBe(2)
            expect(res.counter).toEqual({ count: 1, isLoading: false })
        }, done, done)
    })

    it('adding a single effect on the fly whose key is "cool"\nnow if you remove a tutorial it should have an effect for counter state(Dec)\ntutorial:{data:[{id:1,name:"tutorial1"}]}, counter:{count:0, isLoading:false}', done => {
        store.addEffect((action$) => {
            return action$.pipe(
                ofType('Remove'),
                mapTo({ type: 'Dec' })
            )
        }, 'cool')
        store.dispatch('Remove', 2)
        store.select(state => ({ tutorial: state.tutorial, counter: state.counter })).pipe(take(1)).subscribe(res => {
            expect(res.tutorial.data.length).toBe(1)
            expect(res.counter).toEqual({ count: 0, isLoading: false })
        }, done, done)
    })

    it('remove tutorial one more time\ntutorial:{data:[]}, counter:{count:-1, isLoading:false}', done => {

        store.dispatch('Remove', 1)
        store.select(state => ({ tutorial: state.tutorial, counter: state.counter })).pipe(take(1)).subscribe(res => {
            expect(res.tutorial.data.length).toBe(0)
            expect(res.counter).toEqual({ count: -1, isLoading: false })
        }, done, done)
    })

    it('add tutorial:{data:[{id:1,name:"tutorial1"}]}:\ntutorial:{data:[id: 1, name: "tutorial1" }]}, counter:{count:-1, isLoading:false}', done => {
        store.dispatch('Add', { id: 1, name: 'tutorial1' })
        store.select('tutorial').pipe(take(1)).subscribe(res => {
            expect(res.data.length).toBe(1)
        }, done, done)

    })

    it('removing "cool" effect: if we remove tutorial now there should have no effect for counter state(Dec).\ntutorial:{data:[]},counter:{ count: -1, isLoading: false }', done => {
        store.removeEffectsByKey('cool');
        store.dispatch('Remove', 1)
        store.select(state => ({ tutorial: state.tutorial, counter: state.counter })).pipe(take(1)).subscribe(res => {
            expect(res.tutorial.data.length).toBe(0)
            expect(res.counter).toEqual({ count: -1, isLoading: false })
        }, done, done)

    })
    it('adding a todo state on the fly and this state has an effect on Dec action \nthat mutate counter state(Inc). counter:{ count: -1, isLoading: false }', done => {
        store.addState(Todo)
        store.dispatch('Dec')
        store.select('counter').pipe(take(1)).subscribe(res => {
            expect(res).toEqual({ count: -1, isLoading: false })
        }, done, done)
    })

    it('if we remove todo state then effects of this class \nshould be removed successfully. counter:{ count: -2, isLoading: false }', done => {
        store.removeState('todo')
        store.dispatch('Dec')
        store.select('counter').pipe(take(1)).subscribe(res => {
            expect(res).toEqual({ count: -2, isLoading: false })
        }, done, done)
    })

    it('adding and removing todo state several of times: its working properly.\ntodo:{data:[]}, counter:{ count: 1, isLoading: false }', done => {
        store.addState(Todo)
        store.dispatch('Inc').dispatch('Inc').dispatch('Inc').dispatch('Dec')
        store.removeState('todo')
        store.addState(Todo)
        store.dispatch('AddTodo', 'one').dispatch('AddTodo', 'two')
        store.removeState('todo')
        store.addState(Todo)
        store.select(state => ({ todo: state.todo, counter: state.counter })).pipe(take(1)).subscribe(res => {
            expect(res.todo.data.length).toBe(0)
            expect(res.counter).toEqual({ count: 1, isLoading: false })
        }, done, done)

    })

})