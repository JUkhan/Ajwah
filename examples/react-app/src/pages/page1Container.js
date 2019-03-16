import React, { PureComponent } from 'react';

import Counter from "../components/counterComponent";
import AddTutorial from "../components/addTutorialComponent";
import TutorialList from "../components/tutotialListComponent";

import { Connect } from 'ajwah-react-store';


@Connect({
    tutorials: state => state.tutorials
})
class Page1Container extends PureComponent {
    constructor() {
        super();
        this.state = { tutorials: [] }
    }
    tutorialsHasNamedCounter() {
        return !!this.state.tutorials.find(_ => _.name === 'counter');
    }
    render(props) {
        console.log('page1-container');
        return <div>
            {this.tutorialsHasNamedCounter() ?
                <div className="text-danger">Please remove counter tutorial.</div> : <Counter></Counter>}
            <div className="row">
                <div className="col-6">
                    <AddTutorial></AddTutorial>
                </div>
                <div className="col-6">
                    <TutorialList></TutorialList>
                </div>
            </div>
        </div>

    }
}

export default Page1Container;
