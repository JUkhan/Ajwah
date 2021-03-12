import Reacts from 'react';
import { TodoStateController } from "../services/todoStateController";
import { StreamBuilder, Get, useStream } from 'ajwah-reactive-form';


const Errors = () => {
    //const [state] = useStream(TodoStateController, con => con.stream$, conn => conn.state)

    return <StreamBuilder
        //initialData=""
        stream={Get(TodoStateController).error$}
        render={(errorMessage) => <div className="errors">{errorMessage}</div>} />

}
export default Errors;