
import { withLatestFrom } from 'rxjs/operators';
import { parse } from 'jsan';

export function devTools({
    maxAge,
    name
} = { maxAge: 8, name: 'Ajwah DevTools' }) {
    const withDevtools = typeof window === 'object' && typeof window['__REDUX_DEVTOOLS_EXTENSION__'] !== 'undefined';
    return withDevtools ? new _DevTools({ name, maxAge }) : null
}

class _DevTools {
    constructor(config) {
        this.config = config;
    }
    run(ctx) {
        this.ctx = ctx;

        this.devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect(this.config);
        this.unsubscribe = this.devTools.subscribe((message) => this.dispatchMonotorAction(message));
        ctx.dispatcher.pipe(
            withLatestFrom(ctx.store)
        ).subscribe(([action, state]) => {
            if (action.type === 'INIT') {
                this.initValue = state;
            }
            this.sendStatusToDevTools(action, state);
        })
    }
    dispose() {
        this.unsubscribe();
        window.devToolsExtension.disconnect();
    }
    sendStatusToDevTools(action, state) {
        this.devTools.send(action, state);
    }
    setValue(state) {
        this.ctx.store.importState(state);
        return state;
    }
    dispatchMonotorAction(message) {

        if (message.type === 'DISPATCH') {
            switch (message.payload.type) {
                case 'xRESET':
                    this.devTools.init(this.setValue(this.initValue));
                    break;;
                case 'xCOMMIT':
                    this.devTools.init(this.ctx.store.getValue());
                    break;
                case 'xROLLBACK':
                    this.devTools.init(this.setValue(parse(message.state)));
                    break;
                case 'JUMP_TO_STATE':
                case 'JUMP_TO_ACTION':
                    this.setValue(parse(message.state));
                    break;
                case 'xTOGGLE_ACTION':
                    this.devTools.send(null, this.toggleAction(message.payload.id, message.state));
                    break;
                case 'IMPORT_STATE': {
                    const { nextLiftedState } = message.payload;
                    const { computedStates } = nextLiftedState;
                    this.setValue(computedStates[computedStates.length - 1].state);
                    this.devTools.send(null, nextLiftedState);
                    break;
                }
                default:
                    break;
            }
        }
        else if (message.type === 'ACTION') {
            this.ctx.store.next(message.payload);
        }
    }
    toggleAction(id, strState) {

        const liftedState = parse(strState);

        const idx = liftedState.skippedActionIds.indexOf(id);
        const skipped = idx !== -1;
        const start = liftedState.stagedActionIds.indexOf(id);
        if (start === -1) return liftedState;

        this.setValue(liftedState.computedStates[start - 1].state);
        for (let i = (skipped ? start : start + 1); i < liftedState.stagedActionIds.length; i++) {
            if (
                i !== start && liftedState.skippedActionIds.indexOf(liftedState.stagedActionIds[i]) !== -1
            ) continue; // it's already skipped

            //dispatch(store, liftedState.actionsById[liftedState.stagedActionIds[i]].action);
            console.log(liftedState.actionsById[liftedState.stagedActionIds[i]].action);
            //liftedState.computedStates[i].state = this.ctx.store.getValue();
        }

        if (skipped) {
            liftedState.skippedActionIds.splice(idx, 1);
        } else {
            liftedState.skippedActionIds.push(id);
        }
        return liftedState;
    }

}