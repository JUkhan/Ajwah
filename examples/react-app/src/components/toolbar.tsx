import React from 'react';
import store from "../states/store";
import { useStream } from "../states/useStream";
import {
    TodoActions,
    SearchCategory,
    searchCategory$,
    activeItem$,
} from "../services/todoService";

function all() {
    store.dispatch(TodoActions.searchCategory, SearchCategory.all);
}
function active() {
    store.dispatch(TodoActions.searchCategory, SearchCategory.active);
}
function completed() {
    store.dispatch(TodoActions.searchCategory, SearchCategory.completed);
}
function btnClasses(isActive: boolean) {
    return `mr-2 text-blue-500 hover:text-blue-800 ${isActive ? 'active' : ''}`
}
export default () => {
    const sc = useStream(searchCategory$, 1);
    const activeItem = useStream(activeItem$, '');

    return <div>
        <div className="float-left">{activeItem}</div>
        <div className="float-right">
            <button
                className={btnClasses(sc == 1)}
                onClick={all}>All</button>
            <button
                className={btnClasses(sc == 2)}
                onClick={active}>Active</button>

            <button
                className={btnClasses(sc == 3)}
                onClick={completed}>Completed</button>
        </div>
        <div className="clear-both"></div>
    </div>
}