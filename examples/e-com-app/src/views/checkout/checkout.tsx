import React, { useState } from 'react';
import { Steps } from 'primereact/steps';
import { Button } from 'primereact/button';
import { Delivery } from './delivery';
import { Confirmation } from './confirmation';
import { Payment } from './payment';
import { actionType as at } from '../../models';
import { dispatch, action$ } from 'ajwah-reactive-form';
import { debounceTime, take } from 'rxjs/operators';

export function Checkout() {
    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        { label: 'Delivery' },
        { label: 'Confirmation' },
        { label: 'Payment' },

    ];
    function back() {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1)
        }
    }
    function nextStep() {
        if (activeIndex === 0) {
            dispatch(at.RequestForCheckDelivery);
            action$.whereType(at.DeliveryFormStatus).pipe(debounceTime(10), take(1)).subscribe(action => {
                action.payload && setActiveIndex(activeIndex + 1)
            })
        }
        else if (activeIndex < 3) {
            setActiveIndex(activeIndex + 1)
        }
    }
    const activeStep = activeIndex === 0 ? <Delivery /> : activeIndex === 1 ? <Confirmation /> : <Payment />
    return (
        <div className="steps-demo">
            <div className="card">
                <Steps model={items} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
                <div className="p-mt-4">
                    {activeStep}
                </div>
                <div className="p-d-flex p-jc-between">
                    <Button disabled={activeIndex === 0} label="Back" onClick={back}></Button>
                    <Button disabled={activeIndex === 2} label="Next Step" onClick={nextStep}></Button>
                </div>
            </div>
        </div>
    );
}
function msg(fieldName: string) {
    return `Please input your ${fieldName}`
}