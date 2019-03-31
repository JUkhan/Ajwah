import React from 'react';
import { REMOVE_TUTORIAL } from "../states/actions";
import { getStore } from "ajwah-react-store";
import Counter from './fxCounterComponent';

function onRemove(name) {
    getStore().dispatch({ type: REMOVE_TUTORIAL, payload: name });
}
function tutorialList(props) {
    const { tutorials, counter } = props;
    console.log('fx-tutorial-list-component')
    return <React.Fragment>
        <div className="list-group">
            <a href="#" className="list-group-item list-group-item-action active">
                Tutorials  <Counter className="mb" counter={counter} />
            </a>
            {tutorials.map(t => <a href="#" className="list-group-item list-group-item-action" onClick={() => onRemove(t.name)} key={t.name} >{t.name}</a>)}

        </div>
    </React.Fragment>
}
export default tutorialList;