import Reacts from 'react';
import { TodoStateController } from "../services/todoStateController";
import { StreamBuilder, Get } from 'ajwah-reactive-form';


const errors = () =>
    <StreamBuilder
        initialData=""
        stream={Get(TodoStateController).error$}
        render={(errorMessage) => <div className="errors">{errorMessage}</div>} />


export default errors;