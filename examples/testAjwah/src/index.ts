import { SEARCH_KEYSTROKE } from './actions';


import { setStoreContext, Connect, StoreContext } from 'ajwah-react-store';
import SearchState from './SearchState';

import Effects from './Effects';

setStoreContext({
    states: [SearchState],
    effects: [Effects]
})

@Connect({
    search: state => state.search
})
class Component {
    state = {}
    store: StoreContext;
    constructor() {
        console.log('component....');

    }
    setState(newState) {
        this.state = { ...this.state, ...newState }
        console.log('setstate:', newState)
    }
    componentWillMount() {

    }
    componentWillUnmount() {

    }
    search() {
        this.store.dispatch({ type: SEARCH_KEYSTROKE, payload: 'java' });
    }
    render() {
        console.log(this.state);
    }
}

const com = new Component();
com.componentWillMount();
com.render();
com.search();
com.componentWillUnmount();

