
import React, { useState, useEffect } from 'react';
import Counter from "../components/fxCounterComponent";
import AddTutorial from "../components/fxAddTutorialComponent";
import TutorialList from "../components/fxTutotialListComponent";
import { store } from 'ajwah-store';
import { DYNAMIC_EFFECTS_KEY } from '../states/actions'
import CounterEffect from "../states/counterEffects";
import TutorialState from "../states/tutoroalState";
import { useSubscriptions } from 'react-ajwah'

function page3() {
    //const store = store();
    const [tutorials, setTutorial] = useState([]);
    const { counter } = useSubscriptions(['counter']);


    useEffect(() => {
        //store.addStates(TutorialState);
        const subs = store().select('tutorials').subscribe(res => setTutorial(res));
        //subs.add(store.select('counter').subscribe(res => setCounter(res)));

        return () => {
            subs.unsubscribe();
            console.log('unsubscribe....')
            //store.removeStates('tutorials');
        }
    }, []);

    function tutorialsHasNamedCounter() {
        return tutorials && !!tutorials.find(_ => _.name === 'counter');
    }

    console.log('fx-page3');

    return <div>
        {tutorialsHasNamedCounter() ?
            <div className="text-danger">Please remove counter tutorial.</div> : <Counter counter={counter}></Counter>}
        {tutorials && <div>
            <AddTutorial></AddTutorial>
            <TutorialList tutorials={tutorials} counter={counter}></TutorialList>
        </div>}
        <hr />
        <p>async(+) should not work(except shown 'loading...'). Until you click on Add Effects button or Add Tutorial State  button (asyncInc effect also declared in 'TutorialState'. If you remove 'TutorialState', effects inside this class should be removed also)</p>
        <button onClick={addEffect} className="btn btn-primary">Add Effects</button>
        <button onClick={removeEffect} className="btn btn-danger">Remove Effects</button>
        <hr />
        <button onClick={addState} className="btn btn-primary">Add Tutorial State</button>
        <button onClick={removeState} className="btn btn-danger">Remove Tutorial State</button>
        <hr />

    </div>


}
function addEffect() {
    store().addEffects(CounterEffect);
}
function removeEffect() {
    store().removeEffectsByKey(DYNAMIC_EFFECTS_KEY);
}
function addState() {
    store().addState(TutorialState);
}
function removeState() {
    store().removeState('tutorials')
}

export default page3;

