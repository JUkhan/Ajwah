import { STATE_METADATA_KEY } from "./tokens";
import { copyObj } from './utils';


export async function combineStates(state, action, store) {
    const states = store.states;
    for (let key in states) {
        var currentSubState = state[key];
        const metaProp = states[key][STATE_METADATA_KEY];
        if (!currentSubState) {
            currentSubState = copyObj(metaProp.initialState);
        }
        const actionProp = metaProp.actions[action.type];
        if (actionProp) {
            const gen = states[key][actionProp](currentSubState, action);
            if (gen.next && gen.throw && gen.return) {
                let newSubState: { hasState?: boolean, state?: any, type?: any } = {};
                let obj;
                do {
                    obj = gen.next(newSubState.state ? newSubState.state : newSubState);
                    newSubState = await Promise.resolve(obj.value);
                    if (newSubState && newSubState.hasState && newSubState.state !== state[key]) {
                        state = store.value;
                        state[key] = newSubState.state;
                        action.type = newSubState.type || action.type;
                        store.stateChange(state, action);
                    }
                } while (!obj.done);
            } else if (typeof gen.then === 'function') {
                Promise.resolve(gen).then(function (newSubState) {
                    if (newSubState !== currentSubState) {
                        state = store.value;
                        state[key] = newSubState;
                        store.stateChange(state, action);
                    }
                })
            } else if (gen !== currentSubState) {
                state[key] = gen;
                store.stateChange(state, action);
            }

        }
        else {
            state[key] = currentSubState;
        }

    }
    if (action.type === '@@INIT') {
        store.stateChange(state, action);
    }

}
