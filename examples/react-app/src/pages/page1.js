import React, { PureComponent } from 'react';

import Counter from "../components/counterComponent";
import AddTutorial from "../components/addTutorialComponent";
import TutorialList from "../components/tutotialListComponent";

import { Connect } from 'ajwah-react-store';


@Connect({
    tutorials: state => state.tutorials,
    counter: state => state.counter
})
class Page1 extends PureComponent {

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
        </div>

    }
}

export default Page1;

