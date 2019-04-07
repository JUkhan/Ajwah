import React, { PureComponent } from 'react';
import { REMOVE_TUTORIAL } from "../states/actions";
import { getStore } from "ajwah-store";
import Counter from './counterComponent';


class TutorialList extends PureComponent {

    onRemove(name) {
        getStore().dispatch({ type: REMOVE_TUTORIAL, payload: name });
    }
    render() {
        const { tutorials, counter } = this.props;
        console.log('tutorial-list-component')
        return <React.Fragment>
            <div className="list-group">
                <a href="#" className="list-group-item list-group-item-action active">
                    Tutorials  <Counter className="mb" counter={counter} />
                </a>
                {tutorials.map(t => <a href="#" className="list-group-item list-group-item-action" onClick={() => this.onRemove(t.name)} key={t.name} >{t.name}</a>)}

            </div>
        </React.Fragment>

    }
}
export default TutorialList;