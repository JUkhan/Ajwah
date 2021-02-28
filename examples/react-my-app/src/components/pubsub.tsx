import React, { FC, useEffect, useState } from "react";
import { pluck } from "rxjs/operators";

import {
    StateObserver,
    RxForm,
    Field,
    required
} from "ajwah-reactive-form";

export interface Message {
    name: string,
    message: string
}
export interface Props {
    userName: string,
    controller: StateObserver
}
export const PubSub: FC<Props> = ({ userName , controller }) => {
    
    const [messages, setMessage] = useState<Message[]>([])
    useEffect(() => {
        const sub = controller.action$.whereType('message').pipe(pluck('payload'))
            .subscribe(msg => {
                setMessage(arr => ([msg, ...arr]))
            });
        return () => sub.unsubscribe();
    },[])

    function sendMessage(state: Message, observer?:StateObserver) {
       controller.dispatch('message', {name:userName, message:state.message});
       observer?.reset();
    }
    
    return <div className="msn">
        <div className="content">
            {messages.map((msg, index) => <div key={index} className="message">{`${msg.name}: ${msg.message}`}</div>)}
        </div>
        <RxForm onSubmit={sendMessage} render={({ observer, handleSubmit }) =>
            <form onSubmit={handleSubmit}>
                <div className="msg-send">
                    <Field
                        name="message"
                        validators={[required('Please input your message')]}
                        autoFocus observer={observer} render={({ value, setValue, hasError }) =>
                            <input className={hasError ? 'hasError' : ''} type="text" value={value} onChange={e => setValue(e.currentTarget.value)} />
                        } />
                    <button type="submit">Send</button>
                </div>
            </form>
        } />
    </div>
}


