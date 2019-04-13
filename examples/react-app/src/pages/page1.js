import React, { PureComponent } from 'react';

import Counter from "../components/counterComponent";
//import Counter from "../components/fxCounterComponent";

//import AddTutorial from "../components/addTutorialComponent";
import AddTutorial from "../components/fxAddTutorialComponent";
//import TutorialList from "../components/tutotialListComponent";
import TutorialList from "../components/fxTutotialListComponent";

import { Connect, getStore } from 'ajwah-store';
import { INCREMENT, ASYNC_INCREMENT, DECREMENT } from '../states/actions';
import { tap, mapTo, flatMap } from 'rxjs/operators';
import { empty } from 'rxjs';
import NewCounter from '../components/newCounter';

/*@Connect({
    tutorials: state => state.tutorials,
    counter: state => state.counter
})*/
class Page1 extends PureComponent {
    constructor() {
        super()
        Connect({
            tutorials: state => state.tutorials,
            counter: state => state.counter
        }, this)
    }
    componentWillMount() {
        console.log('componentWillMount');
    }
    componentWillUnmount() {
        console.log('componentWillUnmount');
    }
    tutorialsHasNamedCounter() {
        return !!this.state.tutorials.find(_ => _.name === 'counter');
    }
    render() {
        console.log('page1');
        const { counter, tutorials = [] } = this.state;
        return <div>
            {this.tutorialsHasNamedCounter() ?
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
}

export default Page1;

