import React, { PureComponent } from 'react';
import { ADD_TUTORIAL } from "../states/actions";
import { dispatch } from 'ajwah-store';


class AddTutorial extends PureComponent {
    onSubmit = event => {
        event.preventDefault();
        const el = event.target.elements;
        const model = { name: el.name.value, url: el.url.value }
        debugger
        dispatch({ type: ADD_TUTORIAL, payload: model });
    }
    render() {
        console.log('add-tutorial-component')
        return <form onSubmit={this.onSubmit}>
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
}
export default AddTutorial;
