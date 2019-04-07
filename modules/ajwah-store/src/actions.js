import { Observable } from "rxjs";
import { ofType } from "./operators";

export class Actions extends Observable {
    constructor(dispatcher) {
        super()
        if (dispatcher)
            this.source = dispatcher;
    }
    lift(operator) {
        const observable = new Actions(this);
        observable.operator = operator;
        return observable;
    }

    ofType(...actionTypes) {
        return ofType(...actionTypes)(this);

    }


}