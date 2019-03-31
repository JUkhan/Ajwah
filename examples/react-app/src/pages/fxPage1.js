import React, { useState, useEffect } from 'react';
import Counter from "../components/fxCounterComponent";
import AddTutorial from "../components/fxAddTutorialComponent";
import TutorialList from "../components/fxTutotialListComponent";
import { getStore } from 'ajwah-react-store';

function page1() {

    const [tutorials, setTutorial] = useState([]);
    const [counter, setCounter] = useState({});


    useEffect(() => {
        const subs = getStore().select('tutorials').subscribe(res => setTutorial(res));
        subs.add(getStore().select('counter').subscribe(res => setCounter(res)));

        return () => subs.unsubscribe();
    }, []);

    function tutorialsHasNamedCounter() {
        return !!tutorials.find(_ => _.name === 'counter');
    }

    console.log('fx-page1');

    return <div>
        {tutorialsHasNamedCounter() ?
            <div className="text-danger">Please remove counter tutorial.</div> : <Counter counter={counter}></Counter>}
        <div className="row">
            <div className="col-6">
                <AddTutorial></AddTutorial>
            </div>
            <div className="col-6">
                <TutorialList tutorials={tutorials} counter={counter}></TutorialList>
            </div>
        </div>

    </div>


}

export default page1;

