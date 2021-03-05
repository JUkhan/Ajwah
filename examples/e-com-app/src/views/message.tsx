import React, { memo, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { actionType as at } from '../models';
import { useActionStream } from './hooks';
import { Action, action$ } from 'ajwah-reactive-form';

export const Message = memo(() => {
    const [action] = useActionStream(action$.whereTypes(at.SuccessMessage, at.InfoMessage, at.ErrorMessage), {} as Action);
    const toast = useRef(null as any);
    switch (action.type) {
        case at.SuccessMessage:
            toast.current.show({ severity: 'success', summary: 'Success Message', detail: action.payload, life: 3000 });
            break;

        case at.InfoMessage:
            toast.current.show({ severity: 'info', summary: 'Info Message', detail: action.payload, life: 3000 });
            break;
        case at.ErrorMessage:
            toast.current.show({ severity: 'error', summary: 'Error Message', detail: action.payload, life: 3000 });
            break;
    }
    return <Toast ref={toast} />;
})