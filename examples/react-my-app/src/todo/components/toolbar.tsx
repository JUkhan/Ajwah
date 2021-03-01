import React, { FC } from 'react';

import { dispatch } from 'ajwah-reactive-form';
import { SearchCategory } from '../models/todo';
export interface Props {
    activeItem: string,
    sc?: number
}


function btnClasses(isActive: boolean) {
    return `mr-2 text-blue-500 hover:text-blue-800 ${isActive ? 'active' : ''}`
}
function filter(category: SearchCategory) {
    dispatch('searchCategory', category)
}
const toolbar: FC<Props> = ({ activeItem, sc }) =>

    <div>
        <div className="float-left">{activeItem}</div>
        <div className="float-right">
            <button
                className={btnClasses(sc == 1)}
                onClick={() => filter(SearchCategory.all)}>All</button>
            <button
                className={btnClasses(sc == 2)}
                onClick={() => filter(SearchCategory.active)}>Active</button>

            <button
                className={btnClasses(sc == 3)}
                onClick={() => filter(SearchCategory.completed)}>Completed</button>
        </div>
        <div className="clear-both"></div>

    </div>

export default toolbar;