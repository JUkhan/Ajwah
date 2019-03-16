import React, { PureComponent } from 'react';
import { REMOVE_TUTORIAL } from "../states/actions";
import { Connect } from "ajwah-react-store";

@Connect({
    tutorials: state => state.tutorials
})
class TutorialList extends PureComponent {

    onRemove(name) {
        this.store.dispatch({ type: REMOVE_TUTORIAL, payload: name });
    }
    render() {
        const { tutorials } = this.state;
        console.log('tutorial-list-component')
        return <div className="list-group">
            <a href="#" className="list-group-item list-group-item-action active">
                Tutorials
            </a>
            {tutorials.map(t => <a href="#" className="list-group-item list-group-item-action" onClick={() => this.onRemove(t.name)} key={t.name} >{t.name}</a>)}


        </div>
    }
}
export default TutorialList;