import { BehaviorSubject } from "rxjs";


export class Dispatcher extends BehaviorSubject {
    constructor() {
        super({ type: '@@INIT' })
    }

    dispatch(action) {
        this.next(action)
    }

    complete() {

    }

    dispose() {
        super.complete();
    }
}