import { SEARCH_KEYSTROKE } from './actions';


import { setStoreContext, Connect, StoreContext } from 'ajwah-store';
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
        this.store.select(state => state.search).subscribe(res => console.log('res', res));
    }
    componentWillUnmount() {

    }
    search() {
        this.store.dispatch(SEARCH_KEYSTROKE, 'java');
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

