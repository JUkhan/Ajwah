import React from 'react';
import { ADD_TUTORIAL } from "../states/actions";
import { getStore } from 'ajwah-react-store';

function onSubmit(event) {
    event.preventDefault();
    const el = event.target.elements;
    const model = { name: el.name.value, url: el.url.value }
    getStore().dispatch({ type: ADD_TUTORIAL, payload: model });
}
function addTutorial(props) {
    console.log('fx-add-tutorial-component')
    return <form onSubmit={onSubmit}>
        <div className="form-group">
            <label htmlFor="name">Tutorial Name</label>
            <input type="text" className="form-control" id="name" name="name" aria-describedby="emailHelp" placeholder="Enter Name" />
        </div>
        <div className="form-group">
            <label htmlFor="url">URL</label>
            <input type="text" className="form-control" id="url" name="url" aria-describedby="emailHelp" placeholder="Enter url" />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
    </form>
}
export default addTutorial;
