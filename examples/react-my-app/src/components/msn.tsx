import React from 'react';
import { RxForm, Field } from 'ajwah-reactive-form';
import { PubSub } from './pubsub'

export const Msn = () => <RxForm render={({ observer, handleSubmit }) =>
    <div className="msg-send">
        <Field
            name="msn1"
            observer={observer}
            render={({ setRef, setValue, hasError }) =>
                <PubSub userName="Abdulla" controller={observer} />
            } />
        <Field
            name="msn2"
            observer={observer}
            render={({ setRef, setValue, hasError }) =>
                <PubSub userName="Abdur Rahman" controller={observer} />
            } />

    </div>

} />