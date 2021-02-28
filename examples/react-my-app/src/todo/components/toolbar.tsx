import React, { FC } from 'react';
import { TodoStateController } from "../services/todoStateController";
import { StreamBuilder, dispatch } from 'ajwah-reactive-form';
import {Props} from '../models/todo';


function btnClasses(isActive: boolean) {
    return `mr-2 text-blue-500 hover:text-blue-800 ${isActive ? 'active' : ''}`
}

const toolbar: FC<Props> = ({ controller }) => {

    return <div>
        <StreamBuilder
            initialData="0"
            stream={controller.activeItem$}
            render={(activeItem) => <div className="float-left">{activeItem}</div>}
        />
        <StreamBuilder
            initialData={1}
            stream={controller.searchCategory$}
            render={(sc) =>
                <>
                    <div className="float-right">
                        <button
                            className={btnClasses(sc == 1)}
                            onClick={() => controller.all()}>All</button>
                        <button
                            className={btnClasses(sc == 2)}
                            onClick={() => controller.active()}>Active</button>

                        <button
                            className={btnClasses(sc == 3)}
                            onClick={() => controller.completed()}>Completed</button>
                    </div>
                    <div className="clear-both"></div>
                </>}
        />
    </div>
}
export default toolbar;