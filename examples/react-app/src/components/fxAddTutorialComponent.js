import React from 'react';
import { ADD_TUTORIAL } from "../states/actions";
import { getStore } from 'ajwah-react-store';

function onSubmit(event) {
    event.preventDefault();
    const el = event.target.elements;
    const model = { name: el.name.value, url: el.url.value }
    getStore().dispatch({ type: ADD_TUTORIAL, payload: model });
    el.name.value = '';
    el.url.value = '';
}
function addTutorial(props) {
    console.log('fx-add-tutorial-component')
    return <form onSubmit={onSubmit}>
        <input type="text" name="name" placeholder="Enter Name" />

        <input type="text" name="url" placeholder="Enter url" />

        <button type="submit" className="btn">Add Tutorial</button>
    </form>
}
export default addTutorial;
