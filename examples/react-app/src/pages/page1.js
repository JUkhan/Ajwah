import React, { PureComponent } from 'react';

import Counter from "../components/counterComponent";
import AddTutorial from "../components/addTutorialComponent";
import TutorialList from "../components/tutotialListComponent";

import { Connect, getStore } from 'ajwah-react-store';
import { INCREMENT, ASYNC_INCREMENT, DECREMENT } from '../states/actions';
import { tap, mapTo, flatMap } from 'rxjs/operators';
import { empty } from 'rxjs';
import NewCounter from '../components/newCounter';

@Connect({
    tutorials: state => state.tutorials,
    counter: state => state.counter
})
class Page1 extends PureComponent {
    componentWillMount() {
        console.log('com-will-mount');
        getStore().addEffect(action$ =>
            action$.ofType(INCREMENT)
                .pipe(
                    flatMap(res => {
                        console.log(res);
                        return empty();
                    })
                ), 'fx'
        )
        this.sub = getStore().select('counter').subscribe(res => console.log('res:::', res));
    }
    componentWillUnmount() {
        getStore().removeEffectsByKey('fx');
        this.sub.unsubscribe();
    }
    tutorialsHasNamedCounter() {
        return !!this.state.tutorials.find(_ => _.name === 'counter');
    }
    render() {
        console.log('page1');
        const { counter, tutorials } = this.state;
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
            <NewCounter vount="12"></NewCounter>
        </div>

    }
}

export default Page1;

