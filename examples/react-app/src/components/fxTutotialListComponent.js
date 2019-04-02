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
        <ul className="list-group">
            <li className="list-group-item">Tutorials</li>
            {tutorials.map(t => <li className="list-group-item" key={t.name} >{t.name} <span className="del" onClick={() => onRemove(t.name)}>x</span></li>)}
        </ul>
        <Counter counter={counter} />
    </React.Fragment>
}
export default tutorialList;